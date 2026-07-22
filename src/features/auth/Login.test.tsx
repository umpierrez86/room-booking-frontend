import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../../context/AuthContext";
import * as authApi from "../../api/auth";

test("submits credentials", async () => {
  const spy = vi.spyOn(authApi, "login").mockResolvedValue({ access_token: "t", token_type: "bearer" });
  render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: "User1" } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "demo1234" } });
  fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
  await waitFor(() => expect(spy).toHaveBeenCalledWith("User1", "demo1234"));
});
