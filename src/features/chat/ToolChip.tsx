const TOOL_LABELS: Record<string, string> = {
  list_available_rooms: "Buscando disponibilidad",
  create_booking: "Creando reserva",
  cancel_booking: "Cancelando reserva",
  get_room_schedule: "Consultando agenda",
  list_my_bookings: "Consultando reservas",
};

interface ToolChipProps {
  name: string;
}

export function ToolChip({ name }: ToolChipProps) {
  return (
    <div className="mb-3 w-fit border-2 border-ink bg-brand-yellow px-3 py-1 text-sm font-black uppercase">
      {TOOL_LABELS[name] ?? "Procesando consulta"}
    </div>
  );
}
