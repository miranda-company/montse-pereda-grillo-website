# Guía de proyectos de Portafolio

Esta es la guía principal para crear, editar y mantener un caso de estudio de
Portafolio. Reúne el flujo editorial, todos los campos de metadatos y el mapa
técnico de la implementación.

Los proyectos viven en `src/content/portafolio/`. La validación definitiva está
en `src/content.config.ts`; esta guía explica cómo usarla sin tener que leer el
código de la colección.

## Crear un proyecto

1. Elige un _slug_ breve, en minúsculas y separado por guiones. Por ejemplo,
   `mi-proyecto.md` genera `/portafolio/mi-proyecto`.
2. Usa `.md` para texto, imágenes estáticas, listas, tablas, citas, notas al pie
   y bloques de código. Usa `.mdx` únicamente cuando necesites componentes como
   `ContentImage`, `ImageCarousel` o `VideoEmbed`.
3. Copia `docs/templates/portafolio.md` o
   `docs/templates/portafolio-mdx.mdx`.
4. Crea la carpeta de recursos
   `src/assets/images/portafolio/<slug>/`.
5. Completa los metadatos y mantén `draft: true` durante la edición.
6. Escribe el caso debajo del segundo separador `---` del _frontmatter_.
7. Comprueba la ruta directa y el índice en desarrollo.
8. Antes de publicar, valida contenido, imágenes, enlaces y accesibilidad; luego
   cambia `draft` a `false`.

## Ejemplo completo de metadatos

```yaml
---
title: "Nombre del proyecto"
summary: "Resumen breve, concreto y verificable."
year: 2021
endYear: 2023
role: "Dirección creativa"
client: "Nombre de la organización"
disciplines:
  - "Fotografía de producto"
  - "Producción de vídeo"
tags:
  - "Fotografía"
  - "Video"
projectStatus: "Finalizado"
archiveNumber: "P.007"
coverImage: "../../assets/images/portafolio/nombre-del-proyecto/portada.jpg"
coverAlt: "Descripción concreta de lo que muestra la portada"
coverCaption: "Leyenda editorial opcional de la portada."
gallery:
  - image: "../../assets/images/portafolio/nombre-del-proyecto/imagen-01.jpg"
    alt: "Descripción accesible de la imagen"
    caption: "Leyenda editorial opcional."
projectLinks:
  - label: "Visitar proyecto"
    url: "https://example.com"
displayOrder: 7
updatedAt: 2026-08-19
placeholder: false
relatedNotes: []
relatedMedia: []
draft: true
fixture: false
language: "es"
# translationKey: "nombre-del-proyecto"
---
```

`endYear`, `client`, `coverImage`, `coverAlt`, `coverCaption`, `translationKey`, las leyendas y
los elementos de los arrays son opcionales según el estado de la entrada. Una
publicación real tiene requisitos adicionales indicados más abajo.

## Referencia de metadatos

