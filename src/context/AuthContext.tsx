import { useState, useEffect, type ReactNode } from "react";
import { login as apiLogin } from "../api/auth";
import { setTokenGetter } from "../api/client";
import { AuthContext } from "./authContextInstance";

const TOKEN_STORAGE_KEY = "rb_token";
const USER_STORAGE_KEY = "rb_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(USER_STORAGE_KEY));

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  async function signIn(u: string, p: string) {
    const { access_token } = await apiLogin(u, p);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(USER_STORAGE_KEY, u);
    setToken(access_token);
    setUsername(u);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthed: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
