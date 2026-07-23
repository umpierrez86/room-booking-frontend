import { useSchedule } from "../../hooks/useSchedule";
import { EventBlock } from "./EventBlock";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 20;
const SLOTS_PER_HOUR = 2;
const TIME_COLUMN_WIDTH = "68px";
const ROW_HEIGHT = "44px";
const SLOT_COUNT = (CLOSE_HOUR - OPEN_HOUR) * SLOTS_PER_HOUR;
const LOADING_LABEL = "Cargando…";
const ERROR_TITLE = "⚠ No se pudo cargar la agenda";
const ERROR_FALLBACK_MESSAGE = "Ocurrió un error inesperado.";
const LOADING_BOX_CLASS = "p-4 m-4 inline-block border-3 border-ink shadow-hard bg-paper2 font-mono";
const ERROR_BOX_CLASS = "p-4 m-4 border-3 border-ink shadow-hard bg-brand-orange text-white";

// CSS grid lines are 1-indexed. Column 1 is reserved for the hour labels, so
// rooms start at column 2. Row 1 is the room header, so hour rows start at 2.
const FIRST_ROOM_COLUMN = 2;
const FIRST_HOUR_ROW = 2;

interface CalendarProps {
  date: string;
}

export default function Calendar({ date }: CalendarProps) {
  const { data, isLoading, isError, error } = useSchedule(date);

  if (isLoading) {
    return <div className={LOADING_BOX_CLASS}>{LOADING_LABEL}</div>;
  }

  if (isError) {
    return (
      <div role="alert" className={ERROR_BOX_CLASS}>
        <p className="font-black uppercase">{ERROR_TITLE}</p>
        <p className="font-mono text-xs mt-1">
          {error instanceof Error ? error.message : ERROR_FALLBACK_MESSAGE}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${TIME_COLUMN_WIDTH} repeat(${data.rooms.length}, 1fr)`,
        gridTemplateRows: `${ROW_HEIGHT} repeat(${SLOT_COUNT}, ${ROW_HEIGHT})`,
      }}
    >
      {data.rooms.map((room, i) => (
        <div
          key={room.room}
          className="row-start-1 bg-ink text-paper grid place-items-center text-lg font-black uppercase"
          style={{ gridColumn: FIRST_ROOM_COLUMN + i }}
        >
          {room.room}
          <span className="text-sm font-black text-paper2">cap {room.capacity}</span>
        </div>
      ))}
      {hours.map((hour, i) => (
        <div
          key={hour}
          className="col-start-1 pr-3 text-right text-base font-black text-ink"
          style={{ gridRow: FIRST_HOUR_ROW + i * SLOTS_PER_HOUR }}
        >
          {String(hour).padStart(2, "0")}:00
        </div>
      ))}
      {data.rooms.map((room, i) => (
        <div
          key={`${room.room}-grid`}
          aria-hidden="true"
          data-testid="schedule-grid-cell"
          className={`pointer-events-none border-l-2 border-ink ${i === data.rooms.length - 1 ? "border-r-2" : ""} border-b-2`}
          style={{ gridColumn: FIRST_ROOM_COLUMN + i, gridRow: `2 / ${SLOT_COUNT + 2}` }}
        />
      ))}
      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <div
          key={`schedule-grid-line-${i}`}
          aria-hidden="true"
          className="pointer-events-none border-t-2 border-ink"
          style={{ gridColumn: `${FIRST_ROOM_COLUMN} / ${FIRST_ROOM_COLUMN + data.rooms.length}`, gridRow: FIRST_HOUR_ROW + i }}
        />
      ))}
      {data.rooms.flatMap((room, columnIndex) =>
        room.occupied.map((block, blockIndex) => (
          <EventBlock
            key={block.id}
            col={FIRST_ROOM_COLUMN + columnIndex}
            start={block.start}
            end={block.end}
            title={block.title}
            openHour={OPEN_HOUR}
            idx={blockIndex}
          />
        )),
      )}
    </div>
  );
}
