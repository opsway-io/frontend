import { test, expect } from "@playwright/test";

test.describe("Status Page Flows", () => {
  const baseURL = "http://localhost:8000";

  test("User can navigate to status pages and see list", async ({ page }) => {
    await page.goto(`${baseURL}/status-pages`);

    // Verify title
    await expect(page).toHaveTitle(/Status Pages/i);

    // Look for a list or create button
    const createButton = page.locator('button:has-text("Create")');
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/\/status-pages\/create/);

      // Verify creation fields
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="domain"]')).toBeVisible();
    }
  });
});
