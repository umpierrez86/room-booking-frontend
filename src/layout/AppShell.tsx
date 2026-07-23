import { useState } from "react";
import Header from "./Header";
import Chat from "../features/chat/Chat";
import Calendar from "../features/calendar/Calendar";
import DatePicker from "../features/calendar/DatePicker";
import { todayLocal } from "../utils/date";

const COLLAPSED_COLUMNS = "minmax(0, 1fr)";
const EXPANDED_COLUMNS = "minmax(320px, 390px) minmax(0, 1fr)";
const CHAT_PANEL_LABEL = "◆ Asistente";
const CALENDAR_PANEL_LABEL = "▦ Agenda";
const OPEN_ASSISTANT_LABEL = "Abrir asistente";

export default function AppShell() {
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [date, setDate] = useState(todayLocal());

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main
        className="flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: chatCollapsed ? COLLAPSED_COLUMNS : EXPANDED_COLUMNS }}
      >
        {!chatCollapsed && (
          <section className="min-w-0 flex flex-col overflow-hidden border-r-3 border-ink">
            <div className="flex items-center justify-between px-4 py-3 border-b-3 border-ink bg-brand-green font-black uppercase text-base">
              <span>{CHAT_PANEL_LABEL}</span>
              <button
                type="button"
                aria-label="Ocultar asistente"
                title="Ocultar asistente"
                onClick={() => setChatCollapsed(true)}
                className="grid size-7 place-items-center border-2 border-ink bg-paper text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat date={date} />
            </div>
          </section>
        )}
        <section className="min-w-0 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b-3 border-ink bg-paper text-ink flex items-center justify-between">
            <div className="flex items-center gap-3">
              {chatCollapsed && (
                <button
                  type="button"
                  onClick={() => setChatCollapsed(false)}
                  className="border-3 border-ink bg-brand-green px-3 py-2 font-black uppercase text-base text-ink shadow-hard"
                >
                  {OPEN_ASSISTANT_LABEL}
                </button>
              )}
              <span className="font-black uppercase text-base">{CALENDAR_PANEL_LABEL}</span>
            </div>
            <DatePicker date={date} onChange={setDate} />
          </div>
          <div className="flex-1 overflow-auto p-4">
            <Calendar date={date} />
          </div>
        </section>
      </main>
    </div>
  );
}
