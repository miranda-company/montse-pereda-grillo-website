# Escribir proyectos de Portafolio

La referencia completa de creación, metadatos y archivos técnicos está en
[PORTFOLIO_PROJECT_GUIDE.md](PORTFOLIO_PROJECT_GUIDE.md). Este documento se
centra en la escritura y el contenido enriquecido del cuerpo editorial.

Los casos de estudio se guardan como Markdown o MDX en `src/content/portafolio/`. Usa
`docs/templates/portafolio.md` para texto y contenido estándar, o
`docs/templates/portafolio-mdx.mdx` cuando el cuerpo necesite un componente aprobado como
`ContentImage`, `VideoEmbed` o `ImageCarousel`.

## Crear una entrada segura

1. Elige un _slug_ breve, en minúsculas, sin acentos y separado por guiones, por ejemplo
   `sistema-editorial.md`. El archivo genera `/portafolio/sistema-editorial`.
2. Copia una plantilla fuera de la colección y asigna un `archiveNumber` único `P.###` después de
   revisar todos los números existentes. El schema comprueba el formato y `pnpm run test:content`
   detecta duplicados entre proyectos publicados. `P.999` está reservado para la fixture técnica
   y no puede usarse en un proyecto real. Los valores `P.000`, `displayOrder: 0` y la fecha de las
   plantillas son marcadores: sustitúyelos antes de guardar la nueva entrada en la colección.
3. Mantén `draft: true` mientras se redacta y revisa. Un proyecto real usa `placeholder: false`.
   No añadas `fixture`: su valor normal es `false`.
4. Completa `displayOrder` con un entero único, ya que controla tanto el índice como la navegación
   anterior/siguiente. La suite comprueba la unicidad entre proyectos publicados.
5. Escribe solo cliente, rol, disciplinas, resultados y enlaces que hayan sido verificados.
6. Usa los IDs de archivo, sin extensión, en `relatedNotes`, `relatedMedia` y `relatedProjects`.
   Estas relaciones aparecen inline al final del caso y generan backlinks automáticos en sus
   destinos sin restaurar la barra derecha. Cada elemento de `projectLinks` requiere una etiqueta
   clara y una URL externa completa y aprobada.

