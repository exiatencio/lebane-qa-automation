import { test, expect } from '@playwright/test';

test('configurar stock y crear lista de precios inicial', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';

  await page.goto('/');

  // Abrir el proyecto de prueba
  await page
    .getByText(projectName, { exact: true })
    .click();

 // Validar acceso al proyecto
await expect(page).toHaveURL(/\/proyecto\/\d+$/);

// Abrir configuración de Stock de unidades
const stockSection = page
  .getByText(
    'Agrega el stock de unidades disponibles en tu proyecto.',
    { exact: true }
  )
  .locator('..')
  .locator('..');

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
  .getByRole('option', { name: 'Dos ambientes', exact: true })
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
});