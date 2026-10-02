import { test, expect } from '@playwright/test';

test('configurar stock y crear lista de precios inicial', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';
  const initialPriceListName = 'Lista precios 01/10/2026';

  await page.goto('/');

  // Abrir el proyecto de prueba
  await page
    .getByText(projectName, { exact: true })
    .click();

  // Validar acceso al proyecto
  await expect(page).toHaveURL(/\/proyecto\/\d+$/);

  const projectUrl = page.url();

  // Abrir configuración de Stock de unidades
  const stockSection = page
    .getByText(
      'Agrega el stock de unidades disponibles en tu proyecto.',
      { exact: true }
    )
    .locator('..')
    .locator('..');

  if (await stockSection.count() > 0) {
    await expect(stockSection).toBeVisible();

    await stockSection
      .getByRole('button', { name: 'Agregar' })
      .click();

    // Completar configuración obligatoria del stock
    await page
      .locator('input[name="precioListaMetroCuadrado"]')
      .fill('1000');

    await page
      .locator('input[name="pisos"]')
      .fill('2');

    // Seleccionar tipología
    const typologies = page.locator(
      '[data-cy="new-renderer-field-tipologias"]'
    );

    await typologies.click();

    await page
      .getByRole('option', {
        name: 'Dos ambientes',
        exact: true
      })
      .click();

    await page.keyboard.press('Escape');

    // Unidades por piso
    await page
      .locator('input[name="unidadesPorPiso"]')
      .fill('2');

    // Guardar configuración
    await page
      .getByRole('button', { name: 'Guardar' })
      .click();
  }

  // Abrir sección de unidades
  await page.goto(`${projectUrl}/areas`);

  await expect(page).toHaveURL(
    /\/proyecto\/\d+\/areas$/
  );

  const unitsTab = page.getByRole('tab', {
    name: 'Unidades',
    exact: true
  });

  await expect(unitsTab).toBeVisible();
  await unitsTab.click();

  // Validar lista de precios inicial
  const priceListButton = page.getByRole('button', {
    name: /^Lista precios /
  });

  await expect(priceListButton).toBeVisible();

  // Abrir selector de listas de precios
  await priceListButton.click();

  // Identificar el menú de listas
  const priceListMenu = page.getByRole('menu');

  // Seleccionar la lista de precios inicial
  await priceListMenu
    .getByText(initialPriceListName, { exact: true })
    .click();

  // Cerrar el menú de listas
  const menuBackdrop = page.locator(
    '.MuiMenu-root .MuiBackdrop-root'
  );

  if (await menuBackdrop.isVisible()) {
    await menuBackdrop.click({
      position: { x: 5, y: 5 }
    });
  }

  await expect(menuBackdrop).toBeHidden({
    timeout: 10000
  });

  // Validar unidades generadas por el stock
  for (const unitNumber of ['101', '102', '201', '202']) {
    await expect(
      page.getByText(unitNumber, { exact: true })
    ).toBeVisible({
      timeout: 15000
    });
  }
});