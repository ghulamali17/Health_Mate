import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoutes;
