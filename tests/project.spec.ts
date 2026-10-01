import { test, expect } from '@playwright/test';

test('crear proyecto con lista de precios inicial', async ({ page }) => {
  const timestamp = Date.now();
  const projectName = `QA-Automation-${timestamp}`;
  const businessName = `QA-Razon-Social-${timestamp}`;

  await page.goto('/');

  await page.getByRole('button', { name: 'Agregar proyecto' }).click();

  await page
    .getByRole('textbox', { name: 'Nombre' })
    .fill(projectName);

 // Seleccionar moneda
await page
  .locator('[data-cy="new-renderer-field-moneda"]')
  .click();

await page
  .getByRole('option', { name: 'USD' })
  .click();

// Seleccionar país
await page
  .locator('[data-cy="new-renderer-field-pais"]')
  .click();

await page
  .getByRole('option', { name: 'Argentina' })
  .click();

// Seleccionar estado/provincia
await page
  .locator('[data-cy="new-renderer-field-estado"]')
  .click();

await page
  .getByRole('option', { name: 'Capital Federal' })
  .click();

// Seleccionar ciudad
await page
  .locator('[data-cy="new-renderer-field-ciudad"]')
  .click();

await page
  .getByRole('option', { name: 'Agronomia' })
  .click();

  await page
    .getByRole('textbox', { name: 'Dirección' })
    .fill('Av. QA Automation');

  await page
    .locator('input[name="numeroPuerta"]')
    .fill('1234');

    // Fecha de finalización
  await page
  .locator('[data-cy="new-renderer-field-fechaFin"]')
  .fill('30/09/2032');

// Tipo de construcción
  await page
  .locator('[data-cy="new-renderer-field-tipoConstruccion"]')
  .click();

  await page
  .getByRole('option', { name: 'Aeropuerto' })
  .click();

// Modalidad de ajuste
  await page
  .locator('[data-cy="new-renderer-field-modalidadAjuste"]')
  .click();

  await page
  .getByRole('option', { name: 'Disponible al vencimiento' })
  .click();

  // Razón Social
const razonSocial = page.getByPlaceholder('Escribí para buscar o crear');

await razonSocial.fill(businessName);

await page
  .getByRole('option', { name: `Crear nueva razón social "${businessName}"` })
  .click();
});