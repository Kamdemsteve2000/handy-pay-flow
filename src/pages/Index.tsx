import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, CheckCircle, Star, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import ServiceSearch from "@/components/ServiceSearch";
import Dashboard from "@/components/Dashboard";
import ProviderProfile from "@/components/ProviderProfile";
import NotificationsPage from "@/components/NotificationsPage";
import WalletPage from "@/components/WalletPage";
import ContactPage from "@/components/ContactPage";
import AboutPage from "@/components/AboutPage";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

type ViewType = 'home' | 'dashboard' | 'search' | 'profile' | 'notifications' | 'wallet' | 'contact' | 'about';

const IndexContent = () => {
  const { user, profile, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [pendingProviderRegistration, setPendingProviderRegistration] = useState(false);

  // Redirect authenticated users to dashboard
  if (user && profile && activeView === 'home' && !pendingProviderRegistration) {
    setActiveView('dashboard');
  }

  // Handle provider registration flow
  const handleBecomeProvider = () => {
    if (!user) {
      setPendingProviderRegistration(true);
      setIsAuthModalOpen(true);
    } else {
      setActiveView('profile');
    }
  };

  // Handle successful authentication for provider registration
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingProviderRegistration) {
      setPendingProviderRegistration(false);
      setActiveView('profile');
    }
  };

  const handleProviderProfileSuccess = () => {
    setActiveView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (activeView === 'search') {
    return (
      <ServiceSearch 
        onBack={() => setActiveView('home')} 
        onLogin={() => setIsAuthModalOpen(true)}
      />
    );
  }

  if (activeView === 'dashboard') {
    return (
      <Dashboard 
        onBack={() => setActiveView('home')}
        onHome={() => setActiveView('home')}
        onNotifications={() => setActiveView('notifications')}
      />
    );
  }

  if (activeView === 'profile') {
    return (
      <ProviderProfile 
        onBack={() => setActiveView('home')}
        onSuccess={handleProviderProfileSuccess}
      />
    );
  }

  if (activeView === 'notifications') {
    return <NotificationsPage onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'wallet') {
    return <WalletPage onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'contact') {
    return <ContactPage onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'about') {
    return <AboutPage onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HandyPay
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveView('about')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                À propos
              </button>
              <button 
                onClick={() => setActiveView('contact')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </button>
              {user && (
                <>
                  <button 
                    onClick={() => setActiveView('notifications')}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Notifications
                  </button>
                  <button 
                    onClick={() => setActiveView('wallet')}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Portefeuille
                  </button>
                  <button 
                    onClick={() => setActiveView('dashboard')}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </button>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Bonjour, {profile?.full_name}</span>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trouvez le service parfait près de chez vous
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec des professionnels qualifiés pour tous vos besoins. 
            Paiement sécurisé et satisfaction garantie.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setActiveView('search')}
            >
              <Search className="mr-2 h-5 w-5" />
              Rechercher un service
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleBecomeProvider}
            >
              <Users className="mr-2 h-5 w-5" />
              Devenir prestataire
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir HandyPay ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Professionnels vérifiés</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tous nos prestataires sont soigneusement sélectionnés et évalués 
                  par la communauté pour garantir la qualité.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Paiement sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Système de paiement intégré et sécurisé. Payez seulement 
                  quand vous êtes satisfait du service.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Support 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Notre équipe est là pour vous accompagner à chaque étape, 
                  de la recherche au paiement final.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Prêt à commencer ?</h3>
              <p className="text-blue-100 mb-8 text-lg">
                Rejoignez des milliers d'utilisateurs qui font confiance à HandyPay
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setActiveView('search')}
                >
                  Trouver un service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleBecomeProvider}
                >
                  Proposer mes services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                <span className="text-lg font-bold">HandyPay</span>
              </div>
              <p className="text-gray-400">
                La plateforme qui connecte clients et prestataires de services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Cours particuliers</li>
                <li>Services à domicile</li>
                <li>Réparations</li>
                <li>Informatique</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveView('contact')}>Contact</button></li>
                <li><button onClick={() => setActiveView('about')}>À propos</button></li>
                <li>FAQ</li>
                <li>Aide</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Conditions d'utilisation</li>
                <li>Politique de confidentialité</li>
                <li>Mentions légales</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HandyPay. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingProviderRegistration(false);
        }}
        onSuccess={handleAuthSuccess}
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
