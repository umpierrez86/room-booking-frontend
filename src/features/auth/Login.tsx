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
      <form onSubmit={submit} className="bg-paper border-3 border-ink shadow-hard2 p-8 w-[min(92vw,32rem)] flex flex-col gap-6">
        <h1 className="text-3xl font-black uppercase leading-none">Room Booking</h1>
        <label className="text-base font-black uppercase">
          Usuario
          <input
            aria-label="usuario"
            className="mt-2 w-full border-3 border-ink bg-white px-3 py-2 text-xl font-bold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="text-base font-black uppercase">
          Contraseña
          <input
            aria-label="contraseña"
            type="password"
            className="mt-2 w-full border-3 border-ink bg-white px-3 py-2 text-xl font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-brand-orange text-base font-black">{error}</p>}
        <button className="bg-brand-orange border-3 border-ink shadow-hard font-black uppercase text-xl py-3">Entrar</button>
      </form>
    </div>
  );
}
