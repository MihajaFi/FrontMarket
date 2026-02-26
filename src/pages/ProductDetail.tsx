import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { productService } from "@/services/productService"; // Backend
import { formatPrice } from "@/data/mock-data";import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
; // Ou adapte selon ton projet

const VITE_IMAGE = import.meta.env.VITE_IMAGE || "";
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("ID du produit manquant");
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (err: any) {
        console.error(err);
        setError("Le produit n'a pas pu être chargé.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} ajouté au panier !`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Chargement du produit...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500">{error || "Produit introuvable."}</p>
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Retour aux produits
        </Button>
      </div>
    );
  }

  return (
    <MarketplaceLayout>
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border">
          <img
            src={`${VITE_IMAGE}${product.image}`}
            alt={product.name}
            className="aspect-square w-full h-64 object-cover mx-auto"
          />
        </div>

        <div>
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {product.category}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-6 font-heading text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vendu par <span className="font-medium text-foreground">{product.merchant}</span>
          </p>
          <p className={`mt-1 text-sm ${product.stock > 10 ? "text-success" : "text-destructive"}`}>
            {product.stock > 10 ? `${product.stock} en stock` : `Plus que ${product.stock} en stock !`}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border px-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
    </MarketplaceLayout>
  );
}