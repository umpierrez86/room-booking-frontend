import { apiFetch } from "./client";
import type { LoginResponse } from "../types/models";

export async function login(username: string, password: string): Promise<LoginResponse> {
  const r = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
  if (!r.ok) throw new Error("Credenciales inválidas");
  return r.json();
}
