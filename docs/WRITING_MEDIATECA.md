# Escribir referencias de Mediateca

Las referencias se guardan como Markdown o MDX en `src/content/mediateca/`. Usa
`docs/templates/mediateca.md` para contenido estándar y `docs/templates/mediateca-mdx.mdx` cuando
la nota editorial necesite un componente aprobado como `ContentImage`, `VideoEmbed` o `ImageCarousel`.

## Crear una referencia segura

1. Elige un _slug_ breve, en minúsculas, sin acentos y separado por guiones, por ejemplo
   `manual-de-sistemas.md`. El archivo genera `/mediateca/manual-de-sistemas`.
2. Asigna un número único `M.###`. El siguiente número editorial disponible es `M.016`; `M.999`
   está reservado para la fixture técnica y se rechaza en una referencia normal.
3. Empieza con `draft: true` y no añadas `fixture`. Las referencias draft aparecen en desarrollo,
   pero no generan rutas de producción.
4. Selecciona el `format` real: `book`, `article`, `website`, `tool`, `video`, `podcast` u `other`.
5. Elige el consumo principal en `engagementMode`: `read`, `watch` o `listen`. La interfaz los
   muestra como LEER, VER o ESCUCHAR; no sustituyen el formato.
6. Conserva `editorialState: provisional` mientras el cuerpo necesite revisión. Usa `revisado`
   solo después de la aprobación; entonces desaparece el aviso provisional. Este campo no crea ni
   renombra secciones del artículo y tampoco sustituye a `draft`.
7. Elige el `status` editorial (`en-curso`, `consultado`, `de-referencia` o `por-explorar`). Sigue
   apareciendo como metadata aunque no sea un filtro del catálogo.
8. Usa IDs de archivo sin extensión en `relatedNotes`, `relatedMedia` y `relatedProjects`. Cada
   relación genera automáticamente un backlink en la entrada enlazada; añade la relación inversa
   solo cuando quieras declarar una relación mutua. Verifica `externalUrl` contra la fuente
   canónica antes de publicar.
9. Usa `displayInShelf: true` para incluir la referencia en “Anaquel”. Las referencias
   seleccionadas se ordenan por `updatedAt`, de la más reciente a la más antigua; si comparten
   fecha, se usa `archiveNumber`. Las tres primeras referencias publicadas de esta selección
   aparecen también en el “Anaquel” de la homepage. Déjalo en `false` o elimínalo para mostrar la
   entrada únicamente en el catálogo general.

`pnpm run test:content` comprueba que los números de archivo de las entradas publicadas sean
únicos. Los borradores también deben reservar un número libre antes de publicarse.

