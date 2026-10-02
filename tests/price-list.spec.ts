import { test, expect } from '@playwright/test';

test('modificar precio de una unidad en una lista de precios', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';
  const unitNumber = '101';

  await page.goto('/');

  await page
    .getByText(projectName, { exact: true })
    .click();

  await expect(page).toHaveURL(/\/proyecto\/\d+$/);

  const projectUrl = page.url();

  await page.goto(`${projectUrl}/areas`);

  await expect(page).toHaveURL(/\/proyecto\/\d+\/areas$/);

  const unitsTab = page.getByRole('tab', {
    name: 'Unidades',
    exact: true
  });

  await expect(unitsTab).toBeVisible();
  await unitsTab.click();

  // Identificar unidad existente
  const unitRow = page
    .getByRole('row')
    .filter({ hasText: unitNumber });

  await expect(unitRow).toBeVisible();

  // Editar precio de la unidad
  await unitRow
    .locator('td[data-index="12"]')
    .click();

  const priceInput = page.getByPlaceholder('Valor...');

  await priceInput.fill('50000');
  await priceInput.press('Enter');

  // Validar que el precio fue modificado en la lista
  await expect(
    unitRow.locator('td[data-index="12"]')
  ).not.toHaveText('0,00');
});