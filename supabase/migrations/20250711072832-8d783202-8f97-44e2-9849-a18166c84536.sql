
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'provider')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table for providers
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund')),
  description TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create provider ratings table
CREATE TABLE public.provider_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id) -- Only one rating per booking
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can view provider profiles" 
  ON public.profiles FOR SELECT 
  USING (user_type = 'provider' OR auth.uid() = id);

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" 
  ON public.services FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Providers can manage their own services" 
  ON public.services FOR ALL 
  USING (auth.uid() = provider_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Clients can create transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions FOR UPDATE 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Clients can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- RLS Policies for ratings
CREATE POLICY "Users can view ratings for providers" 
  ON public.provider_ratings FOR SELECT 
  USING (true);

CREATE POLICY "Clients can create ratings for their bookings" 
  ON public.provider_ratings FOR INSERT 
  WITH CHECK (
    auth.uid() = client_id AND 
    EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND client_id = auth.uid())
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_data public.profiles%ROWTYPE;
  stats JSON;
BEGIN
  SELECT * INTO profile_data FROM public.profiles WHERE id = user_id;
  
  IF profile_data.user_type = 'provider' THEN
    SELECT json_build_object(
      'completed_services', COALESCE((
        SELECT COUNT(*) FROM public.bookings 
        WHERE provider_id = user_id AND status = 'completed'
      ), 0),
      'average_rating', COALESCE((
        SELECT ROUND(AVG(rating), 1) FROM public.provider_ratings 
        WHERE provider_id = user_id
      ), 0),
      'total_earnings', COALESCE((
        SELECT SUM(amount) FROM public.transactions 
        WHERE provider_id = user_id AND status = 'completed'
      ), 0),
      'active_services', COALESCE((
        SELECT COUNT(*) FROM public.services 
        WHERE provider_id = user_id AND is_active = true
      ), 0)
    ) INTO stats;
  ELSE
    SELECT json_build_object(
      'completed_bookings', COALESCE((
        SELECT COUNT(*) FROM public.bookings 
        WHERE client_id = user_id AND status = 'completed'
      ), 0),
      'total_spent', COALESCE((
        SELECT SUM(amount) FROM public.transactions 
        WHERE client_id = user_id AND status = 'completed'
      ), 0),
      'pending_bookings', COALESCE((
        SELECT COUNT(*) FROM public.bookings 
        WHERE client_id = user_id AND status IN ('pending', 'confirmed')
      ), 0)
    ) INTO stats;
  END IF;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
