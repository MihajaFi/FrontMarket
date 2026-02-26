import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "commercant" | "admin">("client");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success("Connexion réussie !");

      // Gestion des rôles backend (sécurisé)
      if (user.roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      }
      else if (user.roles.includes("ROLE_MERCHANT")) {
        navigate("/merchant/dashboard", { replace: true });
      }
      else {
        navigate("/", { replace: true });
      }

    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketplaceLayout>
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold">Connexion</h1>
            <p className="mt-2 text-muted-foreground">Accédez à votre espace MarketCom+</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Sélecteur de rôle */}
            <div>
              <Label>Type de compte</Label>
              <div className="mt-2 flex gap-2">
                {([["client", "Client"], ["commercant", "Commerçant"], ["admin", "Admin"]] as const).map(
                  ([r, label]) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${role === r ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                        }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@exemple.mg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Label>Mot de passe</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </MarketplaceLayout>
  );
}