| Campo             | Tipo y requisito                                                  | Propósito y presentación                                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | Texto obligatorio                                                 | H1 del caso, título de la tarjeta, navegación anterior/siguiente y búsqueda.                                                                                                                                                       |
| `summary`         | Texto obligatorio                                                 | Introducción del caso, resumen de la tarjeta y contenido buscable.                                                                                                                                                                 |
| `year`            | Entero obligatorio, mínimo 1900                                   | Año inicial o único año del proyecto. Aparece en la ficha lateral y en la tarjeta del índice.                                                                                                                                      |
| `endYear`         | Entero opcional                                                   | Año final de un proyecto plurianual. Debe ser posterior a `year`. La ficha y la tarjeta muestran, por ejemplo, `2021–2023`; omítelo para un solo año.                                                                              |
| `role`            | Texto obligatorio                                                 | Responsabilidad principal de Montse. Aparece como `Rol` en la ficha lateral.                                                                                                                                                       |
| `client`          | Texto opcional                                                    | Cliente u organización. Aparece en la ficha lateral y en la tarjeta; también participa en la búsqueda.                                                                                                                             |
| `disciplines`     | Lista obligatoria con al menos un texto                           | Trabajo concreto realizado. Aparece en la ficha y la tarjeta, y participa en la búsqueda. Puede ser más específico que una etiqueta.                                                                                               |
| `tags`            | Lista opcional; por defecto `[]`                                  | Vocabulario breve y consistente usado por los filtros y la búsqueda del índice. No se muestra en la ficha lateral.                                                                                                                 |
| `projectStatus`   | Texto obligatorio                                                 | Estado real del proyecto, no estado editorial de la página. Se muestra en el encabezado, la ficha y el pie del caso. Usa normalmente `En curso`, `Finalizado` o `En pausa`.                                                        |
| `archiveNumber`   | Texto obligatorio con formato `P.###`                             | Identificador de archivo mostrado en la tarjeta, el encabezado y la ficha. Debe ser único. `P.999` está reservado para la fixture MDX.                                                                                             |
| `coverImage`      | Imagen local opcional durante borrador; obligatoria al publicar   | Portada local usada en el índice, el caso y la tarjeta aleatoria de la homepage. Debe vivir en la carpeta de recursos del proyecto, tener las dimensiones finales necesarias y mantenerse por debajo de 200 KB cuando sea posible. |
| `coverAlt`        | Texto opcional sin portada; obligatorio con portada y al publicar | Alternativa accesible usada cada vez que se muestra la portada, incluida la homepage. Describe lo visible sin repetir el título.                                                                                                   |
| `coverCaption`    | Texto opcional; requiere `coverImage`                             | Leyenda visible bajo la portada del caso. No aparece en la tarjeta compacta del índice.                                                                                                                                            |
| `gallery`         | Lista opcional; por defecto `[]`                                  | Galería estática estructurada renderizada después del cuerpo. Cada elemento requiere `image` y `alt`; `caption` es opcional. No es el carrusel narrativo.                                                                          |
| `projectLinks`    | Lista opcional; por defecto `[]`                                  | Enlaces externos verificados con `label` y `url`. El modelo los conserva, pero actualmente no se muestran porque la barra de conexiones de Portafolio fue retirada. Un placeholder no puede incluirlos.                            |
| `displayOrder`    | Entero obligatorio igual o mayor que 0                            | Orden de las tarjetas y de la navegación anterior/siguiente. Debe ser único entre proyectos publicados.                                                                                                                            |
| `updatedAt`       | Fecha obligatoria                                                 | Fecha mostrada en la ficha, el pie y la tarjeta aleatoria de la homepage cuando el proyecto resulta seleccionado. No determina la selección. Formato recomendado: `YYYY-MM-DD`.                                                    |
| `placeholder`     | Booleano; por defecto `false`                                     | Marca contenido provisional creado para probar el diseño. Muestra el aviso provisional, exige `draft: true` y prohíbe `projectLinks`.                                                                                              |
| `relatedNotes`    | Lista opcional de IDs; por defecto `[]`                           | Relaciones validadas con Notas. Usa nombres de archivo sin extensión. Se muestran inline al final del caso y generan backlinks automáticos en las notas enlazadas.                                                                 |
| `relatedMedia`    | Lista opcional de IDs; por defecto `[]`                           | Relaciones validadas con Mediateca. Usa nombres de archivo sin extensión. Se muestran inline y generan backlinks automáticos.                                                                                                      |
| `relatedProjects` | Lista opcional de IDs; por defecto `[]`                           | Relaciones validadas con otros proyectos. La relación inversa se deriva durante el build; declárala manualmente solo si la relación es mutua.                                                                                      |
| `draft`           | Booleano; por defecto `false`                                     | Controla publicación. Los borradores aparecen en desarrollo y se excluyen del build normal de producción.                                                                                                                          |
| `fixture`         | Booleano; por defecto `false`                                     | Solo para la referencia técnica `ejemplo-mdx`. Una fixture debe ser borrador, usar `P.999` y queda fuera del índice, filtros, conteos, portada, navegación y producción. No debe usarse en proyectos reales.                       |
| `language`        | `es` o `en`; por defecto `es`                                     | Idioma editorial. Las rutas actuales de Portafolio seleccionan contenido en español. No existen rutas inglesas todavía.                                                                                                            |
| `translationKey`  | Texto opcional                                                    | Clave futura para relacionar traducciones. No genera una ruta ni se muestra actualmente.                                                                                                                                           |

