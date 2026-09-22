# Escribir notas

Las notas se guardan como archivos Markdown o MDX dentro de `src/content/notas/`. Las entradas
locales de ambos formatos utilizan la misma plantilla de lectura; las publicaciones externas son
tarjetas de enlace sin ruta de detalle. `cardFormat` solo cambia la presentación en el índice.

Usa `docs/templates/nota.md` para una nota normal, `docs/templates/nota-mdx.mdx` cuando necesites
un componente aprobado y `docs/templates/nota-externa.md` para enlazar un artículo publicado en
otro sitio. Las plantillas omiten `fixture`, que vale `false` por defecto. Sigue estas pautas:

1. Nombra el archivo con un _slug_ breve y seguro para URL, en minúsculas, sin acentos y con
   guiones, por ejemplo `sistemas-que-respiran.md`. El nombre genera la ruta
   `/notas/sistemas-que-respiran`.
2. Reserva un `archiveNumber` con el formato `N.000`. Debe ser único antes de publicar; la
   comprobación de integridad detecta duplicados entre entradas publicadas. El próximo número
   disponible para una nota nueva es `N.010`; `N.999` permanece reservado para posibles
   verificaciones técnicas y no debe usarse en contenido editorial.
3. Elige el estado de madurez que describe honestamente el texto:
   - `semilla`: apunte inicial que todavía puede cambiar de forma;
   - `en-crecimiento`: nota desarrollada que sigue incorporando conexiones;
   - `perenne`: estructura estable que permanece abierta a ajustes.
4. Elige un formato para la tarjeta del índice: `compact`, `standard`, `visual` o `featured`.
   Este valor no modifica la página de lectura ni decide si aparece una imagen. `featured` se
   conserva para una futura variante visual, pero por ahora se presenta igual que una tarjeta
   normal no compacta.
5. La imagen de tarjeta es opcional. Para añadirla, guarda el archivo en
   `src/assets/images/notas/<slug>/` y configura `coverImage` con la ruta local y un `coverAlt`
   descriptivo. Las plantillas incluyen ambos campos comentados: elimina `#` al principio de las
   dos líneas y sustituye la ruta y la descripción. Sin `coverImage`, la tarjeta se presenta como
   una tarjeta de texto sin reservar un espacio vacío. Si se define una imagen sin texto
   alternativo, la validación falla.
   La portada ocupa todo el ancho disponible de la tarjeta y conserva su proporción natural; no se
   recorta ni se fuerza a una altura fija.
6. Añade etiquetas breves y consistentes en `tags`. Alimentan los filtros del jardín.
7. Usa en `relatedNotes`, `relatedMedia` y `relatedProjects` los IDs de entradas locales, es decir,
   sus nombres de archivo sin `.md` o `.mdx`. El sistema genera automáticamente el backlink en la
   entrada enlazada; no añadas el enlace inverso salvo que la relación sea realmente mutua.
8. Usa `relatedLinks` solo para conexiones internas adicionales que no correspondan a una entrada
   validada. Cada elemento necesita un `label` visible y un `href` que empiece por `/`.
9. Escribe el cuerpo debajo del frontmatter usando Markdown: párrafos, H2, H3, listas, citas,
   enlaces, énfasis, código, imágenes, figuras y notas al pie cuando aporten a la lectura.

Una nota genuina no debe usar `fixture: true`. Ese campo no es una categoría editorial ni una
forma alternativa de mantener un borrador: sirve únicamente para aislar verificaciones técnicas.

### Ejemplo de conexiones

```yaml
relatedNotes:
  - "mis-lugares-favoritos-de-internet"
relatedMedia:
  - "the-age-of-the-image"
relatedProjects:
  - "syra-coffee"
relatedLinks: []
```

En esta nota los tres campos generan enlaces directos. En las páginas de
`mis-lugares-favoritos-de-internet`,
`the-age-of-the-image` y `syra-coffee` aparecerá automáticamente una **Mención** hacia la nota
actual. Los artículos
externos `kind: external` deben mantener todos los campos de relación vacíos porque no tienen una
ruta local de lectura.

