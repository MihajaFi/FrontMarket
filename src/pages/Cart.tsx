import { Link } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

const VITE_IMAGE = import.meta.env.VITE_IMAGE || "";
const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="font-display font-bold text-2xl text-foreground">Votre panier est vide</h2>
          <p className="text-muted-foreground">Découvrez nos produits et commencez vos achats !</p>
          <Link to="/products">
            <Button className="marketplace-gradient text-primary-foreground border-0 font-semibold">
              Parcourir les produits
            </Button>
          </Link>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-6">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6">
          Mon panier ({items.length} article{items.length > 1 ? "s" : ""})
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img src={`${VITE_IMAGE}${product.image}`} alt={product.name} className="w-20 h-20 rounded-md object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-sm text-card-foreground truncate hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                  <p className="font-display font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-md">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-5 h-fit sticky top-32 space-y-4">
            <h3 className="font-display font-semibold text-lg text-card-foreground">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-success">Gratuite</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span className="font-display text-primary text-lg">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full marketplace-gradient text-primary-foreground border-0 font-semibold">
                Commander <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={clearCart}>
              Vider le panier
            </Button>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};
export default Cart;
