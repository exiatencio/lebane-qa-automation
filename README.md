# Lebane QA Automation Challenge

Suite de pruebas automatizadas desarrollada con Playwright y TypeScript para validar los principales flujos funcionales definidos en el challenge técnico de Lebane.

## Tecnologías

- Playwright
- TypeScript
- Node.js
- dotenv
- GitHub Actions

## Requisitos

- Node.js LTS
- npm

## Instalación

Instalar dependencias:

```bash
npm ci
```

Instalar los navegadores de Playwright:

```bash
npx playwright install
```

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

```env
LEBANE_USER=
LEBANE_PASSWORD=
```

Las credenciales reales no se versionan en el repositorio.

El ambiente configurado es:

```text
https://tst.lebane.app
```

## Ejecución

Ejecutar la suite completa:

```bash
npm test
```

Ejecutar con navegador visible:

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

Ejecutar un spec específico:

```bash
npx playwright test tests/stock.spec.ts
```

Abrir el último reporte HTML:

```bash
npm run report
```

## Cobertura automatizada

La suite cubre los principales escenarios solicitados en el challenge:

- autenticación de usuario;
- creación y configuración inicial de proyectos;
- configuración de stock en un proyecto nuevo;
- creación y validación de la lista de precios inicial;
- creación manual de unidades;
- modificación del precio de una unidad;
- validación de persistencia del precio después de recargar;
- carga de unidades mediante template Excel;
- creación de una nueva lista de precios a partir del template;
- eliminación de unidades desde una lista de precios;
- eliminación de listas de precios cuando quedan vacías.

## Datos de prueba

`project.spec.ts` crea un proyecto dinámico con el formato:

```text
QA-Automation-<timestamp>
```

`stock.spec.ts` crea su propio proyecto dinámico con el formato:

```text
QA-Stock-<timestamp>
```

Ambos escenarios requieren que exista la siguiente razón social en el ambiente:

```text
QA-Razon-Social-1790891226568
```

Los escenarios de unidades, precios, template y eliminación utilizan un fixture compartido previamente configurado:

```text
Proyecto: QA-Automation-1790891226568
Lista inicial: Lista precios 01/10/2026
Unidades: 101, 102, 201, 202
```

La unidad `101` puede tener un precio de `50000` o `60000`, mostrado en la grilla como `50.000` o `60.000`. El test de precios alterna entre ambos valores para garantizar una modificación real y validar su persistencia.

La lista `Lista precios 01/10/2026` pertenece al fixture compartido y no representa una lista nueva creada en cada ejecución.

Los escenarios de template utilizan el archivo:

```text
test-data/template-unidades.xlsx
```

La unidad `901` se utiliza únicamente como dato temporal durante los escenarios de carga y eliminación.

El fixture compartido no se crea ni se restaura automáticamente. Si una ejecución se interrumpe, antes de volver a ejecutar debe verificarse que no queden la unidad `901` ni listas temporales residuales.

## Estrategia de automatización

### Autenticación

`auth.setup.ts` realiza el login y guarda el estado de sesión mediante `storageState`.

Los tests funcionales reutilizan esa sesión para evitar repetir la autenticación en cada escenario.

El flujo de login también se mantiene como test independiente.

### Selectores

Se priorizan locators estables y mantenibles mediante:

- `getByRole`
- `getByPlaceholder`
- atributos `name`
- atributos `data-cy`

Se evita depender de IDs dinámicos generados por la interfaz o XPath absolutos.

### Estado y ejecución

Algunos escenarios modifican datos persistentes sobre un fixture compartido. Por este motivo, la suite se ejecuta con un único worker:

```text
workers: 1
```

Esto evita interferencias entre tests dentro de una misma ejecución.

Los proyectos dinámicos y las unidades creadas manualmente pueden permanecer en el ambiente, ya que la limpieza general se considera fuera del alcance del challenge.

La suite utiliza assertions de Playwright basadas en estado y evita pausas estáticas.

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

## Reportes

Playwright genera un reporte HTML con el resultado de la ejecución.

Puede abrirse mediante:

```bash
npm run report
```

También se generan screenshots ante fallos y traces durante el primer reintento.

La configuración utiliza dos reintentos en CI y ninguno en ejecución local.

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

La ejecución en CI requiere las mismas precondiciones del ambiente y del fixture compartido que la ejecución local.

## Documentación

El alcance, estrategia y escenarios funcionales se encuentran detallados en:

```text
docs/TEST_PLAN.md
```