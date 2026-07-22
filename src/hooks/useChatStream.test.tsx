import type { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parseSSEChunk } from "../api/chat";
import { Unauthorized } from "../api/client";
import { AuthProvider } from "../context/AuthContext";
import { useChatStream } from "./useChatStream";

test("parses SSE data lines into events", () => {
  const buf = 'data: {"type":"token","text":"Hola"}\n\ndata: {"type":"done"}\n\n';
  const events = parseSSEChunk(buf).events;
  expect(events[0]).toEqual({ type: "token", text: "Hola" });
  expect(events[1]).toEqual({ type: "done" });
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

function streamOf(chunks: string[]) {
  let i = 0;
  return {
    getReader: () => ({
      read: async () => {
        if (i < chunks.length) {
          return { value: new TextEncoder().encode(chunks[i++]), done: false };
        }
        return { value: undefined, done: true };
      },
    }),
  } as unknown as ReadableStream<Uint8Array>;
}

test("streaming turns off after a successful stream (try/finally)", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: streamOf(['data: {"type":"token","text":"Hola"}\n\n']),
    }),
  );

  const { result } = renderHook(() => useChatStream("2026-07-21"), { wrapper });

  await act(async () => {
    await result.current.sendMessage("hi");
  });

  expect(result.current.streaming).toBe(false);
  expect(result.current.messages.at(-1)?.content).toBe("Hola");

  vi.unstubAllGlobals();
});

test("streaming turns off even when the response is not ok", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, body: null }));

  const { result } = renderHook(() => useChatStream("2026-07-21"), { wrapper });

  await act(async () => {
    await expect(result.current.sendMessage("hi")).rejects.toThrow();
  });

  await waitFor(() => expect(result.current.streaming).toBe(false));

  vi.unstubAllGlobals();
});

test("throws Unauthorized on a 401 response", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, body: null }));

  const { result } = renderHook(() => useChatStream("2026-07-21"), { wrapper });

  await act(async () => {
    await expect(result.current.sendMessage("hi")).rejects.toBeInstanceOf(Unauthorized);
  });

  vi.unstubAllGlobals();
});

test("throws when response.body is null", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, body: null }));

  const { result } = renderHook(() => useChatStream("2026-07-21"), { wrapper });

  await act(async () => {
    await expect(result.current.sendMessage("hi")).rejects.toThrow(/no body/i);
  });

  vi.unstubAllGlobals();
});
