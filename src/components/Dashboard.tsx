import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Clock, 
  Star, 
  Euro, 
  Calendar,
  TrendingUp,
  Wallet,
  Send,
  ArrowDownLeft,
  Search,
  Settings,
  LogOut,
  CheckCircle,
  Loader2,
  Bell,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ViewType = 'home' | 'dashboard' | 'search' | 'profile' | 'wallet' | 'notifications';

interface DashboardProps {
  onViewChange: (view: ViewType) => void;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: string;
  transaction_type: string;
  created_at: string;
  client_profile?: { full_name: string };
  provider_profile?: { full_name: string };
}

interface Booking {
  id: string;
  status: string;
  scheduled_date: string;
  notes: string;
  service: { title: string; price: number };
  client_profile?: { full_name: string };
  provider_profile?: { full_name: string };
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  client_profile?: { full_name: string };
  provider_profile?: { full_name: string };
}

interface UserStats {
  completed_services?: number;
  average_rating?: number;
  total_earnings?: number;
  active_services?: number;
  completed_bookings?: number;
  total_spent?: number;
  pending_bookings?: number;
}

const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<UserStats>({});
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          client_profile:profiles!client_id(full_name),
          provider_profile:profiles!provider_id(full_name)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchServiceRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          client_profile:profiles!client_id(full_name),
          provider_profile:profiles!provider_id(full_name)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching service requests:', error);
      } else {
        setServiceRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const fetchNotificationCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error fetching notification count:', error);
      } else {
        setUnreadNotifications(count || 0);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(title, price),
          client_profile:profiles!client_id(full_name),
          provider_profile:profiles!provider_id(full_name)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('scheduled_date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        setStats((data as UserStats) || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([
          fetchTransactions(),
          fetchBookings(),
          fetchServiceRequests(),
          fetchStats(),
          fetchNotificationCount()
        ]);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    onViewChange('home');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewChange('home')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bonjour, {profile.full_name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {profile.user_type === 'provider' ? 'Prestataire' : 'Client'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewChange('search')}
              >
                <Search className="h-4 w-4 mr-2" />
                Chercher
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewChange('wallet')}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Portefeuille
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewChange('notifications')}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 text-xs h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    {profile.user_type === 'provider' ? 'Revenus totaux' : 'Solde'}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatAmount(
                      profile.user_type === 'provider' 
                        ? (stats.total_earnings || 0)
                        : 500
                    )}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">
                    {profile.user_type === 'provider' ? 'Services réalisés' : 'Réservations'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.user_type === 'provider' 
                      ? (stats.completed_services || 0)
                      : (stats.completed_bookings || 0)
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {profile.user_type === 'provider' && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Note moyenne</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.average_rating || 0}/5
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Services actifs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.active_services || 0}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {profile.user_type === 'client' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Dépenses totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatAmount(stats.total_spent || 0)}
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="requests">
              {profile.user_type === 'provider' ? 'Demandes reçues' : 'Mes demandes'}
            </TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="services">
              {profile.user_type === 'provider' ? 'Mes services' : 'Mes réservations'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Service Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      {profile.user_type === 'provider' ? 'Demandes reçues' : 'Demandes envoyées'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {serviceRequests.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune demande</p>
                    ) : (
                      serviceRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{request.title}</p>
                            <p className="text-sm text-gray-600">
                              {profile.user_type === 'client' 
                                ? request.provider_profile?.full_name 
                                : request.client_profile?.full_name
                              } • {formatDate(request.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatAmount(request.budget)}</p>
                            <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                              {request.status === 'pending' ? 'En attente' : 
                               request.status === 'accepted' ? 'Accepté' : 
                               request.status === 'completed' ? 'Terminé' : 'Refusé'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Transactions récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {transactions.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune transaction</p>
                    ) : (
                      transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {profile.user_type === 'client' 
                                  ? transaction.provider_profile?.full_name 
                                  : transaction.client_profile?.full_name
                                } • {formatDate(transaction.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className={`font-bold ${
                            (profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                            (profile.user_type === 'provider' && transaction.transaction_type === 'refund')
                              ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {((profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                              (profile.user_type === 'provider' && transaction.transaction_type === 'refund'))
                              ? '-' : '+'
                            }{formatAmount(transaction.amount)}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {profile.user_type === 'provider' ? 'Demandes reçues' : 'Mes demandes de service'}
                </CardTitle>
                <CardDescription>
                  {profile.user_type === 'provider' ? 
                    'Gérez les demandes de vos clients' : 
                    'Suivez vos demandes de service'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {profile.user_type === 'provider' ? 'Aucune demande reçue' : 'Aucune demande envoyée'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {profile.user_type === 'provider' ? 
                        'Les demandes de vos clients apparaîtront ici' :
                        'Commencez à chercher des services pour envoyer vos premières demandes'
                      }
                    </p>
                    {profile.user_type === 'client' && (
                      <Button onClick={() => onViewChange('search')}>
                        Chercher des services
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{request.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {profile.user_type === 'client' 
                              ? `Envoyé à ${request.provider_profile?.full_name}` 
                              : `De ${request.client_profile?.full_name}`
                            } • {formatDate(request.created_at)}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-bold text-gray-900">{formatAmount(request.budget)}</p>
                          <Badge variant={
                            request.status === 'accepted' ? 'default' : 
                            request.status === 'completed' ? 'default' : 
                            request.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {request.status === 'pending' ? 'En attente' : 
                             request.status === 'accepted' ? 'Accepté' : 
                             request.status === 'completed' ? 'Terminé' : 'Refusé'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>Toutes vos transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune transaction</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            (profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                            (profile.user_type === 'provider' && transaction.transaction_type === 'refund')
                              ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            {((profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                              (profile.user_type === 'provider' && transaction.transaction_type === 'refund')) ? 
                              <Send className="h-5 w-5 text-red-600" /> : 
                              <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {profile.user_type === 'client' 
                                ? transaction.provider_profile?.full_name 
                                : transaction.client_profile?.full_name
                              } • {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            (profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                            (profile.user_type === 'provider' && transaction.transaction_type === 'refund')
                              ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {((profile.user_type === 'client' && transaction.transaction_type === 'payment') ||
                              (profile.user_type === 'provider' && transaction.transaction_type === 'refund'))
                              ? '-' : '+'
                            }{formatAmount(transaction.amount)}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Terminé' : 
                             transaction.status === 'pending' ? 'En cours' : 'Annulé'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {profile.user_type === 'provider' ? 'Mes services' : 'Mes réservations'}
                </CardTitle>
                <CardDescription>
                  {profile.user_type === 'provider' ? 
                    'Gérez vos offres de services' : 
                    'Vos réservations de services'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {profile.user_type === 'provider' ? 'Aucun service actif' : 'Aucune réservation'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {profile.user_type === 'provider' ? 
                        'Commencez à proposer vos services pour recevoir des demandes' :
                        'Commencez à réserver des services'
                      }
                    </p>
                    <Button onClick={() => onViewChange(profile.user_type === 'provider' ? 'profile' : 'search')}>
                      {profile.user_type === 'provider' ? 'Créer un service' : 'Chercher des services'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.service.title}</p>
                          <p className="text-sm text-gray-600">
                            {profile.user_type === 'client' 
                              ? booking.provider_profile?.full_name 
                              : booking.client_profile?.full_name
                            } • {formatDate(booking.scheduled_date)}
                          </p>
                          {booking.notes && (
                            <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-bold text-gray-900">{formatAmount(booking.service.price)}</p>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' : 
                            booking.status === 'completed' ? 'default' : 'secondary'
                          }>
                            {booking.status === 'confirmed' ? 'Confirmé' : 
                             booking.status === 'pending' ? 'En attente' : 
                             booking.status === 'completed' ? 'Terminé' : 'Annulé'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
