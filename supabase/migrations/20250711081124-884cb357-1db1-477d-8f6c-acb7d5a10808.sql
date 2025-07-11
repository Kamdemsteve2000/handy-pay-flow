
-- Créer une table pour les demandes de service
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2),
  preferred_date TIMESTAMP WITH TIME ZONE,
  preferred_time TIME,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les portefeuilles des utilisateurs
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les transactions internes
CREATE TABLE public.internal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('transfer', 'payment', 'deposit', 'withdrawal')),
  method TEXT NOT NULL CHECK (method IN ('link', 'qr_code', 'phone_number', 'direct')),
  reference_data TEXT, -- Pour stocker le lien, QR code ou numéro de téléphone
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('transaction', 'service_request', 'payment', 'system')),
  read BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  related_id UUID, -- ID de la transaction, demande de service, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des index pour les performances
CREATE INDEX idx_service_requests_client_id ON public.service_requests(client_id);
CREATE INDEX idx_service_requests_provider_id ON public.service_requests(provider_id);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);
CREATE INDEX idx_internal_transactions_sender_id ON public.internal_transactions(sender_id);
CREATE INDEX idx_internal_transactions_receiver_id ON public.internal_transactions(receiver_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour service_requests
CREATE POLICY "Users can view their own service requests" 
  ON public.service_requests FOR SELECT 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Clients can create service requests" 
  ON public.service_requests FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own service requests" 
  ON public.service_requests FOR UPDATE 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- Politiques RLS pour wallets
CREATE POLICY "Users can view their own wallet" 
  ON public.wallets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" 
  ON public.wallets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Create wallet for user" 
  ON public.wallets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour internal_transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.internal_transactions FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create transactions" 
  ON public.internal_transactions FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "System can update transactions" 
  ON public.internal_transactions FOR UPDATE 
  USING (true);

-- Politiques RLS pour notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (true);

-- Fonction pour créer automatiquement un portefeuille lors de la création d'un profil
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un portefeuille
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_wallet();

-- Fonction pour envoyer des notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  user_id UUID,
  title TEXT,
  message TEXT,
  notification_type TEXT,
  related_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  VALUES (user_id, title, message, notification_type, related_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
