import { rowForTime } from "./grid";

const EVENT_COLORS = ["bg-brand-blue text-white", "bg-brand-yellow", "bg-brand-pink", "bg-brand-orange"];

interface EventBlockProps {
  col: number;
  start: string;
  end: string;
  title: string;
  openHour: number;
  idx: number;
}

export function EventBlock({ col, start, end, title, openHour, idx }: EventBlockProps) {
  const colorClass = EVENT_COLORS[idx % EVENT_COLORS.length];
  return (
    <div
      className={`border-3 border-ink shadow-hard p-1 m-0.5 overflow-hidden ${colorClass}`}
      style={{ gridColumn: col, gridRow: `${rowForTime(start, openHour)} / ${rowForTime(end, openHour)}` }}
    >
      <div className="text-xs font-black uppercase leading-tight">{title}</div>
      <div className="text-[10px] font-mono">
        {start}–{end}
      </div>
    </div>
  );
}