Si borras o renombras una nota, referencia o proyecto, sus relaciones no se actualizan solas.
Sigue el procedimiento compartido para [localizar y limpiar conexiones
obsoletas](CONTENT_MODEL.md#cleaning-connections-after-renaming-or-deleting-content) antes de
publicar.

## Temas del filtro

Cada nota guarda sus temas en el array `tags` del frontmatter:

```yaml
tags:
  - "Sistemas"
  - "Diseño"
```

Los botones de **Tema** de `/notas` no se generan automáticamente a partir de todas las etiquetas
publicadas. La lista visible se define explícitamente en
`src/pages/notas/index.astro`, dentro del array que crea los botones del grupo **Tema**. Los valores
actuales son:

```text
Estrategia
Diseño
Sistemas
Cultura digital
Herramientas
```

La comparación es exacta: mayúsculas, minúsculas, espacios y acentos deben coincidir entre el
botón y el valor escrito en `tags`. Una nota puede tener varios tags y aparecerá al seleccionar
cualquiera de los temas coincidentes.

Para añadir un tema nuevo al filtro:

1. Añade el mismo valor a `tags` en las notas correspondientes.
2. Añade ese valor al array de temas en `src/pages/notas/index.astro`.
3. Colócalo en la posición en la que deba aparecer dentro de la barra de filtros.

Una etiqueta que exista en el contenido pero no en ese array sigue siendo metadata de la nota,
pero no tendrá un botón propio en la barra. Si renombras un tema, actualiza tanto el array como
todas las entradas que lo utilizan; de lo contrario, el botón devolverá cero resultados para esas
notas.

## Artículos publicados en otros sitios

Una publicación externa vive dentro de `src/content/notas/` para poder aparecer, ordenarse y
filtrarse en el jardín, pero no genera una página `/notas/<slug>`. Su tarjeta abre directamente la
URL original en una pestaña nueva. Usa `docs/templates/nota-externa.md` y configura:

```yaml
title: "Título del artículo"
summary: "Descripción breve para la tarjeta."
publishedAt: 2026-08-24
updatedAt: 2026-08-24
state: "perenne"
archiveNumber: "N.010"
kind: "external"
cardFormat: "compact"
externalSource: "Nombre de la publicación"
externalUrl: "https://publicacion.example/articulo"
tags:
  - "Diseño"
relatedNotes: []
relatedMedia: []
relatedProjects: []
relatedLinks: []
featured: false
draft: true
language: "es"
```

Reglas importantes:

- `kind: "external"` activa la tarjeta externa y evita que Astro genere una ruta de detalle local.
- `externalUrl` es obligatoria, debe ser una URL completa y usar HTTPS.
- `externalSource` es el nombre visible del medio, revista, blog o plataforma de origen.
- `cardFormat` debe ser `compact`. La tarjeta externa es deliberadamente sencilla y no acepta
  `coverImage` ni `coverAlt`.
- El título de una tarjeta externa usa un `h3`; las tarjetas de notas locales conservan su `h2`.
  Esta diferencia pertenece al componente y no requiere metadata adicional.
- Conserva `relatedNotes`, `relatedMedia`, `relatedProjects` y `relatedLinks` vacíos porque la
  entrada no tiene una página local donde mostrar esas conexiones.
- `state` y `tags` siguen alimentando los filtros de `/notas`. `perenne` es un valor razonable para
  un artículo ya publicado, pero puedes elegir el estado editorial que corresponda.
- La portada selecciona automáticamente las tres notas publicadas con el `updatedAt` más reciente;
  si este artículo entra en esa selección, también se abrirá allí en una pestaña nueva.
- Mientras preparas la tarjeta, usa `draft: true`. Cambia a `false` cuando el título, el resumen, la
  fuente y la URL estén revisados.
- No escribas cuerpo Markdown debajo del frontmatter: no se publica una página de lectura local.

Los artículos externos cuentan como publicaciones visibles en `/notas` y en las cifras de la
portada, pero su URL externa no se incorpora al sitemap del sitio.

La colección publicada contiene actualmente cuatro artículos externos de Eloquent, identificados
como `N.004`–`N.007`. Las Notas locales publicadas usan también `N.008`–`N.009`; por eso, `N.010`
es el siguiente número libre tanto para una nota local como para otro artículo externo.

## Markdown o MDX

Usa `.md` para texto, encabezados, listas, citas, enlaces, imágenes, notas al pie y bloques de
código. Es la opción predeterminada y no requiere importar componentes.

Escribe los enlaces internos desde la raíz del sitio, por ejemplo
`[Mediateca](/mediateca)`. No uses rutas relativas como `(mediateca)`, porque su
destino depende de si la URL actual termina en `/`.

Usa `.mdx` únicamente cuando la nota necesite `ContentImage`, `VideoEmbed`, `ImageCarousel` u otro componente Astro
de contenido que haya sido revisado y aprobado. Cambiar `mi-nota.md` por `mi-nota.mdx` conserva el
ID `mi-nota`, la ruta `/notas/mi-nota`, sus metadatos y todas sus referencias. No hace falta
modificar `NoteArticle.astro`.

Desde `src/content/notas/`, la importación correcta del vídeo es:

```mdx
import VideoEmbed from "../../components/content/VideoEmbed.astro"
```

### Insertar un vídeo

YouTube y Vimeo son los únicos proveedores aprobados. La aplicación construye internamente la URL
del reproductor y no acepta URLs de iframe arbitrarias.

```mdx
<VideoEmbed
  provider="youtube"
  videoId="VIDEO_ID"
  title="Descripción accesible del contenido del vídeo"
  caption="Comentario editorial opcional sobre el vídeo."
/>
```

- En YouTube, el ID es el valor que aparece después de `v=` en una URL `youtube.com/watch`, o el
  segmento que sigue a `youtu.be/`. Normalmente contiene 11 letras, números, guiones o guiones
  bajos.
- En Vimeo, el ID es la secuencia numérica de la URL del vídeo.
- `title` es obligatorio. Describe el vídeo para quien utiliza tecnología de asistencia; no uses
  textos genéricos como “Vídeo”.
- `caption` es opcional y aporta contexto editorial visible.
- El vídeo permanece alojado en YouTube o Vimeo: no es necesario añadir el archivo audiovisual al
  repositorio.

### Insertar un carrusel de imágenes

`ImageCarousel` permite colocar una secuencia de imágenes locales entre párrafos, encabezados,
vídeos, código u otros bloques del cuerpo. Requiere MDX; una imagen estática normal puede seguir en
`.md`. Guarda los activos en `src/assets/images/notas/<slug>/` e impórtalos desde la entrada:

```mdx
import ImageCarousel from "../../components/content/ImageCarousel.astro"
import imageOne from "../../assets/images/notas/mi-nota/imagen-01.jpg"
import imageTwo from "../../assets/images/notas/mi-nota/imagen-02.jpg"

<ImageCarousel
  label="Exploraciones iniciales del sistema"
  images={[
    {
      src: imageOne,
      alt: "Descripción accesible y concreta de la primera imagen",
      caption: "Leyenda opcional de la primera imagen.",
    },
    {
      src: imageTwo,
      alt: "Descripción accesible y concreta de la segunda imagen",
    },
  ]}
/>
```

La API es `label: string` y `images: { src: ImageMetadata; alt: string; caption?: string }[]`.
`label` da nombre accesible a la región; se necesitan al menos dos imágenes importadas localmente y
cada una requiere un `alt` no vacío. La leyenda es opcional, pero recomendable cuando la prosa no
explica el contexto. No admite URLs remotas, no reproduce automáticamente ni entra en bucle. Sin
JavaScript, las imágenes siguen disponibles mediante desplazamiento horizontal nativo; con
JavaScript, los botones, el contador, el gesto táctil y el trackpad permanecen sincronizados.

### Añadir código

Los bloques de código funcionan igual en `.md` y `.mdx`. Usa tres acentos graves e indica el
lenguaje para obtener resaltado de sintaxis con Shiki:

````md
```ts
interface Note {
  title: string
  state: "semilla" | "en-crecimiento" | "perenne"
}
```
````

Los identificadores habituales incluyen `js`, `ts`, `html`, `css`, `json`, `bash` y `text`. Los
bloques son estáticos, no ejecutan código y no incluyen botón de copia.

### Añadir imágenes locales

Guarda las imágenes editoriales en `src/assets/images/notas/<slug>/`. Cada imagen significativa
necesita un texto alternativo que describa lo visible. Una imagen Markdown normal no convierte su
título entre comillas en una leyenda visible. Para añadir una leyenda usa MDX, importa el activo
desde un archivo situado directamente en `src/content/notas/` y utiliza `ContentImage`:

```mdx
import ContentImage from "../../components/content/ContentImage.astro"
import inlineImage from "../../assets/images/notas/mi-slug/imagen.jpg"

<ContentImage
  src={inlineImage}
  alt="Descripción accesible de lo que se ve en la imagen"
  caption="Leyenda editorial opcional."
/>
```

La API es `src: ImageMetadata`, `alt: string` y `caption?: string`. El componente valida la imagen
local y el texto alternativo, sirve directamente el único archivo importado y presenta la leyenda
con el mismo estilo mono que vídeos y carruseles. Prepara cada imagen con sus dimensiones finales y
procura mantenerla por debajo de 200 KB. No uses una URL remota como sustituto de un activo editorial aprobado.
Antes de incorporar cualquier archivo, elimina metadatos personales, EXIF/GPS o información de
ubicación que no sea necesaria para publicarlo.

## Política de componentes y widgets

- YouTube y Vimeo son los únicos embeds permitidos en este momento.
- Cada futuro proveedor debe tener su propio componente Astro revisado y añadido explícitamente a
  la lista permitida.
- Pegar `<script>`, HTML de widgets o URLs de iframe arbitrarias no forma parte del flujo admitido.
- Un componente interactivo debe usar el mínimo JavaScript cliente necesario.
- Todo widget necesita un nombre accesible significativo y contenido alternativo o un enlace de
  respaldo.

Mantén `draft: true` mientras la nota esté en escritura o revisión, especialmente cuando incorpore
vídeo, código o futuros componentes enriquecidos. El entorno local muestra los borradores para
comprobar su tarjeta y su ruta, pero la producción los excluye. Actualiza `updatedAt` cada vez que
haya un cambio editorial relevante. Cambia a `draft: false` únicamente cuando el contenido y sus
conexiones estén aprobados para publicación.

## Entradas actuales y plantillas

Las cinco Notas locales publicadas son
`el-magnifico-mundo-de-los-jardines-digitales`,
`metodos-para-descubrir-el-problema`,
`mis-lugares-favoritos-de-internet`, `scrum` y
`zettelkasten-un-metodo-para-organizar-nuestro-conocimiento`. Usan los números
`N.001`–`N.003` y `N.008`–`N.009`; los cuatro enlaces externos ocupan
`N.004`–`N.007`.

`como-crear-un-sistema-de-contenido-para-li`,
`guia-de-estudio-creative-operations`, `operational-excellence` y
`priorizar-decisiones` siguen como borradores. Sus números de archivo son
provisionales y deben normalizarse antes de publicarlos. No existe una ruta
técnica `/notas/ejemplo-mdx`.

Usa `docs/templates/nota.md` y `docs/templates/nota-mdx.mdx` como referencias para crear contenido.
La plantilla MDX documenta `ContentImage`, `ImageCarousel` y `VideoEmbed` sin añadir una fixture al
jardín. Antes de publicar una nota real, sustituye todo texto, identificador, imagen, alternativa,
leyenda y enlace de demostración por información editorial verificada.

## Revisión local

Inicia el sitio y visita tanto el índice como la ruta de la nota:

```sh
pnpm run dev
```

Antes de compartir cambios, ejecuta:

```sh
pnpm run format
pnpm run check
pnpm run build
```

Revisa el diff, confirma que el borrador o la publicación tienen el estado correcto y usa el flujo
habitual de Git para añadir los archivos, crear un commit descriptivo y hacer `push` a la rama
correspondiente.
