import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, formatPrice } from "@/data/mock-data";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const VITE_IMAGE = import.meta.env.VITE_IMAGE || "";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-card rounded-lg border border-border overflow-hidden card-hover">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={`${VITE_IMAGE}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.stock && (
            <Badge className="absolute top-2 left-2 promo-badge text-primary-foreground border-0 text-xs font-bold">
              -{product.stock}%
            </Badge>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <p className="text-xs text-muted-foreground truncate">{product.category}</p>
          <h3 className="font-medium text-sm text-card-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-primary text-base">
              {formatPrice(product.price)}
            </span>
            {product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-full marketplace-gradient text-primary-foreground border-0 text-xs font-semibold"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
