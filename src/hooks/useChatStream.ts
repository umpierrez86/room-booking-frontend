import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiBase, Unauthorized } from "../api/client";
import { parseSSEChunk } from "../api/chat";
import { useAuth } from "./useAuth";
import type { ChatEvent } from "../types/models";

const CHAT_PATH = "/chat";
const SCHEDULE_QUERY_KEY = "schedule";
const CHAT_ERROR_MESSAGE = "El asistente no está disponible por el momento. Podés seguir consultando la agenda o volver a intentarlo en unos minutos.";
const CHAT_SESSION_EXPIRED_MESSAGE = "Tu sesión venció. Volvé a iniciar sesión para continuar.";
const CHAT_STORAGE_PREFIX = "rb_chat_messages";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tools: string[];
}

type SetMessages = (updater: (current: ChatMessage[]) => ChatMessage[]) => void;

function patchLastMessage(messages: ChatMessage[], patch: (message: ChatMessage) => ChatMessage): ChatMessage[] {
  return messages.map((message, i) => (i === messages.length - 1 ? patch(message) : message));
}

function loadMessages(storageKey: string | null): ChatMessage[] {
  if (!storageKey) return [];
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is ChatMessage =>
        typeof message === "object" && message !== null &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" && Array.isArray(message.tools),
    );
  } catch {
    return [];
  }
}

/** Applies a single parsed `ChatEvent` to chat state (message patching, schedule invalidation). */
function applyEvent(event: ChatEvent, setMessages: SetMessages, invalidateSchedule: () => void): void {
  if (event.type === "token") {
    setMessages((current) =>
      patchLastMessage(current, (message) => ({ ...message, content: message.content + event.text })),
    );
  } else if (event.type === "tool_start") {
    setMessages((current) =>
      patchLastMessage(current, (message) => ({ ...message, tools: [...message.tools, event.tool] })),
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
  const { token, username } = useAuth();
  const queryClient = useQueryClient();
  const storageKey = username ? `${CHAT_STORAGE_PREFIX}:${username}` : null;
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(storageKey));
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    setMessages(loadMessages(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

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
    } catch (error) {
      const content = error instanceof Unauthorized ? CHAT_SESSION_EXPIRED_MESSAGE : CHAT_ERROR_MESSAGE;
      setMessages((current) => patchLastMessage(current, (message) => ({ ...message, content })));
      throw error;
    } finally {
      setStreaming(false);
    }
  }

  return { messages, sendMessage, streaming };
}
