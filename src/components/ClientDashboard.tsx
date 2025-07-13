
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Home,
  Search, 
  Heart, 
  Clock, 
  CheckCircle, 
  Star,
  Loader2,
  MessageSquare,
  Calendar,
  Euro
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ClientDashboardProps {
  onBack: () => void;
  onHome: () => void;
  onSearch: () => void;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  provider: {
    full_name: string;
  };
}

interface Favorite {
  id: string;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    provider: {
      full_name: string;
    };
  };
}

const ClientDashboard = ({ onBack, onHome, onSearch }: ClientDashboardProps) => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchStats(),
        fetchServiceRequests(),
        fetchFavorites()
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
          provider:profiles!provider_id(full_name)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          service:services(
            id,
            title,
            description,
            price,
            category,
            provider:profiles!provider_id(full_name)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites(data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        toast.error('Erreur lors de la suppression');
      } else {
        toast.success('Service retiré des favoris');
        fetchFavorites();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
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
              <h1 className="text-xl font-bold">Mon espace client</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onHome}>
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              <Button onClick={onSearch}>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
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
            Gérez vos demandes de services et suivez vos activités
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="requests">
              Mes demandes
              {requests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {requests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favoris
              <Badge variant="secondary" className="ml-2">
                {favorites.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services réservés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.completed_bookings || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
                  <Euro className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    €{stats?.total_spent || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demandes en cours</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.pending_bookings || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Trouvez rapidement ce que vous cherchez
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={onSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher un service
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('favorites')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Voir mes favoris
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('requests')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mes demandes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid gap-4">
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore fait de demandes de service.</p>
                    <Button onClick={onSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher un service
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <CardDescription>
                            Demandé à {request.provider.full_name} • {new Date(request.created_at).toLocaleDateString()}
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
                        {request.status === 'accepted' && (
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            Prêt à programmer
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid gap-4">
              {favorites.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun favori</h3>
                    <p className="text-gray-500 mb-4">Ajoutez des services à vos favoris pour les retrouver facilement.</p>
                    <Button onClick={onSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Découvrir des services
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                favorites.map((favorite) => (
                  <Card key={favorite.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{favorite.service.title}</CardTitle>
                          <CardDescription>
                            Par {favorite.service.provider.full_name} • {favorite.service.category}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">€{favorite.service.price}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{favorite.service.description}</p>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
