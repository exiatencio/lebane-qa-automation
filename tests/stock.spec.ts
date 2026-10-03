import { test, expect, Page } from '@playwright/test';

async function selectOption(
  page: Page,
  field: string,
  option: string
) {
  const select = page.locator(`[data-cy="${field}"]`);

  await expect(select).toBeVisible();
  await expect(select).toBeEnabled();

  const fieldContainer = select.locator('..');

  const openButton = fieldContainer.getByRole('button', {
    name: 'Abierto'
  });

  await expect(openButton).toBeVisible();
  await expect(openButton).toBeEnabled();

  await openButton.click();

  const optionToSelect = page.getByRole('option', {
    name: option,
    exact: true
  });

  await expect(optionToSelect).toBeVisible({
    timeout: 10000
  });

  await optionToSelect.click();

  await expect(select).toHaveValue(option);
}

test('configurar stock y crear lista de precios inicial', async ({ page }) => {
  const timestamp = Date.now();
  const projectName = `QA-Stock-${timestamp}`;
  const businessName = 'QA-Razon-Social-1790891226568';

  await page.goto('/');

  // Abrir formulario de nuevo proyecto
  await page
    .getByRole('button', { name: 'Agregar proyecto' })
    .click();

  // Completar datos del proyecto
  await page
    .getByRole('textbox', { name: 'Nombre' })
    .fill(projectName);

  await selectOption(
    page,
    'new-renderer-field-moneda',
    'USD'
  );

  await selectOption(
    page,
    'new-renderer-field-pais',
    'Argentina'
  );

  await selectOption(
    page,
    'new-renderer-field-estado',
    'Capital Federal'
  );

  await selectOption(
    page,
    'new-renderer-field-ciudad',
    'Agronomia'
  );

  await page
    .getByRole('textbox', { name: 'Dirección' })
    .fill('Av. QA Automation');

  await page
    .locator('input[name="numeroPuerta"]')
    .fill('1234');

  const endDate = page.locator(
    '[data-cy="new-renderer-field-fechaFin"]'
  );

  await expect(endDate).toBeVisible();
  await expect(endDate).toBeEnabled();

  // Ingresar la fecha simulando escritura real del usuario
  await endDate.click();

  await endDate.pressSequentially(
    '30/09/2032',
    { delay: 50 }
  );

  await endDate.press('Tab');

  await expect(endDate).toHaveValue(
    '30/09/2032'
  );

  await selectOption(
    page,
    'new-renderer-field-tipoConstruccion',
    'Aeropuerto'
  );

  await selectOption(
    page,
    'new-renderer-field-modalidadAjuste',
    'Disponible al vencimiento'
  );

  // Seleccionar razón social
  const razonSocial = page.getByPlaceholder(
    'Escribí para buscar o crear'
  );

  await expect(razonSocial).toBeEnabled();
  await razonSocial.fill(businessName);

  const existingBusiness = page.getByRole('option', {
    name: businessName,
    exact: true
  });

  await expect(existingBusiness).toBeVisible({
    timeout: 10000
  });

  await existingBusiness.click();

  await expect(razonSocial).toHaveValue(
    businessName
  );

  // Registrar el proyecto
  const registerButton = page.getByRole('button', {
    name: 'Registrar'
  });

  await expect(registerButton).toBeEnabled({
    timeout: 10000
  });

  await registerButton.click();

  await expect(page).toHaveURL(
    /\/proyecto\/\d+$/,
    { timeout: 30000 }
  );

  const projectUrl = page.url();

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

  await expect(typologies).toBeVisible();
  await typologies.click();

  await page
    .getByRole('option', {
      name: 'Dos ambientes',
      exact: true
    })
    .click();

  await page.keyboard.press('Escape');

  // Completar unidades por piso
  await page
    .locator('input[name="unidadesPorPiso"]')
    .fill('2');

  await page
    .getByRole('button', {
      name: 'Guardar',
      exact: true
    })
    .click();

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

  const priceListButton = page
    .locator('main button:visible')
    .filter({
      hasText: /^Lista precios /
    });

  await expect(priceListButton).toHaveCount(1);
  await expect(priceListButton).toBeVisible();

  const expectedUnits = [
    '101',
    '102',
    '201',
    '202'
  ];

  for (const unitNumber of expectedUnits) {
    const unitCell = page
      .locator('main td')
      .filter({
        hasText: new RegExp(
          `^\\s*${unitNumber}\\s*$`
        )
      });

    await expect(unitCell).toHaveCount(1);
  }
});