Si borras o renombras una entrada enlazada, actualiza todos los usos de su ID. Consulta el
procedimiento compartido para [localizar el documento de origen y limpiar conexiones
obsoletas](CONTENT_MODEL.md#cleaning-connections-after-renaming-or-deleting-content).

## Año o periodo del proyecto

`year` es el año inicial o el único año del proyecto. Para un trabajo realizado durante un solo
año, usa únicamente:

```yaml
year: 2024
```

Si el proyecto abarcó varios años, añade `endYear`:

```yaml
year: 2021
endYear: 2023
```

La ficha mostrará `2021–2023` y cambiará la etiqueta de `Año` a `Años`. `endYear` debe ser
posterior a `year`; para un proyecto de un solo año debe omitirse.

## Portada, galería e imágenes editoriales

Guarda los recursos locales en `src/assets/images/portafolio/<slug>/`. Una publicación real
necesita `coverImage` y `coverAlt`; el texto alternativo debe describir lo visible y no repetir el
título. Añade `coverCaption` cuando la portada necesite una leyenda o crédito visible en el detalle;
es opcional y no aparece en la tarjeta del índice. `gallery` conserva imágenes estructuradas después
del cuerpo, cada una con `image`, `alt` y una `caption` opcional.

Las imágenes insertadas dentro del Markdown o MDX son contenido editorial adicional: no sustituyen
la portada ni la galería. Una imagen Markdown normal no genera una leyenda visible a partir de su
título. Cuando necesites una leyenda, usa MDX, importa el activo local y pásalo a `ContentImage`:

```mdx
import ContentImage from "../../components/content/ContentImage.astro"
import inlineImage from "../../assets/images/portafolio/mi-slug/imagen.jpg"

<ContentImage
  src={inlineImage}
  alt="Descripción útil de lo que se ve en la imagen"
  caption="Leyenda editorial opcional."
/>
```

La API es `src: ImageMetadata`, `alt: string` y `caption?: string`. `src` debe ser una imagen local
importada, `alt` es obligatorio y `caption` es opcional. El componente conserva las dimensiones
intrínsecas y sirve directamente el único archivo importado; usa las mismas figuras y leyendas mono
que los vídeos y carruseles. Prepara el archivo con el tamaño final necesario y procura mantenerlo
por debajo de 200 KB.

No uses imágenes remotas, stock genérico ni material de cliente sin permiso. Elimina metadatos
personales, EXIF/GPS o datos de localización innecesarios antes de añadir un activo.

### Carruseles narrativos

`ImageCarousel` es un componente inline adicional para el cuerpo narrativo. `coverImage` continúa
siendo la portada y `gallery` continúa siendo la galería estática estructurada que aparece después
del cuerpo: no conviertas ni elimines ninguno de esos campos para usar el carrusel.

```mdx
import ImageCarousel from "../../components/content/ImageCarousel.astro"
import imageOne from "../../assets/images/portafolio/mi-proyecto/imagen-01.jpg"
import imageTwo from "../../assets/images/portafolio/mi-proyecto/imagen-02.jpg"

<ImageCarousel
  label="Iteraciones verificadas del sistema"
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
Requiere al menos dos imágenes locales, un nombre accesible no vacío y un `alt` significativo en
cada imagen. Las leyendas son opcionales. No acepta URLs remotas, no reproduce automáticamente y
no entra en bucle. Sin JavaScript conserva el desplazamiento horizontal nativo; el JavaScript
añade botones, contador y sincronización con gestos táctiles o trackpad.

## Markdown, MDX, vídeo y código

Markdown admite encabezados, párrafos, listas, enlaces, citas, imágenes estáticas sin leyenda, notas al pie,
tablas y bloques de código. Usa MDX únicamente para componentes Astro revisados como vídeo o
carrusel, o para una imagen estática con `ContentImage`. Desde un archivo situado
directamente en `src/content/portafolio/`, la importación correcta es:

```mdx
import VideoEmbed from "../../components/content/VideoEmbed.astro"
```

`VideoEmbed` solo acepta `youtube` o `vimeo`, un ID válido y un `title` accesible significativo.
La `caption` es opcional. No pegues scripts, HTML de plataformas ni URLs arbitrarias de iframe.

Los bloques cercados funcionan igual en `.md` y `.mdx`. Indica `js`, `ts`, `html`, `css`, `json`,
`bash` o `text`; Astro los resalta con Shiki durante el build y las líneas largas se desplazan
dentro del bloque.

## Revisar y publicar

Ejecuta `pnpm run dev` y revisa el índice y la ruta directa en escritorio, tablet y móvil. Después:

```sh
pnpm run format
pnpm run check
pnpm run build
```

Antes de publicar, comprueba enlaces, derechos de imágenes, textos alternativos, contenido,
conexiones, `archiveNumber`, `displayOrder`, `projectStatus` y metadatos. Elimina también cualquier
etiqueta, caption, imagen o vídeo usado únicamente como prueba técnica. Cambia a `draft: false` solo
con portada, alternativa y caso aprobados. Revisa el diff, usa `git add` únicamente sobre los
archivos previstos, crea un commit descriptivo y haz `git push` a la rama correspondiente.

`src/content/portafolio/ejemplo-mdx.mdx` es una fixture técnica, no una plantilla editorial. Incluye
un carrusel narrativo sin modificar su galería estructurada. Se abre
directamente en desarrollo, usa `fixture: true`, `draft: true` y `P.999`, y queda fuera del índice,
filtros, conteos, conexiones, secuencia y producción.
