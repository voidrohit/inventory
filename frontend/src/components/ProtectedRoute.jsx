import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Spinner } from "./ui/States";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <Spinner label="Loading session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
