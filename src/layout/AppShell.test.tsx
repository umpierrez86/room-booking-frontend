import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import AppShell from "./AppShell";

test("toggles chat panel", () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>,
  );
  const btn = screen.getByRole("button", { name: /ocultar|abrir chat/i });
  fireEvent.click(btn);
  expect(screen.getByRole("button", { name: /abrir chat/i })).toBeInTheDocument();
});
