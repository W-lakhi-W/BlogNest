import { Navigate } from "react-router-dom";
const PublicRoutes = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoutes;
