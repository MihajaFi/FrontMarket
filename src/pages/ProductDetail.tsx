import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { formatPrice } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
  Store,
} from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import { productService } from "@/services/productService";
import { Product } from "@/data/mock-data";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error("ID du produit manquant.");
        }
        const data = await productService.getProduct(id);
        setProduct(data);

        // Exemple : Récupérer des produits similaires (par catégorie)
        const allProducts = await productService.getProducts();
        const similar = allProducts.filter(
          (p) => p.category === data.category && p.id !== data.id
        );
        setSimilarProducts(similar.slice(0, 4));
      } catch (err) {
        setError("Échec du chargement du produit.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product});
    toast.success(`${product.name} ajouté au panier !`);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-6">
          <p className="text-center">Chargement du produit...</p>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error || !product) {
    return (
      <MarketplaceLayout>
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Produit introuvable</h1>
          </div>
          <p className="text-center text-red-500">
            {error || "Le produit que vous cherchez n'existe pas."}
          </p>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Détails du produit</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="bg-card border border-border rounded-lg p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-contain rounded-md"
            />
          </div>

          {/* Détails du produit */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.5)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">{formatPrice(product.price || 0)}</p>
              <Badge variant="secondary" className="text-sm">
                En stock : {product.stock || 0}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecreaseQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1 flex items-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                <span>Livraison gratuite</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Garantie 1 an</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default ProductDetail;
