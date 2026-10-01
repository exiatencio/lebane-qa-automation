# Test Plan - Lebane QA Automation Challenge

## Objetivo

Validar mediante pruebas automatizadas los principales comportamientos relacionados con la creación de proyectos, unidades y listas de precios definidos para el challenge técnico.

## Alcance

Los escenarios contemplados son:

1. Autenticación del usuario.
2. Creación de un nuevo proyecto.
3. Creación de la lista de precios inicial asociada al proyecto.
4. Creación manual de unidades.
5. Carga de unidades mediante template.
6. Modificación del precio de una unidad dentro de una lista de precios.
7. Validación de la creación de una nueva lista de precios al cargar un template.
8. Eliminación de una unidad de una lista de precios.
9. Eliminación de una lista de precios cuando queda sin unidades.
10. Eliminación de una unidad cuando deja de estar asociada a listas de precios.

## Escenarios principales

### Autenticación

**Resultado esperado:**  
El usuario puede autenticarse con credenciales válidas y acceder a la aplicación.

### Creación de proyecto

**Resultado esperado:**  
El usuario puede completar los datos requeridos para crear un proyecto.

Al crear el proyecto debe generarse una lista de precios inicial. El nombre de la lista puede ser especificado o no durante la configuración.

### Creación manual de unidades

**Resultado esperado:**  
Una vez creado el proyecto, debe ser posible agregar nuevas unidades manualmente.

### Carga de unidades mediante template

**Resultado esperado:**  
Debe ser posible cargar unidades utilizando el template proporcionado por la aplicación.

La carga del template debe generar una nueva lista de precios.

### Modificación del precio de una unidad

**Resultado esperado:**  
Si se modifica el precio de una unidad dentro de una lista de precios, la modificación debe reflejarse en dicha lista.

### Eliminación de una unidad de una lista de precios

**Resultado esperado:**  
Al utilizar la acción de eliminación sobre una unidad, esta debe dejar de pertenecer a la lista de precios seleccionada.

### Eliminación de lista de precios vacía

**Resultado esperado:**  
Si luego de eliminar una unidad la lista de precios queda sin unidades asociadas, la lista debe eliminarse.

### Eliminación de unidad sin listas de precios

**Resultado esperado:**  
Si una unidad deja de estar asociada a cualquier lista de precios, la unidad debe eliminarse.

## Estrategia de automatización

- Playwright con TypeScript.
- Reutilización de sesión autenticada mediante `storageState`.
- Datos de prueba generados dinámicamente para reducir conflictos entre ejecuciones.
- Prioridad de locators semánticos y atributos estables.
- Evitar IDs dinámicos, XPath absolutos y selectores dependientes de posición.
- Separación de tests por responsabilidad funcional.

## Consideraciones del ambiente

El ambiente de prueba actualmente presenta un bloqueo relacionado con la configuración de la organización del usuario proporcionado.

Este comportamiento impide continuar con algunos de los flujos posteriores a la creación/configuración inicial del proyecto.

Los escenarios afectados se completarán una vez que el ambiente permita continuar con el flujo funcional.