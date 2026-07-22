import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Boom(): never {
  throw new Error("kaboom");
}

test("renders fallback UI when a child throws during render", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>,
  );

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();

  vi.restoreAllMocks();
});

test("renders children normally when there is no error", () => {
  render(
    <ErrorBoundary>
      <div>all good</div>
    </ErrorBoundary>,
  );

  expect(screen.getByText("all good")).toBeInTheDocument();
});
