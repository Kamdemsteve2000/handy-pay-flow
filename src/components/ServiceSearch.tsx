
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Euro,
  ArrowLeft,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  Heart,
  HeartOff
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ServiceSearchProps {
  onBack: () => void;
  onLogin: () => void;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  provider: {
    id: string;
    full_name: string;
    avatar_url?: string;
    phone?: string;
    email?: string;
  };
}

interface Favorite {
  id: string;
  user_id: string;
  service_id: string;
}

const ServiceSearch = ({ onBack, onLogin }: ServiceSearchProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    budget: "",
    date: "",
    time: ""
  });

  const categories = [
    { id: "all", name: "Toutes catégories" },
    { id: "education", name: "Cours particuliers" },
    { id: "tech", name: "Informatique" },
    { id: "repair", name: "Réparations" },
    { id: "creative", name: "Créatif" },
    { id: "home", name: "Maison" },
    { id: "health", name: "Santé & Bien-être" }
  ];

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:profiles!provider_id(id, full_name, avatar_url, phone, email)
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching services:', error);
        toast.error('Erreur lors du chargement des services');
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
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

  useEffect(() => {
    fetchServices();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const isFavorite = (serviceId: string) => {
    return favorites.some(fav => fav.service_id === serviceId);
  };

  const toggleFavorite = async (serviceId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      onLogin();
      return;
    }

    const isCurrentlyFavorite = isFavorite(serviceId);

    try {
      if (isCurrentlyFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('service_id', serviceId);

        if (error) {
          console.error('Error removing favorite:', error);
          toast.error('Erreur lors de la suppression du favori');
        } else {
          setFavorites(prev => prev.filter(fav => fav.service_id !== serviceId));
          toast.success('Retiré des favoris');
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            service_id: serviceId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          toast.error('Erreur lors de l\'ajout aux favoris');
        } else {
          fetchFavorites();
          toast.success('Ajouté aux favoris');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la modification des favoris');
    }
  };

  const handleContactProvider = (service: Service) => {
    if (!user) {
      toast.error("Vous devez être connecté pour contacter un prestataire");
      onLogin();
      return;
    }
    setSelectedService(service);
    setIsContactModalOpen(true);
  };

  const handleRequestService = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer une demande");
      onLogin();
      return;
    }

    if (!requestForm.title || !requestForm.description || !requestForm.budget) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!selectedService) return;

    setSubmitting(true);
    try {
      const preferredDateTime = requestForm.date && requestForm.time 
        ? `${requestForm.date}T${requestForm.time}:00.000Z`
        : null;

      const { error } = await supabase
        .from('service_requests')
        .insert({
          client_id: user.id,
          provider_id: selectedService.provider.id,
          service_id: selectedService.id,
          title: requestForm.title,
          description: requestForm.description,
          budget: parseFloat(requestForm.budget),
          preferred_date: preferredDateTime,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating service request:', error);
        toast.error('Erreur lors de l\'envoi de la demande');
      } else {
        // Créer une notification pour le prestataire
        await supabase.rpc('create_notification', {
          user_id: selectedService.provider.id,
          title: 'Nouvelle demande de service',
          message: `${user.email} a fait une demande pour "${requestForm.title}"`,
          notification_type: 'service_request'
        });

        toast.success("Demande envoyée avec succès ! Le prestataire va vous répondre rapidement.");
        setIsRequestModalOpen(false);
        setRequestForm({ title: "", description: "", budget: "", date: "", time: "" });
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const callProvider = (phone?: string) => {
    if (!phone) {
      toast.error("Numéro de téléphone non disponible");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const emailProvider = (email?: string) => {
    if (!email) {
      toast.error("Email non disponible");
      return;
    }
    window.location.href = `mailto:${email}`;
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
              <h1 className="text-xl font-bold">Rechercher un service</h1>
            </div>
            {!user && <Button onClick={onLogin}>Se connecter</Button>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un service ou un prestataire..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={service.provider.avatar_url} />
                      <AvatarFallback>{service.provider.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{service.provider.full_name}</h3>
                      <p className="text-sm text-gray-600">{service.title}</p>
                    </div>
                  </div>
                  <Badge variant="default">Disponible</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.8</span>
                    <span className="text-sm text-gray-500">(25 avis)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">€{service.price}</span>
                    <span className="text-sm text-gray-500">/h</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{service.duration} min</span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>

                <Badge variant="outline" className="text-xs">
                  {categories.find(cat => cat.id === service.category)?.name}
                </Badge>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleContactProvider(service)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFavorite(service.id)}
                  >
                    {isFavorite(service.id) ? (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun service trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter le prestataire</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedService.provider.avatar_url} />
                  <AvatarFallback>{selectedService.provider.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedService.provider.full_name}</h4>
                  <p className="text-sm text-gray-600">{selectedService.title}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setIsContactModalOpen(false);
                    setRequestForm({ 
                      title: `Demande pour ${selectedService.title}`,
                      description: "",
                      budget: selectedService.price.toString(),
                      date: "",
                      time: ""
                    });
                    setIsRequestModalOpen(true);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Envoyer une demande de service
                </Button>

                {selectedService.provider.phone && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => callProvider(selectedService.provider.phone)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler: {selectedService.provider.phone}
                  </Button>
                )}

                {selectedService.provider.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => emailProvider(selectedService.provider.email)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email: {selectedService.provider.email}
                  </Button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Service Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demander un service</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedService.provider.avatar_url} />
                  <AvatarFallback>{selectedService.provider.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedService.provider.full_name}</h4>
                  <p className="text-sm text-gray-600">{selectedService.title}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du service *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Cours de mathématiques niveau terminale"
                    value={requestForm.title}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez vos besoins en détail..."
                    rows={3}
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="budget"
                        placeholder="50"
                        className="pl-10"
                        value={requestForm.budget}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date">Date souhaitée</Label>
                    <Input
                      id="date"
                      type="date"
                      value={requestForm.date}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Heure préférée</Label>
                  <Input
                    id="time"
                    type="time"
                    value={requestForm.time}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={handleRequestService}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Envoyer la demande
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRequestModalOpen(false)}
                  disabled={submitting}
                >
                  Annuler
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Le prestataire recevra votre demande et pourra vous répondre rapidement.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceSearch;
