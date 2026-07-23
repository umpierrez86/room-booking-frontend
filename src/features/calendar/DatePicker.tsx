import { useEffect, useRef, useState } from "react";
import { parseLocalDate, todayLocal } from "../../utils/date";
import { buildMonthGrid } from "./monthGrid";

const MONTHS_PER_YEAR = 12;
const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = MONTHS_PER_YEAR - 1;

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const POPUP_LABEL = "Elegir fecha";
const PREV_MONTH_LABEL = "Mes anterior";
const NEXT_MONTH_LABEL = "Mes siguiente";

const TRIGGER_CLASS = "border-3 border-ink shadow-hard bg-paper px-3 py-2 font-mono text-base font-bold";
const POPUP_CLASS = "absolute right-0 z-10 mt-2 w-72 border-3 border-ink shadow-hard2 bg-paper p-4";
const NAV_BUTTON_CLASS = "font-black uppercase px-2 hover:opacity-60";
const WEEKDAY_LABEL_CLASS = "text-xs text-center font-black text-ink";
const DAY_BUTTON_BASE_CLASS = "h-9 w-9 grid place-items-center text-sm font-black border-3 border-transparent";
const DAY_BUTTON_SELECTED_CLASS = "bg-ink text-paper border-ink";
const DAY_BUTTON_TODAY_CLASS = "border-brand-blue";
const DAY_BUTTON_DEFAULT_CLASS = "hover:border-ink";

interface DatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

function formatDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function dayButtonClass(isSelected: boolean, isToday: boolean): string {
  if (isSelected) return `${DAY_BUTTON_BASE_CLASS} ${DAY_BUTTON_SELECTED_CLASS}`;
  if (isToday) return `${DAY_BUTTON_BASE_CLASS} ${DAY_BUTTON_TODAY_CLASS}`;
  return `${DAY_BUTTON_BASE_CLASS} ${DAY_BUTTON_DEFAULT_CLASS}`;
}

export default function DatePicker({ date, onChange }: DatePickerProps) {
  const selected = parseLocalDate(date);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);
  const todayIso = todayLocal();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function openPopup() {
    setViewYear(selected.getFullYear());
    setViewMonth(selected.getMonth());
    setOpen(true);
  }

  function goToPrevMonth() {
    if (viewMonth === FIRST_MONTH_INDEX) {
      setViewMonth(LAST_MONTH_INDEX);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === LAST_MONTH_INDEX) {
      setViewMonth(FIRST_MONTH_INDEX);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  function selectDay(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  const cells = buildMonthGrid(viewYear, viewMonth);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={TRIGGER_CLASS}
        onClick={() => (open ? setOpen(false) : openPopup())}
      >
        {formatDisplay(selected)}
      </button>
      {open && (
        <div role="dialog" aria-label={POPUP_LABEL} className={POPUP_CLASS}>
          <div className="flex items-center justify-between mb-2">
            <button type="button" aria-label={PREV_MONTH_LABEL} className={NAV_BUTTON_CLASS} onClick={goToPrevMonth}>
              ‹
            </button>
            <span className="font-black uppercase text-sm">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" aria-label={NEXT_MONTH_LABEL} className={NAV_BUTTON_CLASS} onClick={goToNextMonth}>
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={`weekday-${i}`} className={WEEKDAY_LABEL_CLASS}>
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              if (cell.day === null || cell.iso === null) {
                return <span key={cell.key} />;
              }
              const iso = cell.iso;
              const isSelected = iso === date;
              const isToday = iso === todayIso;
              return (
                <button
                  key={cell.key}
                  type="button"
                  aria-label={iso}
                  aria-pressed={isSelected}
                  className={dayButtonClass(isSelected, isToday)}
                  onClick={() => selectDay(iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
