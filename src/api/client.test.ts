import { apiFetch, setTokenGetter, Unauthorized } from "./client";

beforeEach(() => setTokenGetter(() => "tok123"));

test("adds Authorization header", async () => {
  const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 }));
  await apiFetch("/rooms");
  const headers = (spy.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
  expect(headers.Authorization).toBe("Bearer tok123");
});

test("throws Unauthorized on 401", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 401 }));
  await expect(apiFetch("/rooms")).rejects.toBeInstanceOf(Unauthorized);
});