Al borrar o renombrar una Nota, referencia de Mediateca o proyecto enlazado, actualiza todos los
usos de su antiguo ID. El procedimiento compartido para [interpretar los avisos del build, encontrar
el archivo de origen y limpiar conexiones
obsoletas](CONTENT_MODEL.md#cleaning-connections-after-renaming-or-deleting-content) cubre los tres
campos de relación y los enlaces Markdown directos.

## Año único y periodo de actividad

Para un proyecto realizado en un solo año:

```yaml
year: 2024
```

Para un proyecto que empezó en 2021 y terminó en 2023:

```yaml
year: 2021
endYear: 2023
```

No repitas el mismo valor en ambos campos. La validación exige que `endYear` sea
posterior a `year`.

## Disciplinas y etiquetas

`disciplines` explica qué trabajo se hizo. `tags` sirve para encontrar y filtrar
proyectos mediante un vocabulario más corto.

```yaml
disciplines:
  - "Dirección creativa"
  - "Fotografía de producto"
  - "Producción de vídeo"
tags:
  - "Fotografía"
  - "Video"
```

Puede haber solapamiento, pero no es necesario duplicar cada disciplina como
etiqueta. Añade solo etiquetas que resulten útiles para navegar el índice.

## Estado del proyecto y estado editorial

`projectStatus`, `placeholder` y `draft` responden a preguntas distintas:

| Situación                     | `projectStatus`                                   | `placeholder` | `draft`                           |
| ----------------------------- | ------------------------------------------------- | ------------- | --------------------------------- |
| Proyecto real en edición      | Estado real, por ejemplo `Finalizado`             | `false`       | `true`                            |
| Proyecto real publicado       | Estado real                                       | `false`       | `false`                           |
| Tarjeta provisional de diseño | `Contenido pendiente` u otra etiqueta provisional | `true`        | `true`                            |
| Fixture técnica MDX           | `Fixture técnica`                                 | `false`       | `true`, además de `fixture: true` |

No uses `projectStatus: "Contenido pendiente"` para indicar simplemente que un
caso real todavía no está publicado. En ese caso conserva el estado real del
proyecto y usa `draft: true`.

## Portada, galería e imágenes narrativas

Organiza los activos así:

```text
src/assets/images/portafolio/<slug>/
├── portada.jpg
├── imagen-01.jpg
└── imagen-02.jpg
```

- `coverImage` es la portada de la tarjeta y del detalle.
- `coverAlt` describe lo visible para tecnologías de asistencia y nunca se sustituye por la leyenda.
- `coverCaption` añade contexto o crédito visible bajo la portada del detalle; se omite cuando no aporta información.
- `gallery` es la galería estática estructurada después del cuerpo.
- Una imagen Markdown/MDX forma parte de la narración. Usa `ContentImage` en MDX cuando necesite
  una leyenda visible.
- `ImageCarousel` es un componente narrativo insertado entre párrafos y no
  sustituye la portada ni la galería.

Usa activos locales, no escales por encima de sus dimensiones originales y
elimina EXIF/GPS o información personal innecesaria. Toda imagen significativa
necesita un texto alternativo preciso.

## Markdown o MDX

Un archivo `.md` cubre la mayoría de casos. Cambiar una entrada de `.md` a
`.mdx` conservando el mismo nombre base mantiene el _slug_ y la ruta.

Escribe los enlaces internos como rutas absolutas del sitio, siempre empezando
por `/`: `[Eloquent](/portafolio/eloquent)`. No uses destinos relativos como
`(eloquent)`, porque cambian de significado cuando la URL actual termina en `/`.

Desde un archivo situado directamente en `src/content/portafolio/`, los
componentes compartidos se importan así:

```mdx
import ContentImage from "../../components/content/ContentImage.astro"
import ImageCarousel from "../../components/content/ImageCarousel.astro"
import VideoEmbed from "../../components/content/VideoEmbed.astro"
```

Una imagen estática con leyenda usa un activo local importado:

```mdx
import image from "../../assets/images/portafolio/mi-proyecto/imagen.jpg"

<ContentImage
  src={image}
  alt="Descripción accesible de lo que se ve en la imagen"
  caption="Leyenda editorial opcional."
/>
```

`ContentImage` valida `src: ImageMetadata`, un `alt` obligatorio y una `caption` opcional. Una
imagen escrita con la sintaxis normal de Markdown puede seguir usándose sin leyenda.

Consulta `docs/WRITING_PORTFOLIO.md` para ejemplos completos de imágenes,
carruseles, vídeo, código y contenido enriquecido. `ejemplo-mdx.mdx` es una
fixture técnica de desarrollo, no una plantilla ni un proyecto real.

## Qué aparece en cada lugar

### Índice `/portafolio`

La tarjeta muestra portada, archivo, año o periodo, título, resumen,
organización y disciplinas. La búsqueda usa título, resumen, organización,
disciplinas y tags. Los botones de filtro se generan a partir de `tags`.

### Detalle `/portafolio/<slug>`

El encabezado muestra archivo, estado, título y resumen. La ficha izquierda
muestra año o periodo, rol, organización, estado, disciplinas, archivo y fecha
de actualización. El centro contiene portada, cuerpo Markdown/MDX, galería y
pie editorial. Portafolio no renderiza actualmente una barra derecha de
conexiones.

### Homepage

La portada carga los proyectos españoles publicados mediante
`getVisibleSpanishProjects(false)` y los pasa a `PortfolioSection.astro`. El
componente comparte con `/portafolio` el encabezado, búsqueda, filtros,
conteo y rejilla responsive de tarjetas. Los borradores, placeholders y
fixtures no aparecen en ninguno de los dos índices.

## Mapa técnico

| Necesidad                                  | Archivo principal                                     | Responsabilidad                                                                             |
| ------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Definir o validar metadatos                | `src/content.config.ts`                               | Schema de la colección y reglas cruzadas. Es la fuente de verdad.                           |
| Añadir o editar un proyecto                | `src/content/portafolio/<slug>.md` o `.mdx`           | Frontmatter y cuerpo editorial.                                                             |
| Plantillas de autoría                      | `docs/templates/portafolio.md` y `portafolio-mdx.mdx` | Puntos de partida seguros.                                                                  |
| Selección de borradores, idioma y fixtures | `src/lib/portfolio.ts`                                | Límites editoriales compartidos por rutas, conteos y portada.                               |
| Índice, búsqueda y filtros                 | `src/pages/portafolio/index.astro`                    | Carga proyectos, crea tags y controla la interfaz del índice.                               |
| Tarjeta del índice                         | `src/components/PortfolioCard.astro`                  | DOM y campos visibles de cada tarjeta.                                                      |
| Ruta de cada caso                          | `src/pages/portafolio/[slug].astro`                   | Genera rutas y navegación anterior/siguiente.                                               |
| Composición del caso                       | `src/components/PortfolioProject.astro`               | Une encabezado, metadatos, portada, cuerpo, galería, pie y secuencia.                       |
| Ficha lateral                              | `src/components/ProjectMeta.astro`                    | Decide qué metadatos se muestran y cómo se formatean.                                       |
| Portada o fallback visual                  | `src/components/PortfolioArtwork.astro`               | Renderiza la imagen local importada o la geometría provisional.                             |
| Scaffold compartido del detalle            | `src/components/EditorialDetailLayout.astro`          | Estructura común con Notas y Mediateca. Modificarlo puede afectar las tres colecciones.     |
| CSS del índice de Portafolio               | `src/styles/portfolio-index.css`                      | Índice, controles y tarjetas.                                                               |
| CSS del detalle de Portafolio              | `src/styles/portfolio-detail.css`                     | Metadatos, portada, galería, pie y navegación.                                              |
| Visual compartido del proyecto             | `src/styles/portfolio-shared.css`                     | Fallback gráfico usado tanto por el índice como por el detalle.                             |
| Geometría compartida del detalle           | `src/styles/editorial-detail.css`                     | Columnas, cabecera y responsive compartidos. Cambios aquí pueden afectar Notas y Mediateca. |
| Tipografía del cuerpo enriquecido          | `src/styles/rich-content.css`                         | Párrafos, headings, imágenes, vídeo, código y carrusel compartidos.                         |
| Tokens y tipografía global                 | `src/styles/global.css`                               | Colores, líneas, fuentes, escalas y reglas globales.                                        |
| Carrusel y vídeo MDX                       | `src/components/content/`                             | Componentes compartidos de contenido enriquecido.                                           |
| Sección compartida de Portafolio           | `src/components/PortfolioSection.astro`               | Encabezado, búsqueda, filtros, conteo y rejilla usados en ambos índices.                    |
| Integración con homepage                   | `src/pages/index.astro`                               | Carga la colección publicada y monta la sección compartida.                                 |

## Cómo hacer cambios técnicos sin afectar otras páginas

- Para cambiar únicamente las tarjetas, modifica `PortfolioCard.astro` y las
  clases `.portfolio-card*` de `portfolio-index.css`.
- Para cambiar únicamente la ficha izquierda, modifica `ProjectMeta.astro` y
  las clases `.project-meta*` de `portfolio-detail.css`.
- Para cambiar la portada o su leyenda en el detalle, modifica `PortfolioArtwork.astro` y
  `.portfolio-artwork*` en `portfolio-shared.css` / `.portfolio-cover*` en
  `portfolio-detail.css`.
- Para cambiar la composición completa del caso, empieza en
  `PortfolioProject.astro` y usa selectores bajo `.portfolio-page`.
- Evita modificar `EditorialDetailLayout.astro`, `editorial-detail.css` o
  `rich-content.css` para una necesidad exclusiva de Portafolio: son piezas
  compartidas con Notas y Mediateca.
- Si añades un campo nuevo, actualiza en este orden: schema, contenido existente,
  componente que lo muestra, plantillas y documentación.
- Si cambias publicación, conteos o selección de entradas, revisa
  `src/lib/portfolio.ts`, la ruta dinámica, el índice y la homepage juntos.

## Publicar de forma segura

Una entrada real con `draft: false` debe tener como mínimo una portada local,
`coverAlt`, `placeholder: false`, un `archiveNumber` válido y contenido aprobado.
Antes de publicar:

```sh
git diff --check
pnpm run check
pnpm run build
```

Comprueba también:

- ruta directa y recarga;
- tarjeta, búsqueda y filtros;
- escritorio, tablet y móvil;
- navegación por teclado y foco visible;
- texto alternativo y captions;
- ausencia de overflow y errores de consola;
- enlaces, fechas, cliente, rol, disciplinas y resultados verificados;
- `archiveNumber` y `displayOrder` únicos.

El schema comprueba tipos, referencias y reglas de cada entrada. Además,
`pnpm run test:content` detecta números de archivo y órdenes duplicados entre
proyectos publicados. Los placeholders draft conservan valores provisionales
que deben normalizarse antes de publicar.
