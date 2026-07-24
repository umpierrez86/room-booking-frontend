import { expect, test } from "@playwright/test";

test("a user can sign in and load the production schedule", async ({ page }) => {
  const username = process.env.SMOKE_USERNAME;
  const password = process.env.SMOKE_PASSWORD;

  if (!username || !password) {
    throw new Error("SMOKE_USERNAME and SMOKE_PASSWORD are required");
  }

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Room Booking" })).toBeVisible();

  await page.getByLabel("usuario").fill(username);
  await page.getByLabel("contraseña").fill(password);

  const loginResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/auth/login") && response.request().method() === "POST",
  );
  const scheduleResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/schedule?date=") && response.request().method() === "GET",
  );

  await page.getByRole("button", { name: "Entrar" }).click();

  const loginResponse = await loginResponsePromise;
  expect(loginResponse.ok(), `login returned HTTP ${loginResponse.status()}`).toBe(true);

  const scheduleResponse = await scheduleResponsePromise;
  expect(scheduleResponse.ok(), `schedule returned HTTP ${scheduleResponse.status()}`).toBe(true);

  await expect(page.getByText("Agenda", { exact: false }).first()).toBeVisible();
  await expect(page.getByTestId("schedule-grid-cell").first()).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
