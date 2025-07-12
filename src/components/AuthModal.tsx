
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Mail, Lock, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { signIn, signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    userType: "client" as "client" | "provider"
  });
  const [authLoading, setAuthLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      return;
    }

    setAuthLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
    setAuthLoading(false);
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      return;
    }

    setAuthLoading(true);
    const { error } = await signUp(
      formData.email, 
      formData.password, 
      formData.name, 
      formData.userType,
      formData.phone
    );
    
    if (!error) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
    setAuthLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenue sur HandyPay
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                onClick={handleLogin}
                disabled={authLoading || loading}
              >
                {authLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.userType === 'client' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleInputChange("userType", "client")}
                >
                  <CardContent className="p-4 text-center">
                    <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Client</h3>
                    <p className="text-xs text-gray-600">Je cherche des services</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.userType === 'provider' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => handleInputChange("userType", "provider")}
                >
                  <CardContent className="p-4 text-center">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Prestataire</h3>
                    <p className="text-xs text-gray-600">Je propose des services</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+33 6 12 34 56 78"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                onClick={handleSignUp}
                disabled={authLoading || loading}
              >
                {authLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          En vous connectant, vous acceptez nos conditions générales et notre politique de confidentialité.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
