import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "./Chat";
import { AuthProvider } from "../../context/AuthContext";
import * as hook from "../../hooks/useChatStream";

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

test("renders messages and sends", () => {
  const send = vi.fn();
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [
      { role: "user", content: "hola", tools: [] },
      { role: "assistant", content: "¡Hola!", tools: ["list_available_rooms"] },
    ],
    sendMessage: send,
    streaming: true,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Chat date="2026-07-21" />
      </AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.getByText("¡Hola!")).toBeInTheDocument();
  expect(screen.getByText(/buscando disponibilidad/i)).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "reservá C" } });
  fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
  expect(send).toHaveBeenCalledWith("reservá C");
});

test("hides the transient tool status after streaming finishes", () => {
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [{ role: "assistant", content: "Salas disponibles.", tools: ["list_available_rooms"] }],
    sendMessage: vi.fn(),
    streaming: false,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider><Chat date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.queryByText(/buscando disponibilidad/i)).not.toBeInTheDocument();
});

test("shows a waiting state before the first response token", () => {
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [
      { role: "user", content: "hola", tools: [] },
      { role: "assistant", content: "", tools: [] },
    ],
    sendMessage: vi.fn(),
    streaming: true,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider><Chat date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.getByRole("status")).toHaveTextContent(/preparando respuesta/i);
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
});

test("renders assistant Markdown as formatted text", () => {
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [{ role: "assistant", content: "Indicame: 1. **Fecha** 2. **Hora**", tools: [] }],
    sendMessage: vi.fn(),
    streaming: false,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider><Chat date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.getByText("Fecha").tagName).toBe("STRONG");
  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("never renders internal tool names in an assistant response", () => {
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [{ role: "assistant", content: "Puedo usar `list_available_rooms` para ayudarte.", tools: [] }],
    sendMessage: vi.fn(),
    streaming: false,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider><Chat date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.queryByText(/list_available_rooms/i)).not.toBeInTheDocument();
  expect(screen.getByText(/buscar salas disponibles/i)).toBeInTheDocument();
});