Si borras o renombras una entrada enlazada, las relaciones existentes no se reescriben. Antes de
publicar, sigue el procedimiento compartido para [interpretar el aviso de Astro y limpiar todas las
conexiones obsoletas](CONTENT_MODEL.md#cleaning-connections-after-renaming-or-deleting-content).

## Escribir el contenido principal

El cuerpo Markdown o MDX que aparece después del segundo `---` controla íntegramente el contenido
principal de la referencia, igual que en Notas. La plantilla no impone secciones ni extrae párrafos
editoriales del frontmatter. Puedes crear, quitar, renombrar y reordenar encabezados, párrafos,
listas, citas, enlaces e imágenes según lo necesite cada referencia.

La plantilla propone esta estructura inicial, pero no es obligatoria:

```md
## Comentario provisional

Tu lectura o comentario personal.

## Por qué está aquí

El motivo por el que forma parte de la Mediateca.

## Ideas que vuelven

- Una idea recurrente
- Otra conexión

## Nota editorial

El desarrollo libre de la referencia.
```

Cuando una referencia pase a `editorialState: revisado`, revisa también el cuerpo y cambia
manualmente “Comentario provisional” por “Comentario” si ese encabezado existe. `title`, `summary`,
`creator`, fechas, estado, cubierta, relaciones y demás datos de catálogo permanecen en el
frontmatter.

### Poemas y saltos de verso

Markdown convierte un salto de línea simple dentro de un párrafo en un espacio. Para conservar la
estructura de un poema, termina cada verso que continúa con una barra invertida (`\`) y separa las
estrofas con una línea en blanco:

```md
Primer verso\
Segundo verso\
Último verso de la estrofa.

Primer verso de la estrofa siguiente\
Último verso del poema.
```

La barra genera un salto `<br>` visible y la línea vacía crea una nueva estrofa. No añadas una regla
global de `white-space` a `.rich-content`, porque también modificaría el espaciado de artículos,
notas y casos de estudio normales.

## Cubierta e imágenes editoriales

Una cubierta opcional puede guardarse en `src/assets/images/mediateca/<slug>/` y referenciarse con
`coverImage`. Cuando exista, `coverAlt` es obligatorio y debe describir lo visible. La misma cubierta
aparece en la tarjeta de “Anaquel” cuando la entrada forma parte de esa selección y en la
página de detalle. Sin `coverImage`, la tarjeta seleccionada muestra un marcador neutro de imagen;
no es necesario crear un activo provisional. En la página de detalle, esa ausencia muestra
automáticamente el icono y la etiqueta LEER, VER o ESCUCHAR definidos por `engagementMode`, en vez de
inventar una ilustración editorial. `coverCaption` es opcional y añade una leyenda o crédito visible
bajo la cubierta del detalle, pero no aparece en la tarjeta del índice.

```yaml
coverImage: "../../assets/images/mediateca/mi-slug/cubierta.jpg"
coverAlt: "Cubierta del libro con una descripción concreta de su diseño"
coverCaption: "Crédito o procedencia opcional de la cubierta."
```

Las imágenes incluidas en el cuerpo son independientes de la cubierta. Cada imagen significativa
necesita texto alternativo útil. Una imagen Markdown normal no convierte su título en una leyenda
visible. Para añadir una leyenda usa MDX e importa el activo local así:

```mdx
import ContentImage from "../../components/content/ContentImage.astro"
import inlineImage from "../../assets/images/mediateca/mi-slug/imagen.jpg"

<ContentImage
  src={inlineImage}
  alt="Descripción accesible de lo que se ve en la imagen"
  caption="Leyenda editorial opcional."
/>
```

La API es `src: ImageMetadata`, `alt: string` y `caption?: string`. `ContentImage` genera el patrón
semántico de figura y leyenda, conserva las dimensiones intrínsecas y sirve directamente el único
archivo importado. Prepara cada imagen con sus dimensiones finales y procura mantenerla por debajo
de 200 KB. No uses URLs remotas como sustituto del repositorio de activos aprobado. Elimina EXIF/GPS,
datos personales y metadatos de localización innecesarios antes de incorporar un archivo.

### Carrusel de imágenes

Guarda sus activos en `src/assets/images/mediateca/<slug>/`. El carrusel requiere MDX, aunque las
imágenes estáticas siguen funcionando en Markdown.

```mdx
import ImageCarousel from "../../components/content/ImageCarousel.astro"
import imageOne from "../../assets/images/mediateca/mi-referencia/imagen-01.jpg"
import imageTwo from "../../assets/images/mediateca/mi-referencia/imagen-02.jpg"

<ImageCarousel
  label="Detalles visuales de la referencia"
  images={[
    {
      src: imageOne,
      alt: "Descripción accesible y concreta de la primera imagen",
      caption: "Leyenda opcional.",
    },
    {
      src: imageTwo,
      alt: "Descripción accesible y concreta de la segunda imagen",
    },
  ]}
/>
```

La API es `label: string` y `images: { src: ImageMetadata; alt: string; caption?: string }[]`.
Valida un nombre accesible no vacío, al menos dos imágenes locales importadas y un `alt`
significativo por imagen. Las leyendas son opcionales y recomendables cuando añaden contexto. El
componente no acepta URLs remotas, no reproduce automáticamente ni entra en bucle. Sin JavaScript
mantiene el desplazamiento horizontal nativo; con JavaScript sincroniza botones y contador con
swipe, trackpad y desplazamiento manual.

## Markdown, MDX, vídeo y código

Markdown cubre encabezados, párrafos, listas, enlaces, citas, imágenes estáticas, notas al pie,
tablas y código. MDX se reserva para componentes Astro aprobados. La importación correcta de vídeo desde
`src/content/mediateca/` es:

Los enlaces hacia otra página del sitio deben empezar por `/`, por ejemplo
`[Bird by Bird](/mediateca/bird-by-bird)`. Evita enlaces relativos como
`(bird-by-bird)`: pueden apuntar a una ruta distinta cuando la página actual
termina en `/`.

```mdx
import VideoEmbed from "../../components/content/VideoEmbed.astro"
```

`VideoEmbed` solo admite YouTube y Vimeo. Requiere un ID validado y un `title` accesible específico;
la `caption` es opcional. La aplicación construye `youtube-nocookie.com` o Vimeo con `dnt=1`, carga
el iframe de forma diferida y ofrece un enlace externo visible. No pegues scripts ni iframes.

Los bloques cercados funcionan igual en `.md` y `.mdx`. Usa identificadores como `js`, `ts`,
`html`, `css`, `json`, `bash` o `text`; el resaltado Shiki es estático y no añade runtime cliente.

## Revisar y publicar

Ejecuta `pnpm run dev`, revisa `/mediateca`, la ruta directa, los filtros y las conexiones. Después:

```sh
pnpm run format
pnpm run check
pnpm run build
```

Confirma autoría, contenido editorial, URL externa, modo de consulta, textos alternativos y relaciones.
Cambia `editorialState` a `revisado` únicamente tras la aprobación editorial y `draft` a `false`
solo cuando la referencia esté lista para producción. Revisa el diff, añade los archivos previstos,
crea un commit descriptivo y haz `git push` a la rama correspondiente.

`src/content/mediateca/ejemplo-mdx.mdx` es una fixture técnica, no una recomendación ni una plantilla.
Incluye un carrusel local para verificar la presentación compartida. Usa `fixture: true`,
`draft: true` y `M.999`; solo tiene ruta directa en desarrollo y queda fuera del
catálogo, filtros, conteos, conexiones y producción.
