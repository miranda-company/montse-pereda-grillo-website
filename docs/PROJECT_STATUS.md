# Estado del proyecto

Esta es la fuente de verdad sobre el estado actual de Rodolfo Miranda Company.
Describe lo que existe en el repositorio y separa la generación técnica de la
aprobación editorial.

## Resumen

- **Fecha de revisión:** 16 de septiembre de 2026.
- **Rama de trabajo:** `main`.
- **Framework:** Astro 7 con salida HTML estática y TypeScript estricto.
- **Idioma activo:** español en las rutas raíz. No existen rutas inglesas.
- **Indexación:** habilitada en builds de producción mediante
  `.env.production`; desarrollo y la página 404 permanecen bloqueados.
- **Metadatos:** canonical, tarjetas sociales, JSON-LD, sitemap y directivas de
  rastreo de producción implementados y sincronizados.
- **Hosting y dominio:** no configurados ni verificados en el repositorio.
- **Dominio previsto:** `www.rodolfomiranda.company`.

## Rutas y contenido

| Sección              | Ruta                 | Desarrollo                                               | Producción                                        |
| -------------------- | -------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| Portada              | `/`                  | Cuatro paneles y previews derivados de contenido visible | Se genera con estadísticas de entradas publicadas |
| Yo                   | `/yo`                | Biografía, retrato y trayectoria                         | Se genera; biografía y trayectoria aprobadas      |
| Notas                | `/notas`             | 10 notas locales y 4 enlaces externos                    | 5 notas locales y los 4 enlaces externos          |
| Detalle de Nota      | `/notas/[slug]`      | 10 rutas editoriales locales                             | 5 rutas publicadas                                |
| Mediateca            | `/mediateca`         | 16 referencias ordinarias                                | 15 referencias publicadas                         |
| Detalle de Mediateca | `/mediateca/[slug]`  | 16 rutas editoriales y una fixture directa               | Las 15 referencias publicadas                     |
| Portafolio           | `/portafolio`        | 15 proyectos ordinarios                                  | 7 proyectos publicados                            |
| Caso de Portafolio   | `/portafolio/[slug]` | 15 rutas editoriales y una fixture directa               | Los 7 casos publicados                            |
| Colofón              | `/colofon`           | Explicación técnica y editorial del sitio                | Se genera                                         |
| Registro             | `/registro`          | Índice alfabético derivado de las rutas publicadas       | Se genera y coincide con el sitemap               |
| Página no encontrada | `/404`               | Página de error propia                                   | Se genera siempre con `noindex, nofollow`         |

Los siete casos de Portafolio incluidos en producción son:

- `syra-coffee`
- `bsc`
- `minka-icm`
- `cn-sant-andreu`
- `modulab-barcelona`
- `eloquent`
- `elespacio`

Las otras ocho entradas de Portafolio son placeholders con `draft: true`. No
entran en producción. Antes de publicar una de ellas hay que reemplazar el
contenido pendiente, asignar valores únicos y completar su revisión editorial.

Las cinco Notas locales publicadas, incluidas en desarrollo y producción, son:

- `el-magnifico-mundo-de-los-jardines-digitales`
- `metodos-para-descubrir-el-problema`
- `zettelkasten-un-metodo-para-organizar-nuestro-conocimiento`
- `mis-lugares-favoritos-de-internet`
- `scrum`

Las otras cinco Notas locales, `como-crear-un-sistema-de-contenido-para-li`,
`contextual-adjacency`, `guia-de-estudio-creative-operations`,
`operational-excellence` y `priorizar-decisiones`, permanecen como drafts
visibles solo en desarrollo.

## Límites de publicación

| Colección  | Entradas ordinarias en desarrollo | Entradas en producción | Fixture técnica                          |
| ---------- | --------------------------------: | ---------------------: | ---------------------------------------- |
| Notas      |                                10 |                      5 | Ninguna                                  |
| Mediateca  |                                16 |                     15 | `M.999`, solo ruta directa en desarrollo |
| Portafolio |                                15 |                      7 | `P.999`, solo ruta directa en desarrollo |

En total hay 50 rutas canónicas en desarrollo y 34 en un build normal de
producción, sin contar los aliases de `/biblioteca` ni la página 404. Las dos
rutas `ejemplo-mdx` de Mediateca y Portafolio se usan para revisar componentes
técnicos y no aparecen en índices, filtros, conteos, conexiones, navegación
anterior/siguiente, portada o producción.

`draft: false` permite generar una entrada, pero no equivale a aprobación
editorial. Los textos, créditos, enlaces, imágenes y alternativas deben
revisarse antes del lanzamiento.

## Sistemas implementados

- Estructura común `BaseLayout → PageShell → Header + main + Footer`.
- Jerarquía tipográfica semántica compartida para H1–H6, cuerpo y metadatos.
- H1 compacto fluido entre 48 y 56 px, sin guionado automático y con un
  fallback seguro para palabras más anchas que su contenedor.
- Separación superior de los intros alineada entre Yo, Portafolio, Notas y
  Mediateca, conservando la altura editorial propia de cada título.
- Tokens semánticos compartidos para superficies, color de interfaz, foco y
  movimiento, con rangos responsivos compact, medium y expanded documentados.
- CSS específico de la portada aislado en `src/styles/home.css`; las demás
  rutas no cargan su composición de paneles y previews.
