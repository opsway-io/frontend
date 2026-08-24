import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("User can navigate to login page", async ({ page }) => {
    // Navigate to the dashboard login page
    await page.goto("http://localhost:8000/login");

    // Expect the title to contain Sign in
    await expect(page).toHaveTitle(/Sign in/);

    // Expect "Welcome back" to be visible
    await expect(page.locator("text=Welcome back")).toBeVisible();

    // Expect login form to be visible (email and password inputs)
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Expect "Sign In" button to exist
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test("User can navigate to registration page", async ({ page }) => {
    // Navigate to the dashboard login page
    await page.goto("http://localhost:8000/login");

    // Click on the create account link
    await page.click("text=Create a new account");

    // We should be on the registration page
    await expect(page).toHaveURL(/\/login\/register/);

    // Check for registration specific elements
    await expect(
      page.locator("text=Create a new account").first(),
    ).toBeVisible();
  });
});
