import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Loyalty from "./pages/Loyalty";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import MerchantDashboard from "./merchant/dashboard/MerchantDashboard";
import { AdminMerchants, AdminProducts, AdminOrders, AdminPromotions, AdminStock, PromotionLoyalty, AdminCategories } from "./admin/pages";
import { MerchantProducts, MerchantOrders, MerchantPromotions, MerchantStock, MerchantPromotionLoyalty, MerchantCategories } from "./merchant/pages";
import AdminRoute from "./routes/AdminRoute";
import MerchantRoute from "./routes/MerchantRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Frontend routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderTracking/>} />
              <Route path="/loyalty" element={<Loyalty />} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<AdminRoute>
                <AdminDashboard />
              </AdminRoute>} />
              <Route path="/admin/merchants" element={<AdminRoute><AdminMerchants /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
              <Route path="/admin/stock" element={<AdminRoute><AdminStock /></AdminRoute>} />
              <Route path="/admin/promotion-loyalty" element={<AdminRoute><PromotionLoyalty /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              
              {/* Merchant routes */}
              <Route path="/merchant/dashboard" element={<MerchantRoute><MerchantDashboard /></MerchantRoute>} />
              <Route path="/merchant/products" element={<MerchantRoute><MerchantProducts /></MerchantRoute>} />
              <Route path="/merchant/orders" element={<MerchantRoute><MerchantOrders /></MerchantRoute>} />
              <Route path="/merchant/promotions" element={<MerchantRoute><MerchantPromotions /></MerchantRoute>} />
              <Route path="/merchant/stock" element={<MerchantRoute><MerchantStock /></MerchantRoute>} />
              <Route path="/merchant/promotion-loyalty" element={<MerchantRoute><MerchantPromotionLoyalty /></MerchantRoute>} />
              <Route path="/merchant/categories" element={<MerchantRoute><MerchantCategories /></MerchantRoute>} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;