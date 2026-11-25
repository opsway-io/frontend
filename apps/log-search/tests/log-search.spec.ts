import { test, expect } from '@playwright/test';

test.describe('Log Search E2E Workflow', () => {
  test('User can login and search for logs', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // Verify title and search bar placeholder
    await expect(page.getByText('LogStream')).toBeVisible();
    await expect(page.getByPlaceholder("SELECT * FROM logs WHERE level = 'ERROR'...")).toBeVisible();

    // 2. Click "Login with GitHub"
    await page.getByRole('button', { name: 'Login with GitHub' }).click();

    // 3. Assert user is logged in
    await expect(page.getByText('Logged in as admin')).toBeVisible();

    // Assert there are initially 0 logs showing (we cleared mock logs on init)
    await expect(page.getByText('0 matches')).toBeVisible();

    // 4. Type a mock query
    await page.getByPlaceholder("SELECT * FROM logs WHERE level = 'ERROR'...").fill('ERROR');

    // 5. Click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // 6. Assert that the table updates with the mocked fetch result
    await expect(page.getByText('1 matches')).toBeVisible();
    await expect(page.getByText('Historical search results for: ERROR')).toBeVisible();
  });
});
