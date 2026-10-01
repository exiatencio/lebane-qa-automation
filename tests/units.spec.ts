import { test, expect } from '@playwright/test';

test('crear unidad manualmente', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';

  await page.goto('/');

  await page
    .getByText(projectName, { exact: true })
    .click();

  await expect(page).toHaveURL(/\/proyecto\/\d+$/);

 const unitsLink = page.locator('a[href$="/areas"]', {
  hasText: 'Unidades'
}).first();

await unitsLink.click();

await expect(page).toHaveURL(/\/proyecto\/\d+\/areas$/);
});