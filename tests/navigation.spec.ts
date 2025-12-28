import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Verify Dashboard page loads
    await expect(page.getByText('🎅 Dashboard')).toBeVisible();

    // Click Transactions link
    await page.click('text=Transactions');
    await expect(page).toHaveURL('/transactions');
    await expect(page.getByText('📋 Transactions')).toBeVisible();

    // Click Categories link
    await page.click('text=Categories');
    await expect(page).toHaveURL('/categories');
    await expect(page.getByText('🎁 Categories')).toBeVisible();
  });
});
