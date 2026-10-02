# Test Plan - Lebane QA Automation Challenge

## Objetivo

Validar mediante pruebas automatizadas los principales comportamientos funcionales relacionados con la creación de proyectos, unidades y listas de precios definidos para el challenge técnico de Lebane.

El objetivo de la suite es verificar los flujos críticos solicitados, priorizando estabilidad, mantenibilidad y validaciones basadas en comportamiento observable.

## Alcance

Los escenarios contemplados son:

1. Autenticación del usuario.
2. Creación de un nuevo proyecto.
3. Configuración inicial del stock de unidades.
4. Creación de la lista de precios inicial.
5. Creación manual de unidades.
6. Carga de unidades mediante template.
7. Modificación del precio de una unidad dentro de una lista de precios.
8. Creación de una nueva lista de precios al cargar un template.
9. Eliminación de una unidad de una lista de precios.
10. Eliminación de una lista de precios cuando queda sin unidades.
11. Eliminación de una unidad cuando deja de estar asociada a listas de precios.

## Escenarios principales

### Autenticación

**Resultado esperado:**  
El usuario puede autenticarse con credenciales válidas y acceder correctamente a la aplicación.

La sesión autenticada puede reutilizarse en los tests funcionales mediante `storageState`.

### Creación de proyecto

**Resultado esperado:**  
El usuario puede completar los datos obligatorios del proyecto y registrarlo correctamente.

La automatización utiliza una razón social previamente creada para pruebas, evitando depender de datos pertenecientes a otros usuarios del ambiente compartido.

Al finalizar el registro, el usuario debe acceder al proyecto creado y visualizar el flujo de configuración inicial.

### Configuración inicial del stock

**Resultado esperado:**  
Debe ser posible configurar el stock inicial del proyecto completando los datos requeridos.

La configuración debe generar las unidades correspondientes y una lista de precios inicial asociada al proyecto.

### Creación de lista de precios inicial

**Resultado esperado:**  
Al configurar el stock inicial del proyecto debe existir una lista de precios asociada a las unidades generadas.

El nombre de la lista puede ser definido por la aplicación cuando no se especifica uno manualmente.

### Creación manual de unidades

**Resultado esperado:**  
Debe ser posible agregar una nueva unidad manualmente dentro del proyecto.

La unidad creada debe persistir en la grilla de unidades.

### Carga de unidades mediante template

**Resultado esperado:**  
Debe ser posible cargar unidades utilizando el template Excel proporcionado por la aplicación.

El archivo utilizado por la automatización se encuentra en:

```text
test-data/template-unidades.xlsx
```

La unidad cargada debe visualizarse correctamente con los datos definidos en el template.

### Creación de nueva lista de precios mediante template

**Resultado esperado:**  
La carga de un template debe generar una nueva lista de precios asociada a las unidades cargadas.

La nueva lista debe quedar disponible dentro del selector de listas de precios.

### Modificación del precio de una unidad

**Resultado esperado:**  
Si se modifica el precio de una unidad dentro de una lista de precios, el nuevo valor debe persistir y reflejarse en dicha lista.

### Eliminación de una unidad de una lista de precios

**Resultado esperado:**  
Al ejecutar la acción de eliminación sobre una unidad, esta debe dejar de pertenecer a la lista de precios seleccionada.

### Eliminación de lista de precios vacía

**Resultado esperado:**  
Si luego de eliminar una unidad la lista de precios queda sin unidades asociadas, la lista debe eliminarse automáticamente.

### Eliminación de unidad sin listas de precios

**Resultado esperado:**  
Si una unidad deja de estar asociada a cualquier lista de precios, la unidad debe eliminarse del proyecto.

## Estrategia de automatización

La suite se implementa utilizando Playwright con TypeScript.

Las principales decisiones de automatización son:

- Reutilización de sesión autenticada mediante `storageState`.
- Test de login independiente del estado autenticado reutilizable.
- Separación de tests por responsabilidad funcional.
- Uso de datos dinámicos para reducir colisiones entre ejecuciones.
- Uso de un proyecto de prueba controlado para los escenarios que modifican stock, unidades y listas de precios.
- Uso de una razón social específica creada para la automatización.
- Uso de template Excel controlado para los escenarios de carga masiva.
- Prioridad de locators semánticos y atributos estables.
- Uso de `getByRole`, `getByPlaceholder`, atributos `name` y `data-cy`.
- Evitar IDs dinámicos generados por la interfaz y XPath absolutos.
- Validaciones basadas en estado observable mediante assertions de Playwright.
- Evitar pausas estáticas y esperas arbitrarias.
- Ejecución con un único worker para reducir condiciones de carrera sobre datos persistentes compartidos.

## Datos de prueba

Los proyectos creados durante la automatización utilizan nombres dinámicos basados en timestamps.

Ejemplo:

```text
QA-Automation-<timestamp>
```

Los escenarios de stock, unidades y listas de precios utilizan un proyecto de prueba controlado previamente preparado para la suite.

La creación de nuevos proyectos utiliza una razón social previamente creada para automatización, con el objetivo de mantener independencia respecto de los datos generados por otros usuarios del ambiente.

## Estrategia de ejecución

La suite puede ejecutarse en modo headless:

```bash
npx playwright test
```

O con navegador visible para debugging:

```bash
npx playwright test --headed
```

Debido a que varios escenarios modifican estado persistente dentro de un mismo proyecto, la ejecución se realiza con:

```ts
workers: 1
```

Esto evita ejecuciones concurrentes que puedan interferir entre sí.

## Criterios de aprobación

Un escenario se considera aprobado cuando:

- el flujo funcional se completa sin errores;
- las acciones ejecutadas generan el estado esperado;
- los datos creados o modificados se reflejan correctamente en la interfaz;
- no se presentan errores inesperados durante la navegación;
- las assertions definidas por el test se cumplen.

La suite se considera satisfactoria cuando todos los tests automatizados finalizan correctamente.

## Evidencia y reportes

Playwright genera un reporte HTML con el resultado de la ejecución.

El reporte puede visualizarse mediante:

```bash
npm run report
```

La configuración también contempla:

- screenshots ante fallos;
- traces durante reintentos en CI;
- publicación del reporte HTML como artifact en GitHub Actions.

## Integración continua

La suite se encuentra preparada para ejecutarse mediante GitHub Actions.

El workflow realiza:

1. instalación de dependencias;
2. instalación de navegadores de Playwright;
3. ejecución de la suite;
4. generación y publicación del reporte HTML.

Las credenciales del ambiente se gestionan mediante GitHub Secrets:

```text
LEBANE_USER
LEBANE_PASSWORD
```

## Fuera de alcance

No forman parte del alcance de este challenge:

- pruebas de performance;
- pruebas de seguridad;
- validaciones exhaustivas de todos los módulos de la plataforma;
- pruebas visuales completas;
- validación funcional de módulos no relacionados con proyectos, unidades o listas de precios;
- cobertura exhaustiva de escenarios negativos y validaciones de campos.

El foco de la automatización se mantiene sobre los comportamientos funcionales definidos en la consigna del challenge.