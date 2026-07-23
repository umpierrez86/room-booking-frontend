import { Fragment, type ReactNode } from "react";

interface AssistantMessageProps {
  content: string;
}

const TECHNICAL_TOOL_NAMES: Record<string, string> = {
  get_room_schedule: "consultar la agenda de una sala",
  list_available_rooms: "buscar salas disponibles",
  create_booking: "crear una reserva",
  cancel_booking: "cancelar una reserva",
  list_my_bookings: "consultar tus reservas",
};

function userFacingContent(content: string): string {
  const technicalNames = Object.keys(TECHNICAL_TOOL_NAMES).join("|");
  const parenthesizedTechnicalName = new RegExp(
    "\\s*\\(\\s*`?(?:" + technicalNames + ")`?\\s*\\)",
    "g",
  );
  const technicalName = new RegExp("`?(?:" + technicalNames + ")`?", "g");

  return content
    .replace(parenthesizedTechnicalName, "")
    .replace(technicalName, (name) => TECHNICAL_TOOL_NAMES[name.replaceAll("`", "")] ?? "");
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function AssistantMessage({ content }: AssistantMessageProps) {
  const normalized = userFacingContent(content).replace(/\s+(?=\d+\.\s+\*\*)/g, "\n");
  const lines = normalized.split("\n").filter(Boolean);
  const items = lines.filter((line) => /^\d+\.\s+/.test(line));
  const prose = lines.filter((line) => !/^\d+\.\s+/.test(line));

  return (
    <div className="space-y-2 leading-relaxed">
      {prose.map((line, index) => <p key={index}>{renderInline(line)}</p>)}
      {items.length > 0 && (
        <ol className="list-decimal space-y-1 pl-5">
          {items.map((item, index) => <li key={index}>{renderInline(item.replace(/^\d+\.\s+/, ""))}</li>)}
        </ol>
      )}
    </div>
  );
}
