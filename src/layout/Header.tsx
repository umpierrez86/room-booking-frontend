import { useAuth } from "../hooks/useAuth";

const APP_TITLE = "🏢 Room Booking";
const SIGN_OUT_LABEL = "Salir";
const HIDE_CHAT_LABEL = "⟨ Ocultar";
const SHOW_CHAT_LABEL = "💬 Abrir chat";

interface HeaderProps {
  chatCollapsed: boolean;
  onToggleChat: () => void;
}

export default function Header({ chatCollapsed, onToggleChat }: HeaderProps) {
  const { username, signOut } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b-3 border-ink">
      <h1 className="font-black uppercase">{APP_TITLE}</h1>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="bg-brand-yellow border-3 border-ink shadow-hard px-2 py-1 uppercase">{username}</span>
        <button
          onClick={onToggleChat}
          className="border-3 border-ink shadow-hard px-3 py-1 uppercase"
        >
          {chatCollapsed ? SHOW_CHAT_LABEL : HIDE_CHAT_LABEL}
        </button>
        <button onClick={signOut} className="border-3 border-ink shadow-hard px-3 py-1 uppercase">
          {SIGN_OUT_LABEL}
        </button>
      </div>
    </header>
  );
}
