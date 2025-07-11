
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Zap, 
  Heart,
  Star,
  CheckCircle
} from "lucide-react";

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage = ({ onBack }: AboutPageProps) => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Communauté de confiance",
      description: "Des milliers de prestataires vérifiés et de clients satisfaits"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Paiements sécurisés",
      description: "Transactions protégées avec un système de portefeuille intégré"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Réponse rapide",
      description: "Trouvez et contactez des prestataires en quelques clics"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Support dédié",
      description: "Notre équipe vous accompagne à chaque étape"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Utilisateurs actifs" },
    { number: "5,000+", label: "Services réalisés" },
    { number: "4.8/5", label: "Note moyenne" },
    { number: "24/7", label: "Support disponible" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">À propos</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            La plateforme qui connecte les talents aux besoins
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ServiceLink révolutionne la façon dont vous trouvez et proposez des services. 
            Notre mission est de créer un écosystème où chacun peut partager ses compétences 
            et trouver l'aide dont il a besoin.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Pourquoi choisir ServiceLink ?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">Notre histoire</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                ServiceLink est née d'une vision simple : démocratiser l'accès aux services 
                et permettre à chacun de monétiser ses compétences. Fondée en 2024, notre 
                plateforme a rapidement grandi pour devenir une référence dans l'économie 
                collaborative.
              </p>
              <p>
                Nous croyons que chaque personne a des talents uniques à partager. Que vous 
                soyez étudiant cherchant à arrondir vos fins de mois, professionnel 
                expérimenté souhaitant offrir vos services, ou simplement quelqu'un ayant 
                une compétence particulière, ServiceLink est fait pour vous.
              </p>
              <p>
                Notre équipe travaille sans relâche pour améliorer l'expérience utilisateur, 
                garantir la sécurité des transactions et faciliter les connexions entre 
                les membres de notre communauté.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold mb-6">Nos valeurs</h3>
            <div className="space-y-4">
              {[
                "Confiance et transparence dans toutes les interactions",
                "Innovation continue pour améliorer nos services",
                "Respect et bienveillance envers notre communauté",
                "Sécurité et protection des données utilisateurs",
                "Accessibilité pour tous, partout en France"
              ].map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-6">Une équipe passionnée</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Notre équipe multidisciplinaire partage la même passion : créer des outils 
            qui facilitent la vie de nos utilisateurs et favorisent les échanges humains.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marie Dubois", role: "CEO & Fondatrice", description: "Experte en économie collaborative" },
              { name: "Thomas Martin", role: "CTO", description: "Passionné de technologie et innovation" },
              { name: "Sophie Leroy", role: "Head of Community", description: "Spécialiste de l'expérience utilisateur" }
            ].map((member, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{member.name}</h4>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                    <p className="text-gray-600 text-sm mt-2">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h3>
          <p className="text-xl mb-8 text-blue-100">
            Découvrez des milliers de services ou partagez vos compétences dès aujourd'hui
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onBack}>
              Commencer maintenant
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
