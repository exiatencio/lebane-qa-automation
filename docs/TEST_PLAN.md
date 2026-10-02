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
11. Validación del comportamiento de eliminación de una unidad al quedar sin asociaciones visibles a listas de precios.

## Escenarios principales

### Autenticación

**Resultado esperado:**  
El usuario puede autenticarse con credenciales válidas y acceder correctamente a la aplicación.

La sesión autenticada puede reutilizarse en los tests funcionales mediante `storageState`.

### Creación de proyecto

**Resultado esperado:**  
El usuario puede completar los datos obligatorios del proyecto y registrarlo correctamente.

`project.spec.ts` crea un proyecto `QA-Automation-<timestamp>` y selecciona la razón social existente `QA-Razon-Social-1790891226568`.

Al finalizar el registro, el usuario debe acceder al proyecto creado y visualizar el flujo de configuración inicial.

Este spec no configura stock ni verifica una lista de precios.

### Configuración inicial del stock

**Resultado esperado:**  
Debe ser posible configurar el stock inicial del proyecto completando los datos requeridos.

`stock.spec.ts` crea su propio proyecto `QA-Stock-<timestamp>`, asociado a la razón social `QA-Razon-Social-1790891226568`. No utiliza el fixture compartido ni depende del proyecto creado por `project.spec.ts`.

Configura un precio por metro cuadrado de `1000`, dos pisos, dos unidades por piso y la tipología `Dos ambientes`.

La configuración debe generar las unidades `101`, `102`, `201` y `202`, visibles en la grilla, y una lista de precios inicial asociada al proyecto.

### Creación de lista de precios inicial

**Resultado esperado:**  
Al configurar el stock inicial del proyecto debe existir una lista de precios asociada a las unidades generadas.

Esta validación forma parte de `stock.spec.ts`. El test verifica una lista visible cuyo nombre comienza con `Lista precios `, sin exigir una fecha específica.

La lista fija `Lista precios 01/10/2026` pertenece al fixture compartido utilizado por otros specs y no es la lista nueva que debe generar este escenario.

### Creación manual de unidades

**Resultado esperado:**  
Debe ser posible agregar una nueva unidad manualmente dentro del proyecto compartido.

`units.spec.ts` genera un número de unidad dinámico y verifica su aparición en la grilla.

La unidad creada permanece en el ambiente al finalizar el test.

### Carga de unidades mediante template

**Resultado esperado:**  
Debe ser posible cargar unidades utilizando el template Excel controlado.

El archivo utilizado por la automatización se encuentra en:

```text
test-data/template-unidades.xlsx
```

`template.spec.ts` selecciona la lista inicial del fixture compartido y carga el archivo.

El test verifica que la unidad `901` se visualice con tipología `Dos ambientes` y disposición `Frente`.

La unidad `901` es temporal: no forma parte del stock inicial requerido y debe estar ausente antes de la carga.

### Creación de nueva lista de precios mediante template

**Resultado esperado:**  
La carga de un template debe generar una nueva lista de precios asociada a las unidades cargadas.

`template.spec.ts` verifica que la lista activa tenga un nombre distinto de `Lista precios 01/10/2026` y que muestre la unidad `901`.

Al finalizar, elimina `901` y verifica su desaparición de la grilla y el retorno a la lista inicial.

### Modificación del precio de una unidad

**Resultado esperado:**  
Si se modifica el precio de una unidad dentro de una lista de precios, el nuevo valor debe persistir y reflejarse en dicha lista.

`price-list.spec.ts` utiliza la unidad `101` de `Lista precios 01/10/2026` en el proyecto compartido.

El precio inicial debe ser `50000` o `60000`, mostrado como `50.000` o `60.000`.

El test alterna entre ambos valores y verifica el resultado después de recargar la página.

### Eliminación de una unidad de una lista de precios

**Resultado esperado:**  
Al ejecutar la acción de eliminación sobre una unidad, esta debe dejar de pertenecer a la lista de precios seleccionada.

`delete-unit.spec.ts` carga el template por sí mismo para generar `901` en una nueva lista.

No depende de que `template.spec.ts` se ejecute previamente.

Luego elimina `901` y verifica que desaparezca de la grilla.

### Eliminación de lista de precios vacía

**Resultado esperado:**  
Si luego de eliminar una unidad la lista de precios queda sin unidades asociadas, la lista debe eliminarse automáticamente.

`delete-unit.spec.ts` verifica que la nueva lista deje de aparecer en el selector y que la lista que estaba activa antes de la carga siga disponible.

### Eliminación de unidad sin listas de precios

**Resultado esperado:**  
Si una unidad deja de estar asociada a cualquier lista de precios, la unidad debe eliminarse del proyecto.

El escenario utiliza `901`, ausente antes de cargar el template y asociada a la lista temporal generada por la prueba.

La automatización verifica la desaparición de `901` de la grilla y la eliminación de la lista temporal.

La evidencia automatizada se limita al comportamiento observable desde la interfaz y no incluye una consulta independiente de todas las asociaciones de la unidad dentro del proyecto.

