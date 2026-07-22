import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "./Chat";
import { AuthProvider } from "../../context/AuthContext";
import * as hook from "../../hooks/useChatStream";

test("renders messages and sends", () => {
  const send = vi.fn();
  vi.spyOn(hook, "useChatStream").mockReturnValue({
    messages: [
      { role: "user", content: "hola", tools: [] },
      { role: "assistant", content: "¡Hola!", tools: ["list_available_rooms"] },
    ],
    sendMessage: send,
    streaming: false,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Chat date="2026-07-21" />
      </AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.getByText("¡Hola!")).toBeInTheDocument();
  expect(screen.getByText(/list_available_rooms/)).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "reservá C" } });
  fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
  expect(send).toHaveBeenCalledWith("reservá C");
});
