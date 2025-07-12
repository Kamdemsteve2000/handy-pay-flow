import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Home,
  Bell, 
  DollarSign, 
  Users, 
  Calendar, 
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  Loader2,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DashboardProps {
  onBack: () => void;
  onHome: () => void;
  onNotifications: () => void;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  client: {
    full_name: string;
  };
}

const Dashboard = ({ onBack, onHome, onNotifications }: DashboardProps) => {
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchStats(),
        fetchServiceRequests()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        user_id: user.id
      });
      
      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchServiceRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          client:profiles!client_id(full_name)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
      } else {
        setServiceRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) {
        toast.error('Erreur lors de la mise à jour');
      } else {
        toast.success('Demande mise à jour avec succès');
        fetchServiceRequests();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onHome();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">Tableau de bord</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onHome}>
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              <Button variant="outline" onClick={onNotifications}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Bonjour, {profile?.full_name} !
          </h2>
          <p className="text-gray-600">
            {profile?.user_type === 'provider' ? 'Gérez vos services et demandes' : 'Suivez vos demandes de service'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="requests">
              Demandes reçues
              {serviceRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {serviceRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services terminés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile?.user_type === 'provider' ? stats?.completed_services || 0 : stats?.completed_bookings || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.user_type === 'provider' ? 'Note moyenne' : 'Total dépensé'}
                  </CardTitle>
                  {profile?.user_type === 'provider' ? (
                    <Star className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile?.user_type === 'provider' 
                      ? `${stats?.average_rating || 0}/5`
                      : `€${stats?.total_spent || 0}`
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.user_type === 'provider' ? 'Gains totaux' : 'Réservations en cours'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile?.user_type === 'provider' 
                      ? `€${stats?.total_earnings || 0}`
                      : stats?.pending_bookings || 0
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services actifs</CardTitle>
                  <Plus className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.active_services || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid gap-4">
              {serviceRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
                    <p className="text-gray-500">Vous n'avez pas encore reçu de demandes de service.</p>
                  </CardContent>
                </Card>
              ) : (
                serviceRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <CardDescription>
                            Par {request.client.full_name} • {new Date(request.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            request.status === 'pending' ? 'default' : 
                            request.status === 'accepted' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {request.status === 'pending' ? 'En attente' :
                           request.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{request.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Budget : €{request.budget}</span>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateRequestStatus(request.id, 'accepted')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                            >
                              Refuser
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
