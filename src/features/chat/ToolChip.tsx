const TOOL_ICON = "🔧";

interface ToolChipProps {
  name: string;
}

export function ToolChip({ name }: ToolChipProps) {
  return (
    <div className="bg-brand-yellow border-3 border-ink shadow-hard font-mono text-xs px-2 py-1 my-1 w-fit">
      {TOOL_ICON} {name}
    </div>
  );
}
