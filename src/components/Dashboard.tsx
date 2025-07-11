
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Star, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Euro,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onViewChange: (view: string) => void;
}

const Dashboard = ({ user, onLogout, onViewChange }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Données simulées pour les transactions
  const transactions = [
    {
      id: 1,
      type: "received",
      amount: 120,
      description: "Cours de mathématiques - 2h",
      client: "Marie Dubois",
      date: "2024-01-10",
      status: "completed"
    },
    {
      id: 2,
      type: "sent",
      amount: 85,
      description: "Réparation ordinateur",
      provider: "Tech Solutions",
      date: "2024-01-09",
      status: "completed"
    },
    {
      id: 3,
      type: "pending",
      amount: 150,
      description: "Cours de piano - 3h",
      client: "Paul Martin",
      date: "2024-01-11",
      status: "pending"
    }
  ];

  const upcomingServices = [
    {
      id: 1,
      title: "Cours de mathématiques",
      client: "Sophie Laurent",
      date: "2024-01-12",
      time: "14:00",
      amount: 60,
      status: "confirmed"
    },
    {
      id: 2,
      title: "Réparation plomberie",
      provider: "Plombier Express",
      date: "2024-01-13",
      time: "09:00",
      amount: 180,
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HandyPay</h1>
                <p className="text-sm text-gray-500">Tableau de bord</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant={user.userType === 'provider' ? 'default' : 'secondary'} className="capitalize">
                {user.userType === 'provider' ? 'Prestataire' : 'Client'}
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Solde</p>
                  <p className="text-2xl font-bold text-green-600">€{user.balance}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Services</p>
                  <p className="text-2xl font-bold">{user.completedServices}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {user.userType === 'provider' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-2xl font-bold">{user.rating}</p>
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ce mois</p>
                  <p className="text-2xl font-bold text-purple-600">€{Math.floor(user.balance * 0.3)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transactions récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Transactions récentes
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'received' ? 'bg-green-100' : 
                            transaction.type === 'sent' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {transaction.type === 'received' ? (
                              <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            ) : transaction.type === 'sent' ? (
                              <ArrowUpRight className="h-5 w-5 text-red-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.client || transaction.provider} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'received' ? 'text-green-600' : 
                            transaction.type === 'sent' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {transaction.type === 'sent' ? '-' : '+'}€{transaction.amount}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services à venir */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Services à venir
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{service.title}</p>
                            <p className="text-sm text-gray-500">
                              {service.client || service.provider} • {service.date} à {service.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{service.amount}</p>
                          <Badge variant={service.status === 'confirmed' ? 'default' : 'secondary'}>
                            {service.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historique des transactions</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          transaction.type === 'received' ? 'bg-green-100' : 
                          transaction.type === 'sent' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {transaction.type === 'received' ? (
                            <ArrowDownLeft className="h-6 w-6 text-green-600" />
                          ) : transaction.type === 'sent' ? (
                            <ArrowUpRight className="h-6 w-6 text-red-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.client || transaction.provider}
                          </p>
                          <p className="text-xs text-gray-400">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-semibold ${
                          transaction.type === 'received' ? 'text-green-600' : 
                          transaction.type === 'sent' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {transaction.type === 'sent' ? '-' : '+'}€{transaction.amount}
                        </p>
                        <Badge variant="outline">
                          {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des services</CardTitle>
                <CardDescription>
                  {user.userType === 'provider' 
                    ? 'Gérez vos services et vos disponibilités' 
                    : 'Suivez vos demandes de services'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Fonctionnalité en développement</h3>
                  <p className="text-gray-500 mb-4">Cette section permettra de gérer vos services et rendez-vous.</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil utilisateur</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <p className="text-gray-500">{user.email}</p>
                      <Badge className="mt-2 capitalize">
                        {user.userType === 'provider' ? 'Prestataire' : 'Client'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Informations générales</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-500">Email</label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Téléphone</label>
                          <p className="font-medium">{user.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Membre depuis</label>
                          <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Statistiques</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-500">Services réalisés</label>
                          <p className="font-medium">{user.completedServices}</p>
                        </div>
                        {user.userType === 'provider' && (
                          <div>
                            <label className="text-sm text-gray-500">Note moyenne</label>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{user.rating}</p>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= Math.floor(user.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-sm text-gray-500">Compte vérifié</label>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Vérifié</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
