import { useSchedule } from "../../hooks/useSchedule";
import { EventBlock } from "./EventBlock";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 20;
const SLOTS_PER_HOUR = 2;
const TIME_COLUMN_WIDTH = "56px";
const ROW_HEIGHT = "44px";
const LOADING_LABEL = "Cargando…";

interface CalendarProps {
  date: string;
}

export default function Calendar({ date }: CalendarProps) {
  const { data } = useSchedule(date);

  if (!data) return <div className="p-4 font-mono">{LOADING_LABEL}</div>;

  const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${TIME_COLUMN_WIDTH} repeat(${data.rooms.length}, 1fr)`,
        gridTemplateRows: `${ROW_HEIGHT} repeat(${(CLOSE_HOUR - OPEN_HOUR) * SLOTS_PER_HOUR}, ${ROW_HEIGHT})`,
      }}
    >
      {data.rooms.map((room, i) => (
        <div
          key={room.room}
          className="row-start-1 bg-ink text-paper grid place-items-center font-black uppercase"
          style={{ gridColumn: i + 2 }}
        >
          {room.room}
          <span className="text-[10px] font-mono opacity-70">cap {room.capacity}</span>
        </div>
      ))}
      {hours.map((hour, i) => (
        <div
          key={hour}
          className="col-start-1 text-right pr-2 font-mono text-xs text-ink/60"
          style={{ gridRow: 2 + i * SLOTS_PER_HOUR }}
        >
          {String(hour).padStart(2, "0")}:00
        </div>
      ))}
      {data.rooms.flatMap((room, columnIndex) =>
        room.occupied.map((block, blockIndex) => (
          <EventBlock
            key={block.id}
            col={columnIndex + 2}
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
