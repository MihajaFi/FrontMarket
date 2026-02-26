import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Phone, Loader2 } from "lucide-react";
import type { OrderAndOrderItemRequest } from "@/data/mock-data";

type Step = "address" | "summary" | "payment" | "confirmation";
const VITE_IMAGE = import.meta.env.VITE_IMAGE || "";
const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [momoProvider, setMomoProvider] = useState("orange");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center">
          <Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" />
        </div>
      </MarketplaceLayout>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center space-y-4">
          <h2 className="font-display font-bold text-2xl text-foreground">Connexion requise</h2>
          <p className="text-muted-foreground">Veuillez vous connecter pour passer commande.</p>
          <Button onClick={() => navigate("/login")} className="marketplace-gradient text-primary-foreground border-0 font-semibold">
            Se connecter
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  if (items.length === 0 && step !== "confirmation") {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Préparer le payload pour orderService
      const operator = momoProvider.toUpperCase() as "MVOLA" | "ORANGEMONEY" | "AIRTELMONEY";
      const orderPayload: OrderAndOrderItemRequest = {
        status: "PENDING",
        userId: Number(user.id),
        address,
        phone,
        paymentMethod: operator,
        items: items.map(({ product, quantity }) => ({
          productId: Number(product.id),
          quantity,
          unitPrice: product.price,
        })),
      };

      const order = await orderService.create(orderPayload);
      setOrderId(order.id.toString());
      const token = localStorage.getItem("token"); // récupérer avant de clear
      clearCart();
      localStorage.setItem("token", token!);
      setStep("confirmation");
      toast.success("Commande passée avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "address", label: "Adresse", icon: <MapPin className="h-4 w-4" /> },
    { key: "summary", label: "Récapitulatif", icon: <CreditCard className="h-4 w-4" /> },
    { key: "payment", label: "Paiement", icon: <Phone className="h-4 w-4" /> },
    { key: "confirmation", label: "Confirmation", icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <MarketplaceLayout>
      <div className="container py-6 max-w-3xl">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i <= stepIndex ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}>
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Address step */}
        {step === "address" && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-foreground">Adresse de livraison</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Adresse complète</Label>
                <Input placeholder="Lot II B 45, Analakely" value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="034 00 000 00" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => navigate("/cart")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
              <Button
                className="marketplace-gradient text-primary-foreground border-0 font-semibold"
                disabled={!address.trim() || !phone.trim()}
                onClick={() => setStep("summary")}
              >
                Continuer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Summary step */}
        {step === "summary" && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-foreground">Récapitulatif de la commande</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <img src={`${VITE_IMAGE}${product.image}`} alt={product.name} className="w-14 h-14 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qté: {quantity}</p>
                  </div>
                  <p className="text-sm font-display font-bold text-primary">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison à</span>
                <span className="text-foreground">{address}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Téléphone</span>
                <span className="text-foreground">{phone}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-success font-medium">Gratuite</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="font-display text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("address")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
              <Button className="marketplace-gradient text-primary-foreground border-0 font-semibold" onClick={() => setStep("payment")}>
                Passer au paiement <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Payment step */}
        {step === "payment" && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-foreground">Paiement Mobile Money</h2>
            <p className="text-sm text-muted-foreground">Saisissez votre numéro Mobile Money pour finaliser le paiement.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Opérateur</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "orange", label: "Orange Money", color: "bg-orange-500" },
                    { id: "mvola", label: "MVola", color: "bg-red-500" },
                    { id: "airtel", label: "Airtel Money", color: "bg-red-600" },
                  ].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setMomoProvider(op.id)}
                      className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-colors ${momoProvider === op.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${op.color} mx-auto mb-1`} />
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Numéro {momoProvider === "mvola" ? "MVola" : momoProvider === "airtel" ? "Airtel Money" : "Orange Money"}</Label>
                <Input placeholder="034 00 000 00" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} required maxLength={20} />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium text-foreground mb-1">Montant à payer</p>
              <p className="font-display font-bold text-2xl text-primary">{formatPrice(totalPrice)}</p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("summary")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
              <Button
                className="marketplace-gradient text-primary-foreground border-0 font-semibold"
                disabled={!momoNumber.trim() || loading}
                onClick={handlePlaceOrder}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Traitement...</>
                ) : (
                  <>Confirmer le paiement <CheckCircle2 className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation step */}
        {step === "confirmation" && (
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground">Commande confirmée !</h2>
            <p className="text-muted-foreground">
              Votre commande <span className="font-semibold text-foreground">{orderId}</span> a été passée avec succès.
            </p>
            <p className="text-sm text-muted-foreground">
              Vous recevrez une confirmation par SMS. Vous pouvez suivre votre commande depuis votre espace client.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate("/orders")}>Mes commandes</Button>
              <Button className="marketplace-gradient text-primary-foreground border-0 font-semibold" onClick={() => navigate("/")}>
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};
export default Checkout;
