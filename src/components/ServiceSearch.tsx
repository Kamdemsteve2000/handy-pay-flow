
import { useState } from "react";
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
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface ServiceSearchProps {
  onBack: () => void;
  onLogin: () => void;
}

const ServiceSearch = ({ onBack, onLogin }: ServiceSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    budget: "",
    date: "",
    time: ""
  });

  // Données simulées de prestataires
  const providers = [
    {
      id: 1,
      name: "Sophie Martin",
      specialty: "Cours particuliers",
      category: "education",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 25,
      location: "Paris 15e",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie",
      description: "Professeure de mathématiques avec 8 ans d'expérience. Spécialisée dans la préparation au bac.",
      skills: ["Mathématiques", "Physique", "Préparation concours"],
      availability: "Disponible",
      completedJobs: 89
    },
    {
      id: 2,
      name: "Thomas Dubois",
      specialty: "Développement web",
      category: "tech",
      rating: 4.8,
      reviews: 94,
      hourlyRate: 45,
      location: "Lyon",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
      description: "Développeur fullstack freelance. Création de sites web et applications sur mesure.",
      skills: ["React", "Node.js", "Python", "Design UI/UX"],
      availability: "Occupé jusqu'au 15/01",
      completedJobs: 156
    },
    {
      id: 3,
      name: "Marie Leroy",
      specialty: "Réparation électronique",
      category: "repair",
      rating: 4.7,
      reviews: 203,
      hourlyRate: 35,
      location: "Marseille",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
      description: "Technicienne spécialisée en réparation d'ordinateurs et smartphones.",
      skills: ["Réparation PC", "Smartphones", "Récupération données"],
      availability: "Disponible",
      completedJobs: 267
    },
    {
      id: 4,
      name: "Pierre Garcia",
      specialty: "Photographie",
      category: "creative",
      rating: 4.9,
      reviews: 78,
      hourlyRate: 60,
      location: "Toulouse",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre",
      description: "Photographe professionnel pour événements, portraits et mariages.",
      skills: ["Mariage", "Portrait", "Événementiel", "Retouche"],
      availability: "Disponible",
      completedJobs: 124
    }
  ];

  const categories = [
    { id: "all", name: "Toutes catégories" },
    { id: "education", name: "Cours particuliers" },
    { id: "tech", name: "Informatique" },
    { id: "repair", name: "Réparations" },
    { id: "creative", name: "Créatif" },
    { id: "home", name: "Maison" },
    { id: "health", name: "Santé & Bien-être" }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleRequestService = () => {
    if (!requestForm.title || !requestForm.description || !requestForm.budget) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success("Demande envoyée avec succès ! Le prestataire va vous répondre rapidement.");
    setIsRequestModalOpen(false);
    setRequestForm({ title: "", description: "", budget: "", date: "", time: "" });
  };

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
            <Button onClick={onLogin}>Se connecter</Button>
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
            {filteredProviders.length} prestataire{filteredProviders.length > 1 ? 's' : ''} trouvé{filteredProviders.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.avatar} />
                      <AvatarFallback>{provider.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-gray-600">{provider.specialty}</p>
                    </div>
                  </div>
                  <Badge variant={provider.availability === "Disponible" ? "default" : "secondary"}>
                    {provider.availability === "Disponible" ? "Dispo" : "Occupé"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviews} avis)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">€{provider.hourlyRate}</span>
                    <span className="text-sm text-gray-500">/h</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{provider.completedJobs} services</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {provider.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {provider.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {provider.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      setSelectedProvider(provider);
                      setIsRequestModalOpen(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun prestataire trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Request Service Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demander un service</DialogTitle>
          </DialogHeader>

          {selectedProvider && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedProvider.avatar} />
                  <AvatarFallback>{selectedProvider.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedProvider.name}</h4>
                  <p className="text-sm text-gray-600">{selectedProvider.specialty}</p>
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
                >
                  Envoyer la demande
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRequestModalOpen(false)}
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
