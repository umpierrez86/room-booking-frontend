import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AppShell from "./layout/AppShell";

const LOGIN_PATH = "/login";
const HOME_PATH = "/";

export default function App() {
  return (
    <Routes>
      <Route path={LOGIN_PATH} element={<Login />} />
      <Route
        path={HOME_PATH}
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
