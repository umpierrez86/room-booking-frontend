const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class Unauthorized extends Error {}

let tokenGetter: () => string | null = () => null;

export function setTokenGetter(fn: () => string | null) {
  tokenGetter = fn;
}

export async function apiFetch(path: string, opts: RequestInit = {}): Promise<Response> {
  const token = tokenGetter();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const resp = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (resp.status === 401) throw new Unauthorized();
  return resp;
}

export function apiBase() {
  return BASE;
}
