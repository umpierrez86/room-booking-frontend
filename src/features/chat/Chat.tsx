import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChatStream } from "../../hooks/useChatStream";
import { AssistantMessage } from "./AssistantMessage";
import { ToolChip } from "./ToolChip";

const WAITING_LABEL = "Preparando respuesta…";
const COMPOSER_PLACEHOLDER = "Escribí tu mensaje…";
const USER_BUBBLE_CLASS = "border-3 border-ink p-3 text-base bg-brand-blue text-white shadow-hard";
const ASSISTANT_BUBBLE_CLASS = "border-3 border-ink p-3 text-base bg-white shadow-hard";

interface ChatProps {
  date: string;
}

export default function Chat({ date }: ChatProps) {
  const { messages, sendMessage, streaming } = useChatStream(date);
  const [text, setText] = useState("");
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages.at(-1);
  const isWaitingForFirstToken = streaming && lastMessage?.role === "assistant" && !lastMessage.content;

  useEffect(() => {
    const scrollTarget = scrollEndRef.current;
    if (scrollTarget && typeof scrollTarget.scrollIntoView === "function") {
      scrollTarget.scrollIntoView({ block: "end" });
    }
  }, [messages, streaming]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const message = text;
    setText("");
    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send chat message", error);
    }
  }

  return (
    <div className="flex flex-col h-full border-r-3 border-ink">
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
        {messages.map((message, i) => (
          <div key={i} className={message.role === "user" ? "self-end" : "self-start"}>
            {streaming && i === messages.length - 1 && message.tools.map((tool, j) => (
              <ToolChip key={j} name={tool} />
            ))}
            {message.content && (
              <div className={message.role === "user" ? USER_BUBBLE_CLASS : ASSISTANT_BUBBLE_CLASS}>
                {message.role === "assistant" ? <AssistantMessage content={message.content} /> : message.content}
              </div>
            )}
          </div>
        ))}
        {isWaitingForFirstToken && <div role="status" className="font-mono text-xs text-ink/60">{WAITING_LABEL}</div>}
        <div ref={scrollEndRef} aria-hidden="true" />
      </div>
      <form onSubmit={submit} className="p-3 border-t-3 border-ink flex gap-2">
        <input
          className="flex-1 border-3 border-ink bg-white px-3 py-2 text-lg font-bold"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={COMPOSER_PLACEHOLDER}
          aria-label={COMPOSER_PLACEHOLDER}
        />
        <button className="bg-brand-orange border-3 border-ink shadow-hard font-black uppercase text-base px-4">Enviar</button>
      </form>
    </div>
  );
}
