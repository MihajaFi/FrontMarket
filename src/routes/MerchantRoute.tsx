import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const MerchantRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes("ROLE_MERCHANT")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default MerchantRoute;