import { useContext } from "react";
import { Navigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role } = useContext(AuthContext);

  if (role !== requiredRole) return <Navigate to="/home" />;

  return children;
};

export default ProtectedRoute;
