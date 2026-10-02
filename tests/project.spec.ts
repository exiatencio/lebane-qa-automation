import { test, expect, Page } from '@playwright/test';

async function selectOption(
  page: Page,
  field: string,
  option: string
) {
  const select = page.locator(`[data-cy="${field}"]`);

  await expect(select).toBeVisible();
  await expect(select).toBeEnabled();

  await select.click();

  const optionToSelect = page.getByRole('option', {
    name: option,
    exact: true
  });

  await expect(optionToSelect).toBeVisible();
  await optionToSelect.click();

  // Validar que la selección quedó aplicada
  await expect(select).toHaveValue(option);
}

test('crear proyecto con configuración inicial', async ({ page }) => {
  const timestamp = Date.now();
  const projectName = `QA-Automation-${timestamp}`;
  const businessName = 'QA-Razon-Social-1790891226568';

  console.log(`Proyecto creado por automation: ${projectName}`);

  await page.goto('/');

  // Abrir formulario de nuevo proyecto
  await page
    .getByRole('button', { name: 'Agregar proyecto' })
    .click();

  // Completar nombre del proyecto
  await page
    .getByRole('textbox', { name: 'Nombre' })
    .fill(projectName);

  // Seleccionar moneda
  await selectOption(
    page,
    'new-renderer-field-moneda',
    'USD'
  );

  // Seleccionar país
  await selectOption(
    page,
    'new-renderer-field-pais',
    'Argentina'
  );

  // Seleccionar estado/provincia
  await selectOption(
    page,
    'new-renderer-field-estado',
    'Capital Federal'
  );

  // Seleccionar ciudad
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

  // Fecha de finalización
  const endDate = page.locator(
    '[data-cy="new-renderer-field-fechaFin"]'
  );

  await endDate.fill('30/09/2032');
  await endDate.press('Tab');

  await expect(endDate).toHaveValue('30/09/2032');

  // Tipo de construcción
  await selectOption(
    page,
    'new-renderer-field-tipoConstruccion',
    'Aeropuerto'
  );

  // Modalidad de ajuste
  await selectOption(
    page,
    'new-renderer-field-modalidadAjuste',
    'Disponible al vencimiento'
  );

  // Razón Social
  const razonSocial = page.getByPlaceholder(
    'Escribí para buscar o crear'
  );

  await expect(razonSocial).toBeEnabled();
  await razonSocial.fill(businessName);

  // Seleccionar una razón social existente
  const existingBusiness = page.getByRole('option', {
    name: businessName,
    exact: true
  });

  await expect(existingBusiness).toBeVisible({
    timeout: 10000
  });

  await existingBusiness.click();

  // Validar que la razón social quedó seleccionada
  await expect(razonSocial).toHaveValue(
    businessName
  );

  // Validar que el formulario quede listo para registrarse
  const registerButton = page.getByRole('button', {
    name: 'Registrar'
  });

  await expect(registerButton).toBeEnabled({
    timeout: 10000
  });

  // Registrar el proyecto
  await registerButton.click();

  // Validar acceso al proyecto creado
  await expect(page).toHaveURL(
    /\/proyecto\/\d+$/,
    {
      timeout: 30000
    }
  );

  // Validar onboarding del proyecto
  await expect(
    page.getByText('Comienza a operar tu proyecto', {
      exact: true
    })
  ).toBeVisible();
});