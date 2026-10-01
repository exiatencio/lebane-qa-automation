import { test as setup, expect } from '@playwright/test';
const authFile = 'playwright/.auth/user.json';
setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('textbox', { name: 'ejemplo@compañia.com' })
    .fill(process.env.LEBANE_USER!);

  await page
    .getByRole('textbox', { name: 'Contraseña *' })
    .fill(process.env.LEBANE_PASSWORD!);

  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(
    page.getByRole('button', { name: 'Agregar proyecto' })
  ).toBeVisible();

  await page.context().storageState({ path: authFile });
});