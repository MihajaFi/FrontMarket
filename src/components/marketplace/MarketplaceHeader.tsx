import { Search, ShoppingCart, User, Menu, Heart, LogOut, Package, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MarketplaceHeader = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container flex items-center gap-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <div className="w-8 h-8 rounded-lg marketplace-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-display">M+</span>
            </div>
            <span className="hidden sm:block font-display font-bold text-lg text-foreground">
              Market<span className="text-primary">Com+</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex">
              <Input
                placeholder="Rechercher un produit, une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0 bg-muted/50 focus:bg-card"
              />
              <Button type="submit" size="icon" className="rounded-l-none marketplace-gradient border-0 text-primary-foreground shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] marketplace-gradient border-0 text-primary-foreground">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                <User className="mr-1 h-4 w-4" />
                Connexion
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-foreground">{user?.name}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center gap-2"><Package className="h-4 w-4" /> Mes commandes</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/loyalty" className="flex items-center gap-2"><Star className="h-4 w-4" /> Points fidélité</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Se connecter</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">S'inscrire</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories bar */}
    </header>
  );
};

export default MarketplaceHeader;
