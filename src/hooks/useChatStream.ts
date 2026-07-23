import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiBase, Unauthorized } from "../api/client";
import { parseSSEChunk } from "../api/chat";
import { useAuth } from "./useAuth";
import type { ChatEvent } from "../types/models";

const CHAT_PATH = "/chat";
const SCHEDULE_QUERY_KEY = "schedule";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tools: string[];
}

type SetMessages = (updater: (current: ChatMessage[]) => ChatMessage[]) => void;

function patchLastMessage(messages: ChatMessage[], patch: (message: ChatMessage) => ChatMessage): ChatMessage[] {
  return messages.map((message, i) => (i === messages.length - 1 ? patch(message) : message));
}

/** Applies a single parsed `ChatEvent` to chat state (message patching, schedule invalidation). */
function applyEvent(event: ChatEvent, setMessages: SetMessages, invalidateSchedule: () => void): void {
  if (event.type === "token") {
    setMessages((current) =>
      patchLastMessage(current, (message) => ({ ...message, content: message.content + event.text })),
    );
  } else if (event.type === "tool_start") {
    setMessages((current) =>
      patchLastMessage(current, (message) => ({ ...message, tools: [...message.tools, event.name] })),
    );
  } else if (event.type === "booking_changed") {
    invalidateSchedule();
  }
}

/** Reads an SSE response body to completion, invoking `onEvent` for each parsed `ChatEvent`. */
async function readStream(body: ReadableStream<Uint8Array>, onEvent: (event: ChatEvent) => void): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSSEChunk(buffer);
    buffer = rest;
    for (const event of events) onEvent(event);
  }
}

export function useChatStream(date: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);

  function invalidateSchedule() {
    queryClient.invalidateQueries({ queryKey: [SCHEDULE_QUERY_KEY, date] });
  }

  async function sendMessage(text: string) {
    setMessages((current) => [
      ...current,
      { role: "user", content: text, tools: [] },
      { role: "assistant", content: "", tools: [] },
    ]);
    setStreaming(true);

    try {
      const response = await fetch(`${apiBase()}${CHAT_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text }),
      });

      if (response.status === 401) {
        throw new Unauthorized();
      }
      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Chat response has no body");
      }

      await readStream(response.body, (event) => applyEvent(event, setMessages, invalidateSchedule));
    } finally {
      setStreaming(false);
    }
  }

  return { messages, sendMessage, streaming };
}
