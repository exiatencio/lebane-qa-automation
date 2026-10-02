# Lebane QA Automation Challenge

Suite de pruebas automatizadas desarrollada con Playwright y TypeScript para validar los principales flujos funcionales definidos en el challenge técnico de Lebane.

## Tecnologías

- Playwright
- TypeScript
- Node.js
- dotenv
- GitHub Actions

## Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

Instalar los navegadores requeridos por Playwright:

```bash
npx playwright install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
LEBANE_USER=
LEBANE_PASSWORD=
```

Las credenciales reales no se versionan en el repositorio.

## Ejecución

Ejecutar la suite completa:

```bash
npm test
```

Ejecutar la suite con navegador visible:

```bash
npm run test:headed
```

Ejecutar únicamente el flujo de login:

```bash
npm run test:login
```

Ejecutar únicamente el flujo de creación de proyecto:

```bash
npm run test:project
```

Abrir el último reporte HTML:

```bash
npm run report
```

También es posible ejecutar cualquier spec directamente con Playwright:

```bash
npx playwright test tests/stock.spec.ts
```

## Estructura del proyecto

```text
.github/
  workflows/
    playwright.yml

docs/
  TEST_PLAN.md

playwright/
  .auth/

test-data/
  template-unidades.xlsx

tests/
  auth.setup.ts
  login.spec.ts
  project.spec.ts
  stock.spec.ts
  units.spec.ts
  price-list.spec.ts
  template.spec.ts
  delete-unit.spec.ts

.env.example
.gitignore
package.json
playwright.config.ts
tsconfig.json
README.md
```

## Cobertura automatizada

La suite cubre los principales escenarios funcionales solicitados en el challenge:

- Autenticación de usuario.
- Reutilización de sesión autenticada mediante `storageState`.
- Creación de un nuevo proyecto.
- Configuración de los datos generales del proyecto.
- Asociación del proyecto a una razón social existente del ambiente de prueba.
- Configuración inicial del stock de unidades.
- Validación de la lista de precios inicial.
- Creación manual de unidades.
- Modificación del precio de una unidad dentro de una lista de precios.
- Carga de unidades mediante template Excel.
- Validación de creación de una nueva lista de precios a partir del template.
- Eliminación de una unidad desde una lista de precios.
- Validación de eliminación de una lista cuando queda sin unidades.
- Validación de eliminación de una unidad cuando deja de pertenecer a listas de precios.

## Estrategia de automatización

### Autenticación

`auth.setup.ts` realiza el login y guarda el estado de sesión mediante `storageState`.

Los tests funcionales reutilizan esa sesión para evitar repetir autenticación en cada escenario.

El flujo de login también se mantiene como test independiente.

### Datos de prueba

Los proyectos creados por automatización utilizan nombres dinámicos basados en timestamps para reducir colisiones entre ejecuciones.

Los escenarios relacionados con stock, unidades y listas de precios utilizan un proyecto de prueba controlado como fixture funcional.

La creación de proyecto utiliza una razón social previamente creada para la automatización, evitando depender de información perteneciente a otros usuarios del ambiente compartido.

El flujo de carga por template utiliza el archivo:

```text
test-data/template-unidades.xlsx
```

### Selectores

Se priorizan locators estables y mantenibles utilizando:

- `getByRole`
- `getByPlaceholder`
- atributos `name`
- atributos `data-cy`

Se evita depender de IDs dinámicos generados por la interfaz o XPath absolutos.

### Independencia y estado

Los tests están separados por responsabilidad funcional.

Debido a que varios escenarios trabajan sobre un mismo proyecto de prueba y modifican estado persistente del ambiente, la suite se ejecuta con un único worker para evitar condiciones de carrera entre tests.

```ts
workers: 1
```

### Assertions

Las validaciones se enfocan en comportamiento funcional observable, por ejemplo:

- navegación al proyecto creado;
- persistencia de datos seleccionados;
- existencia de unidades;
- modificación de precios;
- creación de nuevas listas;
- eliminación de unidades y listas vacías.

Se priorizan esperas basadas en estado mediante assertions de Playwright en lugar de pausas estáticas.

## Reportes

Playwright genera un reporte HTML con el resultado de la ejecución.

Puede abrirse mediante:

```bash
npm run report
```

También se generan screenshots ante fallos y traces durante reintentos configurados para CI.

## Integración continua

El proyecto incluye un workflow de GitHub Actions en:

```text
.github/workflows/playwright.yml
```

El pipeline:

1. instala las dependencias;
2. instala los navegadores de Playwright;
3. ejecuta la suite automatizada;
4. publica el reporte HTML como artifact.

Las credenciales del ambiente deben configurarse como GitHub Secrets:

```text
LEBANE_USER
LEBANE_PASSWORD
```

## Documentación

La estrategia de pruebas, alcance y escenarios funcionales se encuentran documentados en:

```text
docs/TEST_PLAN.md
```