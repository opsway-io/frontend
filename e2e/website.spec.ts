import { test, expect } from "@playwright/test";

// Assuming website runs on port 5173 by default Vite config, or a specific port defined in workspace.
// Let's use a dynamic URL if needed, but here we'll assume the standard dev server port for the website.
const WEBSITE_URL = "http://localhost:5173";

test.describe("Website Landing Pages", () => {
  test("renders the hero section with expected text", async ({ page }) => {
    // We navigate to the website root
    await page.goto(WEBSITE_URL);

    // Ensure the main heading is visible
    await expect(page.locator("text=Open Source Operations")).toBeVisible();
    await expect(
      page.locator("text=If something breaks, we'll let you know."),
    ).toBeVisible();
  });

  test("has a Get Started button that links to the login app", async ({
    page,
  }) => {
    await page.goto(WEBSITE_URL);

    // Verify "Get started" button
    const getStartedBtn = page.locator("a", { hasText: "Get started" });
    await expect(getStartedBtn).toBeVisible();
    await expect(getStartedBtn).toHaveAttribute(
      "href",
      "https://my.opsway.eu/login",
    );
  });

  test("has a GitHub button", async ({ page }) => {
    await page.goto(WEBSITE_URL);

    // Verify "GitHub" button
    const githubBtn = page.locator("a", { hasText: "GitHub" });
    await expect(githubBtn).toBeVisible();
    await expect(githubBtn).toHaveAttribute(
      "href",
      "https://github.com/opsway-io",
    );
  });
});
