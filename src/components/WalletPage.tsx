
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Wallet, 
  Send, 
  Download, 
  QrCode, 
  Link2, 
  Phone,
  Euro,
  Copy,
  CheckCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WalletPageProps {
  onBack: () => void;
}

interface WalletData {
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  method: string;
  description: string;
  status: string;
  created_at: string;
  sender_id?: string;
  receiver_id?: string;
  sender_profile?: { full_name: string };
  receiver_profile?: { full_name: string };
}

const WalletPage = ({ onBack }: WalletPageProps) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [sendMethod, setSendMethod] = useState<'link' | 'qr_code' | 'phone_number'>('link');
  const [sendAmount, setSendAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendDescription, setSendDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCode, setQrCode] = useState('');

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      // Récupérer le portefeuille
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Error fetching wallet:', walletError);
      } else {
        setWallet(walletData || { balance: 0, currency: 'EUR' });
      }

      // Récupérer les transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('internal_transactions')
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name),
          receiver_profile:profiles!receiver_id(full_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
      } else {
        setTransactions(transactionData || []);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const handleSendMoney = async () => {
    if (!user || !sendAmount || !sendDescription) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const amount = parseFloat(sendAmount);
    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à 0");
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error("Solde insuffisant");
      return;
    }

    setSubmitting(true);
    try {
      const referenceData = sendMethod === 'link' ? `payment-link-${Date.now()}` :
                           sendMethod === 'qr_code' ? `qr-${Date.now()}` : sendTo;

      const { error } = await supabase
        .from('internal_transactions')
        .insert({
          sender_id: user.id,
          amount: amount,
          transaction_type: 'transfer',
          method: sendMethod,
          reference_data: referenceData,
          description: sendDescription,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating transaction:', error);
        toast.error('Erreur lors de la création de la transaction');
      } else {
        // Envoyer notification par email
        await sendTransactionNotification(amount, sendDescription, 'sent');
        toast.success('Transaction créée avec succès ! Notification envoyée par email.');
        setShowSendDialog(false);
        setSendAmount('');
        setSendTo('');
        setSendDescription('');
        fetchWalletData();
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erreur lors de la création de la transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const generatePaymentLink = () => {
    const link = `${window.location.origin}/payment?ref=${Date.now()}`;
    setPaymentLink(link);
    navigator.clipboard.writeText(link);
    toast.success('Lien de paiement copié dans le presse-papiers !');
  };

  const generateQRCode = () => {
    const qrData = `${window.location.origin}/payment?qr=${Date.now()}`;
    setQrCode(qrData);
    toast.success('QR Code généré !');
  };

  const sendTransactionNotification = async (amount: number, description: string, type: 'sent' | 'received') => {
    try {
      await supabase.functions.invoke('send-transaction-notification', {
        body: {
          amount,
          description,
          type,
          userEmail: user?.email
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Mon Portefeuille</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Wallet Balance */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Solde disponible</p>
                <p className="text-4xl font-bold">{formatAmount(wallet?.balance || 0)}</p>
              </div>
              <Wallet className="h-16 w-16 text-blue-200" />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowSendDialog(true)}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-blue-600 flex-1"
                onClick={() => setShowReceiveDialog(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Recevoir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={generatePaymentLink}>
            <CardContent className="p-6 text-center">
              <Link2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Lien de paiement</h3>
              <p className="text-sm text-gray-600">Créez un lien pour recevoir de l'argent</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={generateQRCode}>
            <CardContent className="p-6 text-center">
              <QrCode className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">QR Code</h3>
              <p className="text-sm text-gray-600">Générez un QR code de paiement</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Par téléphone</h3>
              <p className="text-sm text-gray-600">Envoyez avec un numéro de téléphone</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des transactions</CardTitle>
            <CardDescription>Vos dernières transactions avec notifications email</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                Aucune transaction pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.sender_id === user?.id ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {transaction.sender_id === user?.id ? 
                          <ArrowUpRight className="h-5 w-5 text-red-600" /> : 
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">
                            {transaction.sender_id === user?.id ? 
                              `Envoyé à ${transaction.receiver_profile?.full_name || 'Utilisateur'}` :
                              `Reçu de ${transaction.sender_profile?.full_name || 'Utilisateur'}`
                            } • {formatDate(transaction.created_at)}
                          </p>
                          <Mail className="h-3 w-3 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.sender_id === user?.id ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.sender_id === user?.id ? '-' : '+'}
                        {formatAmount(transaction.amount)}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {transaction.status === 'completed' ? 'Terminé' : 
                         transaction.status === 'pending' ? 'En cours' : 'Échoué'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Send Money Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer de l'argent</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs value={sendMethod} onValueChange={(value) => setSendMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Lien</TabsTrigger>
                <TabsTrigger value="qr_code">QR Code</TabsTrigger>
                <TabsTrigger value="phone_number">Téléphone</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4">
                <p className="text-sm text-gray-600">
                  Un lien de paiement sera généré que vous pourrez partager.
                </p>
              </TabsContent>

              <TabsContent value="qr_code" className="space-y-4">
                <p className="text-sm text-gray-600">
                  Un QR code sera généré pour effectuer le paiement.
                </p>
              </TabsContent>

              <TabsContent value="phone_number" className="space-y-4">
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="+33 6 12 34 56 78"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label htmlFor="amount">Montant *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Ex: Remboursement restaurant"
                value={sendDescription}
                onChange={(e) => setSendDescription(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                className="flex-1"
                onClick={handleSendMoney}
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSendDialog(false)}
                disabled={submitting}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receive Money Dialog */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recevoir de l'argent</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Choisissez votre méthode préférée :</p>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={generatePaymentLink}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Générer un lien de paiement
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={generateQRCode}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Générer un QR Code
                </Button>
              </div>

              {paymentLink && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Lien de paiement :</p>
                  <div className="flex items-center space-x-2">
                    <Input value={paymentLink} readOnly className="text-xs" />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(paymentLink);
                        toast.success('Lien copié !');
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {qrCode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Données QR Code :</p>
                  <p className="text-xs font-mono bg-white p-2 rounded border">{qrCode}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;
