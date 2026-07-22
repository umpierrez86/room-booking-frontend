import { render, screen, fireEvent } from "@testing-library/react";
import DatePicker from "./DatePicker";

test("opens the popup and selecting a day calls onChange with YYYY-MM-DD", () => {
  const onChange = vi.fn();
  render(<DatePicker date="2026-07-21" onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /21\/07\/2026/ }));

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText(/julio 2026/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "2026-07-15" }));

  expect(onChange).toHaveBeenCalledWith("2026-07-15");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("navigating to the next month updates the visible month and stays on the same day", () => {
  const onChange = vi.fn();
  render(<DatePicker date="2026-07-21" onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /21\/07\/2026/ }));
  fireEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));

  expect(screen.getByText(/agosto 2026/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "2026-08-03" }));
  expect(onChange).toHaveBeenCalledWith("2026-08-03");
});
