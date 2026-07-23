import { createContext } from "react";

export interface AuthValue {
  token: string | null;
  username: string | null;
  isAuthed: boolean;
  signIn: (u: string, p: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthValue>(null!);
