import { useState } from "react";
import Header from "./Header";
import Chat from "../features/chat/Chat";
import Calendar from "../features/calendar/Calendar";
import DatePicker from "../features/calendar/DatePicker";
import { todayLocal } from "../utils/date";

const COLLAPSED_COLUMNS = "0 1fr";
const EXPANDED_COLUMNS = "390px 1fr";
const CHAT_PANEL_LABEL = "◆ Asistente";
const CALENDAR_PANEL_LABEL = "▦ Agenda";

export default function AppShell() {
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [date, setDate] = useState(todayLocal());

  return (
    <div className="h-screen flex flex-col">
      <Header chatCollapsed={chatCollapsed} onToggleChat={() => setChatCollapsed((c) => !c)} />
      <main
        className="flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: chatCollapsed ? COLLAPSED_COLUMNS : EXPANDED_COLUMNS }}
      >
        <section className={chatCollapsed ? "hidden" : "flex flex-col overflow-hidden"}>
          <div className="px-4 py-2 border-b-3 border-ink bg-brand-green font-black uppercase text-sm">
            {CHAT_PANEL_LABEL}
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat date={date} />
          </div>
        </section>
        <section className="flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b-3 border-ink bg-brand-blue text-white flex items-center justify-between">
            <span className="font-black uppercase text-sm">{CALENDAR_PANEL_LABEL}</span>
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
