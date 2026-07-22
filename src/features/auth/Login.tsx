import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const INVALID_CREDENTIALS_MESSAGE = "Usuario o contraseña inválidos";
const HOME_PATH = "/";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await signIn(username, password);
      navigate(HOME_PATH);
    } catch {
      setError(INVALID_CREDENTIALS_MESSAGE);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="bg-paper border-3 border-ink shadow-hard2 p-8 w-80 flex flex-col gap-4">
        <h1 className="text-xl font-black uppercase">Room Booking</h1>
        <label className="text-xs font-bold uppercase">
          Usuario
          <input
            aria-label="usuario"
            className="mt-1 w-full border-3 border-ink p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="text-xs font-bold uppercase">
          Contraseña
          <input
            aria-label="contraseña"
            type="password"
            className="mt-1 w-full border-3 border-ink p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-brand-orange text-sm font-bold">{error}</p>}
        <button className="bg-brand-orange border-3 border-ink shadow-hard font-black uppercase py-2">Entrar</button>
      </form>
    </div>
  );
}
