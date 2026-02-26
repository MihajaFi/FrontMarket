import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product, formatPrice } from "@/data/mock-data";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VITE_IMAGE = import.meta.env.VITE_IMAGE || "";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error(`Stock insuffisant pour ${product.name}`);
      return;
    }

    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={`${VITE_IMAGE}${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            {product.category}
          </div>

          {product.stock > 0 ? (
            <div className="absolute top-3 right-3 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-bold text-primary-foreground">
              {product.stock} en stock
            </div>
          ) : (
            <div className="absolute top-3 right-3 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white">
              Rupture de stock
            </div>
          )}

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        {isOutOfStock ? (
          <div>
            <h3 className="font-heading text-base font-semibold line-clamp-1 text-muted-foreground">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Vendu par {product.merchant}</p>
          </div>
        ) : (
          <Link to={`/product/${product.id}`}>
            <h3 className="font-heading text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Vendu par {product.merchant}</p>
          </Link>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">
            {product.price ? formatPrice(product.price) : "Prix sur demande"}
          </span>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
            {isOutOfStock ? "Indisponible" : "Ajouter"}
          </Button>
        </div>
      </div>
    </div>
  );
}