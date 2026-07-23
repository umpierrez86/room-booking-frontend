import { useAuth } from "../hooks/useAuth";
import meetingLogo from "../assets/meeting-logo.png";

const APP_TITLE = "Room Booking";
const SIGN_OUT_LABEL = "Salir";

export default function Header() {
  const { username, signOut } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b-3 border-ink">
      <div className="flex items-center gap-3">
        <img src={meetingLogo} alt="Logo de Room Booking" className="size-9 object-contain" />
        <h1 className="text-xl font-black uppercase">{APP_TITLE}</h1>
      </div>
      <div className="flex items-center gap-3 text-base font-black">
        <span className="bg-brand-yellow border-3 border-ink shadow-hard px-2 py-1 uppercase">{username}</span>
        <button onClick={signOut} className="border-3 border-ink shadow-hard px-3 py-1 uppercase">
          {SIGN_OUT_LABEL}
        </button>
      </div>
    </header>
  );
}