## Estrategia de automatización

La suite se implementa utilizando Playwright con TypeScript.

Las principales decisiones de automatización son:

- reutilización de sesión autenticada mediante `storageState`;
- test de login independiente del estado autenticado reutilizable;
- separación de tests por responsabilidad funcional;
- proyectos nuevos con nombres dinámicos para los escenarios de creación de proyecto y configuración inicial de stock;
- uso de un proyecto compartido previamente preparado para los escenarios de unidades, precios, template y eliminación;
- uso de una razón social específica creada para la automatización;
- uso de template Excel controlado para los escenarios de carga;
- prioridad de locators semánticos y atributos estables;
- uso de `getByRole`, `getByPlaceholder`, atributos `name` y `data-cy`;
- evitar IDs dinámicos generados por la interfaz y XPath absolutos;
- validaciones basadas en estado observable mediante assertions de Playwright;
- evitar pausas estáticas y esperas arbitrarias;
- ejecución con un único worker para reducir condiciones de carrera sobre datos persistentes compartidos.

## Datos de prueba

El ambiente configurado es:

```text
https://tst.lebane.app
```

Las credenciales deben corresponder a un usuario con acceso a los datos requeridos y permisos para ejecutar los flujos de la suite.

### Proyectos dinámicos

Los proyectos creados durante la automatización utilizan nombres basados en timestamps:

```text
QA-Automation-<timestamp>
QA-Stock-<timestamp>
```

`project.spec.ts` y `stock.spec.ts` requieren que exista y esté disponible para el usuario la razón social:

```text
QA-Razon-Social-1790891226568
```

Estos tests no crean la razón social ni preparan el fixture compartido.

### Fixture compartido

Antes de ejecutar `units.spec.ts`, `price-list.spec.ts`, `template.spec.ts` o `delete-unit.spec.ts`, debe estar disponible el siguiente estado:

- Proyecto: `QA-Automation-1790891226568`.
- Lista inicial: `Lista precios 01/10/2026`.
- Unidades iniciales: `101`, `102`, `201` y `202`, asociadas a esa lista.
- Precio de `101`: `50000` o `60000`, mostrado como `50.000` o `60.000`.
- Unidad `901` ausente.
- Sin listas temporales residuales de cargas anteriores.
- Lista inicial seleccionada al preparar o restaurar el fixture.

La fecha incluida en `Lista precios 01/10/2026` identifica una lista preexistente del fixture.

No debe interpretarse como la fecha de ejecución ni sustituirse por la fecha actual.

La suite no aprovisiona ni restaura automáticamente estos datos.

Si el fixture no existe, debe prepararse con los nombres y el estado indicados antes de ejecutar los specs que lo utilizan.

### Estado posterior y recuperación

Los proyectos dinámicos y las unidades creadas por `units.spec.ts` permanecen en el ambiente después de la ejecución.

`price-list.spec.ts` deja el precio de `101` en `50000` o `60000`. Ambos valores permiten una nueva ejecución.

`template.spec.ts` y `delete-unit.spec.ts` crean y eliminan su propia unidad temporal `901` durante el flujo.

La limpieza no está garantizada si un test falla o se interrumpe antes de finalizar.

Antes de reanudar una ejecución interrumpida:

1. Revisar el fixture compartido e identificar las listas temporales generadas por las cargas.
2. Eliminar `901` de las listas temporales en las que haya quedado y comprobar que estas desaparezcan al quedar vacías.
3. Verificar la ausencia de `901` y de listas temporales residuales, conservando la lista inicial y sus unidades `101`, `102`, `201` y `202`.
4. Seleccionar `Lista precios 01/10/2026` y confirmar que el precio de `101` sea `50000` o `60000`.
5. Restaurar cualquier dato base faltante antes de volver a ejecutar.

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

Esto evita la ejecución simultánea de tests dentro de una misma ejecución.

No coordina ejecuciones separadas ni impide modificaciones manuales del fixture.

No deben ejecutarse simultáneamente suites locales o jobs de CI que utilicen el mismo fixture compartido.

La configuración habilita dos reintentos en CI y ninguno en ejecución local.

Los reintentos no restauran los datos del ambiente.

## Criterios de aprobación

Un escenario se considera aprobado cuando:

- el flujo funcional se completa correctamente;
- las acciones ejecutadas generan el estado esperado;
- los datos creados o modificados se reflejan correctamente en la interfaz;
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
- traces durante el primer reintento;
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

CI requiere el mismo fixture compartido y las mismas precondiciones que la ejecución local.

El workflow no prepara ni restaura esos datos.

## Fuera de alcance

No forman parte del alcance de este challenge:

- pruebas de performance;
- pruebas de seguridad;
- validaciones exhaustivas de todos los módulos de la plataforma;
- pruebas visuales completas;
- validación funcional de módulos no relacionados con proyectos, unidades o listas de precios;
- cobertura exhaustiva de escenarios negativos y validaciones de campos.

El foco de la automatización se mantiene sobre los comportamientos funcionales definidos en la consigna del challenge.