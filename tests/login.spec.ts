import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('login exitoso en Lebane', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/lebane/);

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
});
