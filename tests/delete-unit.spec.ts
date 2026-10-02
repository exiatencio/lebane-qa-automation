import { test, expect } from '@playwright/test';
import path from 'path';

test('eliminar unidad de una lista de precios', async ({ page }) => {
  const projectName = 'QA-Automation-1790891226568';
  const unitNumber = '901';

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
    .getByRole('button', { name: 'Cerrar' })
    .click();

  // Identificar la nueva lista de precios
  const priceListButton = page.getByRole('button', {
    name: /^Lista precios /
  });

  await expect(priceListButton).toBeVisible();

  const newPriceListName = (
    await priceListButton.textContent()
  )?.trim();

  expect(newPriceListName).toBeTruthy();

  // Identificar la unidad cargada por template
  const unitNumberCell = page.getByText(unitNumber, {
    exact: true
  });

  await expect(unitNumberCell).toBeVisible({
    timeout: 30000
  });

  const unitRow = unitNumberCell.locator('xpath=ancestor::tr');

  // Eliminar unidad desde la lista
  await unitRow
    .locator('button')
    .last()
    .click();

  // Confirmar eliminación de la unidad
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
    page.getByText(unitNumber, { exact: true })
  ).toHaveCount(0, {
    timeout: 15000
  });

  // Abrir selector de listas de precios
  await page
    .getByRole('button', {
      name: /Lista precios/,
    })
    .click();

  // Identificar el menú actualizado de listas
  const updatedPriceListMenu = page.getByRole('menu');

  // Validar que la lista vacía fue eliminada
  await expect(
    updatedPriceListMenu.getByText(
      newPriceListName!,
      { exact: true }
    )
  ).toHaveCount(0);
});