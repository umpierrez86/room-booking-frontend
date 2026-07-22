import { render, screen, act } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import * as authApi from "../api/auth";

function Probe() {
  const { isAuthed, signIn, username } = useAuth();
  return <div><span>{isAuthed ? `in:${username}` : "out"}</span>
    <button onClick={() => signIn("User1", "demo1234")}>login</button></div>;
}

test("signIn stores token and user", async () => {
  vi.spyOn(authApi, "login").mockResolvedValue({ access_token: "tok", token_type: "bearer" });
  render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByText("out")).toBeInTheDocument();
  await act(async () => { screen.getByText("login").click(); });
  expect(screen.getByText("in:User1")).toBeInTheDocument();
});
