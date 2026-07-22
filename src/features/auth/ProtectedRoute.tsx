import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../../hooks/useAuth";

const LOGIN_PATH = "/login";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  return useAuth().isAuthed ? children : <Navigate to={LOGIN_PATH} replace />;
}