- Colecciones Astro validadas y helpers centrales para separar drafts y
  fixtures.
- Grafo editorial bidireccional generado durante el build: las relaciones
  declaradas en Notas, Mediateca y Portafolio producen enlaces directos,
  recíprocos y backlinks automáticos sin JavaScript cliente.
- Navegación por hash con offset de cabecera y respeto por movimiento reducido.
- Cabecera global fija y compacta de 48 px después de 600 px de desplazamiento,
  con padding lateral responsive compartido, sin duplicar la navegación ni
  desplazar el contenido.
- Control global para volver arriba desde el mismo umbral y controlador de
  scroll, con objetivo táctil de 48 px y respeto por movimiento reducido.
- Navegación global hacia Yo, Portafolio, Notas y Mediateca; el menú móvil se
  cierra con `Escape` y restaura el foco.
- Footer global con LinkedIn, GitHub, email, Colofón y Registro; Registro y
  el sitemap comparten una única lista de rutas publicadas.
- Filtros, orden, búsqueda, conteos y estados vacíos en los índices editoriales;
  Notas y Mediateca comparten el controlador tipado de disclosure y filtros.
- Layout de detalle compartido por Notas, Mediateca y Portafolio, con una
  variante de Portafolio sin barra derecha y navegación anterior/siguiente a
  todo el ancho del contenedor.
- Cuerpo `.rich-content` común para Markdown, MDX, imágenes con leyenda,
  carruseles, vídeo, código, tablas y notas al pie.
- Imágenes locales servidas desde un único archivo importado, con dimensiones
  intrínsecas y texto alternativo validado; no se generan variantes responsivas.
- Redirects de compatibilidad desde `/biblioteca` hacia `/mediateca`.
- Metadatos canónicos y sociales, favicon, JSON-LD, sitemap derivado del
  contenido e indexación habilitada solo en builds de producción.
- Página 404 propia, integrada en el layout común y siempre bloqueada para
  indexación aunque el resto del sitio sea rastreable.
- Fuentes locales y generación estática sin framework cliente.
- Pruebas Playwright de rutas, responsive e interacción, escaneos axe-core,
  contratos de producción, presupuestos de salida y workflow de GitHub Actions.
- Comprobación de integridad editorial para impedir valores `archiveNumber` y
  `displayOrder` duplicados entre entradas publicadas.
- Auditoría Lighthouse reproducible sobre cuatro rutas representativas.

## Verificación actual

- `pnpm run format:check`: correcto.
- `git diff --check`: correcto.
- `pnpm run check`: 67 archivos, 0 errores, 0 avisos y 0 sugerencias.
- `pnpm run test:content`: detecta una incidencia pendiente: `elespacio` y
  `syra-coffee` comparten actualmente `displayOrder: 1`.
- `pnpm run build`: correcto; genera 34 rutas canónicas, 16 redirects y la
  página 404 sin avisos de relaciones obsoletas.
- `pnpm run test:production`: queda bloqueado por esa misma colisión, que sitúa
  Elespacio antes de Syra Coffee en el sitemap en lugar de respetar el contrato
  publicado.
- `pnpm run test:budgets`: correcto; `dist` ocupa 15.480,5 KiB, el HTML 701,4
  KiB, el CSS 59,3 KiB, el JavaScript emitido 4,6 KiB y las fuentes 94,9 KiB;
  la imagen mayor pesa 367,1 KiB.
- `pnpm run test:e2e:dist`: 57 pruebas correctas en Chromium, incluidos los
  escaneos axe-core WCAG A/AA, escritorio, móvil, teclado, filtros, fragmentos,
  cabecera fija, alineación de intros, ausencia de saltos de contenido,
  carruseles, conexiones bidireccionales, movimiento reducido, consola,
  imágenes y overflow.
- `pnpm run audit:lighthouse:dist`: rendimiento 97 en portada, 99 en Syra Coffee
  y 100 en la Nota y Mediateca; accesibilidad 98 en portada y 100 en las demás;
  buenas prácticas 100 salvo Syra Coffee (77 por la cookie externa de Vimeo);
  SEO 100 en las cuatro rutas.
- Las fixtures técnicas quedan fuera de `dist` y de la suite de producción.
- La automatización no sustituye una auditoría manual completa de accesibilidad
  ni una revisión visual antes de publicar.

## Trabajo pendiente

- Completar la revisión editorial de las cinco Notas locales y confirmar las
  quince referencias de Mediateca incluidas en producción.
- Completar las cinco Notas draft y sustituir sus `archiveNumber` provisionales
  por identificadores únicos antes de publicarlas.
- Revisar los siete casos de Portafolio publicados: texto, resultados, derechos,
  créditos, enlaces, alternativas y leyendas.
- Mantener los ocho placeholders de Portafolio como drafts hasta sustituir todo
  el contenido pendiente y normalizar `archiveNumber` y `displayOrder`.
- Resolver el `displayOrder: 1` duplicado entre los proyectos publicados
  Elespacio y Syra Coffee antes de integrar o desplegar el siguiente build.
- Elegir hosting, configurar redirects permanentes y conectar el dominio.
- Revisar previews sociales y datos estructurados con las URLs públicas.
- Verificar `index, follow`, `robots.txt`, sitemap y canonical en el dominio
  público después de desplegar el nuevo `dist/`.
