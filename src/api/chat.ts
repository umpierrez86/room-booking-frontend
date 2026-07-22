import type { ChatEvent } from "../types/models";

const SSE_EVENT_SEPARATOR = "\n\n";
const SSE_DATA_PREFIX = "data:";

/**
 * Parses a raw SSE buffer into complete `ChatEvent`s plus the trailing
 * incomplete chunk (`rest`) to be prepended to the next read.
 */
export function parseSSEChunk(buffer: string): { events: ChatEvent[]; rest: string } {
  const parts = buffer.split(SSE_EVENT_SEPARATOR);
  const rest = parts.pop() ?? "";
  const events: ChatEvent[] = [];

  for (const part of parts) {
    const line = part.trim();
    if (!line.startsWith(SSE_DATA_PREFIX)) continue;
    events.push(JSON.parse(line.slice(SSE_DATA_PREFIX.length).trim()) as ChatEvent);
  }

  return { events, rest };
}
