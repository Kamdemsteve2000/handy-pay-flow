
import { useState } from "react";
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
  Receive,
  Search,
  Settings,
  LogOut,
  CheckCircle
} from "lucide-react";

type ViewType = 'home' | 'dashboard' | 'search' | 'profile';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onViewChange: (view: ViewType) => void;
}

const Dashboard = ({ user, onLogout, onViewChange }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const recentTransactions = [
    {
      id: 1,
      type: "payment",
      description: "Cours de mathématiques",
      amount: -45,
      date: "2024-01-15",
      status: "completed",
      provider: "Marie Dupont"
    },
    {
      id: 2,
      type: "received",
      description: "Service de plomberie",
      amount: 120,
      date: "2024-01-14",
      status: "completed",
      client: "Jean Martin"
    },
    {
      id: 3,
      type: "payment",
      description: "Design logo",
      amount: -200,
      date: "2024-01-12",
      status: "pending",
      provider: "Studio Creative"
    }
  ];

  const upcomingServices = [
    {
      id: 1,
      title: "Cours d'anglais",
      date: "2024-01-20",
      time: "14:00",
      provider: "Sarah Johnson",
      amount: 35,
      status: "confirmed"
    },
    {
      id: 2,
      title: "Réparation ordinateur",
      date: "2024-01-22",
      time: "10:30",
      provider: "Tech Solutions",
      amount: 80,
      status: "pending"
    }
  ];

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
                Retour
              </Button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-200"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bonjour, {user.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {user.userType === 'provider' ? 'Prestataire' : 'Client'}
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
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
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
                  <p className="text-blue-100 text-sm">Solde</p>
                  <p className="text-2xl font-bold">{user.balance}€</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Services</p>
                  <p className="text-2xl font-bold text-gray-900">{user.completedServices}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {user.userType === 'provider' && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Note moyenne</p>
                      <p className="text-2xl font-bold text-gray-900">{user.rating}/5</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Revenus du mois</p>
                      <p className="text-2xl font-bold text-gray-900">1,240€</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.userType === 'client' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Économies</p>
                    <p className="text-2xl font-bold text-gray-900">15%</p>
                  </div>
                  <Euro className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Transactions récentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.provider || transaction.client} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Services à venir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{service.title}</p>
                        <p className="text-sm text-gray-600">
                          {service.provider} • {service.date} à {service.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{service.amount}€</p>
                        <Badge variant={service.status === 'confirmed' ? 'default' : 'secondary'}>
                          {service.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>Toutes vos transactions récentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {transaction.type === 'payment' ? 
                            <Send className={`h-5 w-5 text-red-600`} /> : 
                            <Receive className={`h-5 w-5 text-green-600`} />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.provider || transaction.client} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status === 'completed' ? 'Terminé' : 'En cours'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {user.userType === 'provider' ? 'Mes services proposés' : 'Services réservés'}
                  </CardTitle>
                  <CardDescription>
                    {user.userType === 'provider' ? 
                      'Gérez vos offres de services' : 
                      'Vos réservations et demandes de services'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.userType === 'provider' ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service actif</h3>
                      <p className="text-gray-600 mb-4">Commencez à proposer vos services pour recevoir des demandes</p>
                      <Button onClick={() => onViewChange('profile')}>
                        Créer un service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{service.title}</p>
                            <p className="text-sm text-gray-600">
                              {service.provider} • {service.date} à {service.time}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-bold text-gray-900">{service.amount}€</p>
                            <Badge variant={service.status === 'confirmed' ? 'default' : 'secondary'}>
                              {service.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
