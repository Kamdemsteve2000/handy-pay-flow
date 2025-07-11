
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CreditCard, Shield, Star, Calendar, Users, Wallet, CheckCircle } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import ServiceSearch from "@/components/ServiceSearch";
import ProviderProfile from "@/components/ProviderProfile";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

const IndexContent = () => {
  const { user, profile, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'search' | 'profile'>('home');

  // Redirect authenticated users to dashboard
  if (user && profile && activeView === 'home') {
    setActiveView('dashboard');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HandyPay
          </h1>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user && profile && activeView === 'dashboard') {
    return <Dashboard onViewChange={setActiveView} />;
  }

  if (activeView === 'search') {
    return <ServiceSearch onBack={() => setActiveView('home')} onLogin={() => setIsAuthModalOpen(true)} />;
  }

  if (activeView === 'profile') {
    return <ProviderProfile onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HandyPay
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => setActiveView('search')}>Trouver un service</Button>
              <Button variant="ghost" onClick={() => setActiveView('profile')}>Devenir prestataire</Button>
              {user ? (
                <Button onClick={() => setActiveView('dashboard')}>Tableau de bord</Button>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>Se connecter</Button>
              )}
            </nav>

            <Button 
              className="md:hidden"
              onClick={() => user ? setActiveView('dashboard') : setIsAuthModalOpen(true)}
            >
              {user ? 'Dashboard' : 'Connexion'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Paiements sécurisés pour tous vos services
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec des prestataires qualifiés et payez en toute sécurité. 
            Cours particuliers, réparations, freelance... tout en un seul endroit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              onClick={() => setActiveView('search')}
            >
              <Search className="mr-2 h-5 w-5" />
              Chercher un service
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 hover:bg-gray-50"
              onClick={() => setActiveView('profile')}
            >
              <Users className="mr-2 h-5 w-5" />
              Proposer mes services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10k+</div>
              <div className="text-gray-600">Prestataires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50k+</div>
              <div className="text-gray-600">Services réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Comment ça marche ?</h3>
            <p className="text-xl text-gray-600">Un processus simple et sécurisé en 3 étapes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>1. Trouvez votre prestataire</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Recherchez parmi nos prestataires qualifiés ou saisissez directement 
                  les coordonnées de votre prestataire habituel.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>2. Réservez et confirmez</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Décrivez votre besoin, fixez le budget et le créneau. 
                  Le prestataire accepte votre demande.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>3. Payez en sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Effectuez le paiement via notre plateforme sécurisée. 
                  L'argent est protégé jusqu'à la fin du service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services populaires */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Services populaires</h3>
            <p className="text-xl text-gray-600">Découvrez les services les plus demandés</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Cours particuliers", count: "2.5k+", color: "bg-blue-500" },
              { name: "Réparations", count: "1.8k+", color: "bg-green-500" },
              { name: "Développement web", count: "1.2k+", color: "bg-purple-500" },
              { name: "Design graphique", count: "900+", color: "bg-orange-500" },
              { name: "Ménage", count: "2.1k+", color: "bg-pink-500" },
              { name: "Jardinage", count: "800+", color: "bg-emerald-500" },
              { name: "Traduction", count: "600+", color: "bg-indigo-500" },
              { name: "Photography", count: "750+", color: "bg-red-500" }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{service.name}</h4>
                  <Badge variant="secondary">{service.count} prestataires</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Paiements 100% sécurisés</h3>
            <p className="text-xl text-gray-600 mb-8">
              Vos données et vos paiements sont protégés par les dernières technologies 
              de chiffrement et de sécurité bancaire.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Chiffrement SSL</h4>
                <p className="text-gray-600">Toutes les données sont chiffrées</p>
              </div>
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Paiement différé</h4>
                <p className="text-gray-600">L'argent est bloqué puis libéré</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Système de notation</h4>
                <p className="text-gray-600">Prestataires vérifiés et notés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">HandyPay</h1>
            </div>
            <p className="text-gray-400 mb-6">
              La plateforme de paiement qui connecte clients et prestataires en toute sécurité.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 HandyPay</span>
              <span>•</span>
              <span>Conditions générales</span>
              <span>•</span>
              <span>Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
