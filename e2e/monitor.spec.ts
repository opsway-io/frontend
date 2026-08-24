import { test, expect } from "@playwright/test";

test.describe("Monitor Flows", () => {
  // Use a fixed URL for testing if not using a dynamic baseURL
  const baseURL = "http://localhost:8000";

  test("User can navigate to create monitor page", async ({ page }) => {
    // Navigate to the monitors page
    await page.goto(`${baseURL}/monitors`);

    // Verify we are on the monitors page
    await expect(page).toHaveTitle(/Monitors/i);

    // Look for a 'Create Monitor' button (or similar)
    // The exact text might be 'Create', 'Add Monitor', etc.
    const createButton = page.locator('button:has-text("Create")');
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/\/monitors\/create/);

      // Check for creation form fields (Name, URL, etc.)
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="url"]')).toBeVisible();
      await expect(page.locator('button:has-text("Save")')).toBeVisible();
    }
  });

  test("User can view incidents page", async ({ page }) => {
    // Navigate to incidents
    await page.goto(`${baseURL}/incidents`);

    // Verify we are on incidents page
    await expect(page).toHaveTitle(/Incidents/i);

    // Check if incident lists are rendered
    await expect(page.locator("text=Incidents").first()).toBeVisible();
  });
});
