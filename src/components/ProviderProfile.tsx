
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Star, 
  Euro, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Plus,
  Minus,
  Upload,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface ProviderProfileProps {
  onBack: () => void;
}

const ProviderProfile = ({ onBack }: ProviderProfileProps) => {
  const [activeTab, setActiveTab] = useState("create");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    description: "",
    hourlyRate: "",
    location: "",
    skills: [""],
    availability: {
      monday: { available: true, start: "09:00", end: "18:00" },
      tuesday: { available: true, start: "09:00", end: "18:00" },
      wednesday: { available: true, start: "09:00", end: "18:00" },
      thursday: { available: true, start: "09:00", end: "18:00" },
      friday: { available: true, start: "09:00", end: "18:00" },
      saturday: { available: false, start: "09:00", end: "18:00" },
      sunday: { available: false, start: "09:00", end: "18:00" }
    }
  });

  const specialties = [
    "Cours particuliers",
    "Développement web",
    "Design graphique",
    "Réparation électronique",
    "Plomberie",
    "Électricité",
    "Ménage",
    "Jardinage",
    "Photographie",
    "Traduction",
    "Rédaction",
    "Autre"
  ];

  const handleInputChange = (field: string, value: any) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...profileForm.skills];
    newSkills[index] = value;
    setProfileForm(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setProfileForm(prev => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index: number) => {
    if (profileForm.skills.length > 1) {
      const newSkills = profileForm.skills.filter((_, i) => i !== index);
      setProfileForm(prev => ({ ...prev, skills: newSkills }));
    }
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setProfileForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmitProfile = () => {
    if (!profileForm.name || !profileForm.email || !profileForm.specialty || !profileForm.hourlyRate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success("Profil créé avec succès ! Vous pouvez maintenant recevoir des demandes.");
    // Ici, on sauvegarderait normalement le profil
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

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
              <h1 className="text-xl font-bold">Espace prestataire</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="create">Créer mon profil</TabsTrigger>
            <TabsTrigger value="benefits">Avantages</TabsTrigger>
            <TabsTrigger value="help">Aide</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Ces informations seront visibles par vos futurs clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={profileForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={profileForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      placeholder="+33 6 12 34 56 78"
                      value={profileForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Localisation *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Paris, Lyon, Marseille..."
                        className="pl-10"
                        value={profileForm.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description de votre profil</Label>
                  <Textarea
                    id="description"
                    placeholder="Présentez-vous et décrivez vos services..."
                    rows={4}
                    value={profileForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services proposés</CardTitle>
                <CardDescription>
                  Décrivez vos compétences et votre tarification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="specialty">Spécialité principale *</Label>
                    <Select value={profileForm.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hourlyRate">Tarif horaire *</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="hourlyRate"
                        placeholder="25"
                        className="pl-10"
                        value={profileForm.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                      />
                      <span className="absolute right-3 top-3 text-gray-400">/h</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Compétences et services</Label>
                  <div className="space-y-3">
                    {profileForm.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Ex: Mathématiques niveau lycée"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          disabled={profileForm.skills.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSkill}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une compétence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilités</CardTitle>
                <CardDescription>
                  Indiquez vos créneaux de disponibilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {days.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-20">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={profileForm.availability[key].available}
                            onChange={(e) => handleAvailabilityChange(key, 'available', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">{label}</span>
                        </label>
                      </div>
                      
                      {profileForm.availability[key].available && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={profileForm.availability[key].start}
                            onChange={(e) => handleAvailabilityChange(key, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-500">à</span>
                          <Input
                            type="time"
                            value={profileForm.availability[key].end}
                            onChange={(e) => handleAvailabilityChange(key, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleSubmitProfile}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Créer mon profil prestataire
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="benefits">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Euro className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Revenus supplémentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Monétisez vos compétences et générez des revenus complémentaires 
                    en proposant vos services à une large clientèle.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Large audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Accédez à des milliers de clients potentiels qui recherchent 
                    exactement vos services dans votre région.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Paiements sécurisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Recevez vos paiements rapidement et en toute sécurité. 
                    Nous nous occupons de toute la gestion financière.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle>Flexibilité totale</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Travaillez quand vous voulez, acceptez les missions qui vous intéressent 
                    et gérez votre emploi du temps comme bon vous semble.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle>Réputation en ligne</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Construisez votre réputation professionnelle grâce aux avis clients 
                    et augmentez votre visibilité sur la plateforme.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle>Croissance assurée</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Plus vous réalisez de services de qualité, plus votre classement 
                    s'améliore et plus vous recevez de demandes.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Prêt à commencer ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Rejoignez des milliers de prestataires qui font confiance à HandyPay 
                  pour développer leur activité.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setActiveTab("create")}
                >
                  Créer mon profil maintenant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Foire aux questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Comment créer mon profil prestataire ?</h4>
                    <p className="text-gray-600">
                      Cliquez sur "Créer mon profil", remplissez toutes les informations demandées, 
                      définissez vos tarifs et disponibilités, puis validez votre inscription.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Quand suis-je payé pour mes services ?</h4>
                    <p className="text-gray-600">
                      Le paiement est effectué dès la validation du service par le client. 
                      Les fonds sont disponibles sur votre compte dans les 24h.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Y a-t-il des frais de commission ?</h4>
                    <p className="text-gray-600">
                      Nous prélevons une commission de 5% sur chaque transaction pour 
                      maintenir la plateforme et assurer la sécurité des paiements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Comment gérer mes disponibilités ?</h4>
                    <p className="text-gray-600">
                      Vous pouvez modifier vos créneaux de disponibilité à tout moment 
                      depuis votre tableau de bord prestataire.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 text-left">
                      <div>
                        <h4 className="font-semibold mb-1">Centre d'aide</h4>
                        <p className="text-sm text-gray-600">
                          Consultez notre documentation complète
                        </p>
                      </div>
                    </Button>

                    <Button variant="outline" className="h-auto p-4 text-left">
                      <div>
                        <h4 className="font-semibold mb-1">Support client</h4>
                        <p className="text-sm text-gray-600">
                          Contactez notre équipe support
                        </p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderProfile;
