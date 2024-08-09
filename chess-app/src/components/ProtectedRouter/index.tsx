import { ReactNode } from "react";
import { useUser } from "../UserProvider";
import { Navigate } from "react-router-dom";

function ProtectedRoute(children: ReactNode) {
  const { isLoggedIn } = useUser();

  return isLoggedIn === true ? children : <Navigate to="/login" replace />;
}
