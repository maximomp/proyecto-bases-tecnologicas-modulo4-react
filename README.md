# Proyecto: Catálogo de Productos (Next.js)

Este repositorio contiene un trabajo desarrollado con Next.js cuyo objetivo es implementar un catálogo de productos dinámico y reusable. Está pensado para uso académico/profesional como entrega de práctica o demostración técnica: incluye la interfaz de usuario (frontend), la lógica para generar filtros dinámicos a partir de datos y utilidades para normalizar y cachear imágenes localmente.

## Objetivo del trabajo

El propósito principal es demostrar la construcción de una interfaz de catálogo que:

- Consuma datos estructurados en JSON (sin depender de una API remota en tiempo real).
- Genere filtros y ordenaciones de forma dinámica en base a los atributos presentes en los datos.
- Permita replicar fácilmente el conjunto de datos mediante scripts de transformación y descarga de imágenes.

Este enfoque facilita la evaluación técnica porque separa claramente la capa de datos (JSON), la transformación/preprocesado (scripts) y la visualización (Next.js + React).

## Funcionalidades implementadas

1. Vista de catálogo con grid de productos y paginación/ordenación básica.
2. Filtros dinámicos construidos automáticamente leyendo los atributos de los productos.
3. Descarga y almacenamiento local de imágenes de producto en `public/static/images/products/`.
4. Scripts para transformar datos scraped y producir un JSON canónico consumido por la app.
5. Controles UI de usabilidad: scrollers horizontales para barras de filtros, botones que desaparecen en los extremos, y manejo de casos donde el contenido no es suficiente para desplazar.
6. Normalización en tiempo de ejecución para evitar problemas por tipos inconsistentes (por ejemplo, valores numéricos vs. cadenas en ciertos atributos).

## Estructura del repositorio (resumen relevante)

- `app/` — Rutas y componentes Next.js.
- `src/templates/categorization/` — Componentes y plantillas relacionados con el catálogo y los filtros.
- `src/app/css/` — Hojas de estilo principales (incluye `categorization.css`, `header.css`).
- `public/static/` — Recursos estáticos consumidos por la app:
  - `public/static/products.json` — JSON canónico (puede variar según la configuración local).
  - `public/static/images/products/` — Imágenes descargadas localmente.

## Flujo de datos (cómo funciona)

1. Los datos originales, obtenidos por scraping u otra fuente, se guardan en `scripts/products_web.json`.
2. `generate_products.js` procesa esos datos y produce un JSON canónico con los campos que la interfaz espera (categorías, atributos, precio, imagen, etc.).
3. `download_images.js` recorre las entradas del JSON, descarga cada imagen y la guarda en `public/static/images/products/`, actualizando la ruta del campo `imagen` para que apunte a la copia local.
4. La aplicación Next.js carga el JSON local en tiempo de ejecución y construye la vista de catálogo y los filtros a partir de esos datos.

Este diseño permite que la interfaz funcione sin una API externa y que la generación de filtros refleje exactamente los atributos presentes en los productos.

## Requisitos y ejecución

Requisitos mínimos:

- Node.js 18+.
- npm (o yarn / pnpm).

Pasos para ejecutar en desarrollo:

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

3. Abrir en el navegador:

http://localhost:3000

## Consideraciones técnicas y criterios de evaluación

- Separación de responsabilidades: los scripts en `scripts/` se encargan del preprocesado; la app Next.js consume directamente el JSON resultante.
- Trazabilidad: los archivos originales y transformados se conservan en `scripts/` para revisión y repetición de resultados.
- Robustez: se implementó normalización en la capa de filtrado para proteger la interfaz ante inconsistencias de tipo en los datos.

## Posibles mejoras (sugerencias)

- Validación formal del esquema (`JSON Schema`) para `products.json`.
- Un componente genérico parametrizable para los scrollers horizontales.
- Pipeline de tests automatizados para la transformación de datos.

## Comportamiento de los filtros (detalle técnico)

La interfaz de filtrado está diseñada para ser predecible y combinable; a continuación se describen las decisiones técnicas relevantes que se han implementado y que conviene documentar para la entrega:

- Estado local y persistencia: cada cambio de filtro (por ejemplo, marcar una opción de atributo o cambiar el criterio de orden) se guarda en el estado del componente que controla la vista del catálogo. Esto permite que la UI muestre siempre el estado actual de los controles y facilita la serialización si se quisiera guardar en URL o en almacenamiento local.

- useEffect para sincronización: se emplean hooks `useEffect` para reaccionar a cambios en las dependencias (filtros seleccionados, orden, productos, etc.). Estos efectos se usan para recalcular la lista filtrada, ajustar apariencias (por ejemplo, ocultar o mostrar botones de scroll) y para mantener el estado acotado cuando el contenido cambia (clamping del desplazamiento horizontal).

- Comunicación entre filtros y orden: los controles de filtros de atributos y el control de ordenación se comunican a través del estado compartido (props / callbacks). Al cambiar la ordenación se vuelve a aplicar el pipeline de filtrado + orden, garantizando que siempre veas los productos filtrados y luego ordenados.

- Combinación de filtros: los filtros se pueden combinar libremente. La lógica aplica todos los filtros activos sobre el conjunto de productos (operador AND entre diferentes atributos). Para atributos que aceptan múltiples selecciones (por ejemplo, varias marcas o tamaños), la implementación permite seleccionar más de una opción y filtra por la unión/intersección según la regla definida (actualmente, si un producto contiene alguno de los valores seleccionados para ese atributo, pasa el filtro).

- Multi-select y filtros por atributos: los componentes de opción (checkboxes/select) están diseñados para pasar valores como cadenas y la capa de filtrado normaliza tipos para evitar falsos negativos (p. ej. `"15"` vs `15`). Esto evita problemas cuando los datos fuente contienen tipos inconsistentes.

- Comportamiento UX cuando no hay matches: si la combinación de filtros no produce resultados, la vista muestra un mensaje apropiado y mantiene los controles activos para que el evaluador pueda ajustar filtros sin perder contexto.

## Entrega

Este repositorio contiene todo lo necesario para la evaluación práctica: código fuente, scripts de transformación y un conjunto de imágenes descargadas localmente. Para ejecutar la demo, basta seguir las instrucciones del apartado "Requisitos y ejecución".

---

Si necesitas que adecue el README con la cabecera de la asignatura, el nombre del autor, la fecha de entrega u otros metadatos formales, indícalo y lo incorporo inmediatamente.
