import { test, expect } from '@playwright/test';
import path from 'path';

test('cargar template de unidades y crear nueva lista de precios', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';
  const initialPriceListName = 'Lista precios 01/10/2026';

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

  // Identificar la lista de precios actual
  const priceListButton = page.getByRole('button', {
    name: /^Lista precios /
  });

  await expect(priceListButton).toBeVisible();

  // Abrir selector de listas de precios
  await priceListButton.click();

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

  await expect(priceListButton).toHaveText(
    initialPriceListName
  );

  // Abrir menú de templates
  await page
    .getByText('Templates', { exact: true })
    .click();

  // Abrir modal de carga
  await page
    .getByText('Cargar Template de Unidades', { exact: true })
    .click();

  const uploadDialog = page.getByRole('dialog');

  await expect(
    uploadDialog.getByText(
      'Cargar Template de Unidades',
      { exact: true }
    )
  ).toBeVisible();

  // Cargar archivo Excel
  const templatePath = path.resolve(
    'test-data',
    'template-unidades.xlsx'
  );

  await uploadDialog
    .locator('input[type="file"]')
    .setInputFiles(templatePath);

  // Confirmar carga
  const uploadButton = uploadDialog.getByRole('button', {
    name: 'Cargar',
    exact: true
  });

  await expect(uploadButton).toBeEnabled();
  await uploadButton.click();

  // Validar reporte de template
  const reportDialog = page.getByRole('dialog', {
    name: 'Descarga de reporte de template'
  });

  await expect(reportDialog).toBeVisible();

  // Cerrar reporte para continuar con la carga
  await reportDialog
    .getByRole('button', {
      name: 'Cerrar',
      exact: true
    })
    .click();

  // Validar que se creó una nueva lista de precios
  await expect(priceListButton).not.toHaveText(
    initialPriceListName,
    {
      timeout: 30000
    }
  );

  // Validar que la unidad del template fue creada
  const unitNumberCell = page.getByText('901', {
    exact: true
  });

  await expect(unitNumberCell).toBeVisible({
    timeout: 30000
  });

  const unitRow = unitNumberCell.locator('xpath=ancestor::tr');

  await expect(
    unitRow.getByText('901', { exact: true })
  ).toBeVisible();

  await expect(
    unitRow.getByText('Dos ambientes', { exact: true })
  ).toBeVisible();

  await expect(
    unitRow.getByText('Frente', { exact: true })
  ).toBeVisible();

  // Limpiar datos creados por el test
  await unitRow
    .locator('button')
    .last()
    .click();

  const deleteDialog = page.getByRole('dialog');

  await expect(
    deleteDialog.getByRole('heading', {
      name: 'Eliminar unidad'
    })
  ).toBeVisible();

  await deleteDialog
    .getByRole('button', {
      name: 'Confirmar',
      exact: true
    })
    .click();

  await expect(deleteDialog).toBeHidden({
    timeout: 15000
  });

  // Validar que la unidad fue eliminada
  await expect(
    page.getByText('901', { exact: true })
  ).toHaveCount(0, {
    timeout: 15000
  });

  // Validar que la lista vacía fue eliminada
  await expect(priceListButton).toHaveText(
    initialPriceListName,
    {
      timeout: 15000
    }
  );
});