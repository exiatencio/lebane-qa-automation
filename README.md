# Lebane QA Automation Challenge

Proyecto de automatización de pruebas desarrollado con Playwright y TypeScript para el challenge técnico de Lebane.

## Tecnologías utilizadas

- Playwright
- TypeScript
- Node.js
- dotenv

## Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

Instalar los navegadores de Playwright si fuera necesario:

```bash
npx playwright install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
LEBANE_USER=
LEBANE_PASSWORD=
```

Las credenciales reales no deben versionarse.

## Ejecución de tests

Ejecutar toda la suite:

```bash
npm test
```

Ejecutar los tests con navegador visible:

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

Abrir el último reporte HTML generado:

```bash
npm run report
```

## Estructura del proyecto

```text
tests/
  auth.setup.ts
  login.spec.ts
  project.spec.ts

playwright/
  .auth/

playwright.config.ts
tsconfig.json
.env.example
```

### Archivos principales

- `auth.setup.ts`: realiza la autenticación y genera un estado de sesión reutilizable mediante `storageState`.
- `login.spec.ts`: valida el flujo de autenticación de forma independiente.
- `project.spec.ts`: contiene el flujo automatizado relacionado con la creación y configuración de proyectos.
- `playwright.config.ts`: contiene la configuración general de Playwright, proyectos, dependencias y estrategia de ejecución.
- `.env.example`: documenta las variables de entorno necesarias sin exponer credenciales.

## Decisiones de diseño relevantes

- Se utiliza `storageState` de Playwright para reutilizar una sesión autenticada y evitar repetir el login en cada test funcional.
- El flujo de login se mantiene como test independiente y se ejecuta sin reutilizar el estado autenticado.
- Las credenciales se gestionan mediante variables de entorno y no se almacenan en el repositorio.
- Se priorizan locators estables y mantenibles utilizando `getByRole`, `getByPlaceholder`, atributos `name` y atributos `data-cy`.
- Se evita depender de selectores frágiles basados en posición, IDs dinámicos generados por la UI o XPath absolutos.
- Los datos de prueba se generan dinámicamente mediante timestamps para reducir conflictos entre distintas ejecuciones.
- Los tests se separan por responsabilidad para facilitar el mantenimiento y la futura ampliación de la suite.
- La configuración permite ejecutar tests de forma individual, en modo headed o como suite completa mediante scripts de npm.

## Estado actual de la automatización

Actualmente se encuentran automatizados:

- Autenticación.
- Acceso autenticado reutilizando sesión.
- Inicio del flujo de creación de proyecto.
- Configuración de datos generales del proyecto.
- Selección de moneda, país, estado y ciudad.
- Configuración de dirección, fecha de finalización, tipo de construcción y modalidad de ajuste.
- Inicio del flujo de creación de una nueva razón social.

Algunos flujos dependen de la configuración del ambiente de prueba y pueden requerir información adicional o habilitación por parte del equipo responsable del entorno.