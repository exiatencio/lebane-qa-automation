import { test, expect } from '@playwright/test';

test('modificar precio de una unidad en una lista de precios', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';
  const initialPriceListName = 'Lista precios 01/10/2026';
  const unitNumber = '101';

  const priceListButton = page
    .locator('main button:visible')
    .filter({ hasText: /^Lista precios / });

  const unitRow = page.locator('main tr').filter({
    has: page.locator('td').filter({
      hasText: new RegExp(`^\\s*${unitNumber}\\s*$`)
    })
  });

  const priceCell = unitRow.locator('td[data-index="12"]');

  async function openUnitsAndEnsurePriceList() {
    const unitsTab = page.getByRole('tab', {
      name: 'Unidades',
      exact: true
    });

    await expect(unitsTab).toBeVisible();
    await unitsTab.click();

    // Seleccionar lista de precios inicial
    await expect(priceListButton).toHaveCount(1);
    await expect(priceListButton).toBeVisible();

    const activePriceList = (
      await priceListButton.innerText()
    ).trim();

    if (activePriceList !== initialPriceListName) {
      await priceListButton.click();

      const priceListMenu = page.getByRole('menu');

      await expect(priceListMenu).toBeVisible();

      await priceListMenu
        .getByText(initialPriceListName, { exact: true })
        .click();
    }

    // Validar lista de precios seleccionada
    await expect(priceListButton).toHaveText(
      initialPriceListName
    );

    // Identificar unidad existente
    await expect(unitRow).toHaveCount(1);
    await expect(priceCell).toBeVisible();
  }

  await page.goto('/');

  await page
    .getByText(projectName, { exact: true })
    .click();

  await expect(page).toHaveURL(/\/proyecto\/\d+$/);

  const projectUrl = page.url();

  await page.goto(`${projectUrl}/areas`);

  await expect(page).toHaveURL(/\/proyecto\/\d+\/areas$/);

  await openUnitsAndEnsurePriceList();

  // Validar precio actual
  await expect(priceCell).toHaveText(
    /^(50.000|60.000)$/
  );

  const currentPrice = (
    await priceCell.innerText()
  ).trim();

  const newPrice =
    currentPrice === '50.000'
      ? '60000'
      : '50000';

  const expectedPrice =
    newPrice === '60000'
      ? '60.000'
      : '50.000';

  // Editar precio de la unidad
  await priceCell.click();

  const priceInput = page.getByPlaceholder(
    'Valor...',
    { exact: true }
  );

  await expect(priceInput).toBeVisible();

  await priceInput.fill(newPrice);
  await priceInput.press('Enter');

  // Validar que el precio fue modificado
  await expect(priceInput).toHaveValue(
    expectedPrice
  );

  // Validar persistencia del precio
  await page.reload();

  await openUnitsAndEnsurePriceList();

  await expect(priceCell).toHaveText(
    expectedPrice
  );
});