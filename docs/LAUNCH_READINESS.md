# Preparación técnica para lanzamiento

Esta guía explica la infraestructura ya preparada para publicar el sitio y los
pasos que todavía requieren una decisión humana. No confirma que el dominio
esté conectado ni que el sitio esté desplegado.

## Estado de indexación

La indexación pública fue autorizada el 30 de agosto de 2026 para las rutas del
alcance de lanzamiento. El archivo
versionado `.env.production` contiene únicamente la configuración pública
`PUBLIC_INDEXING_ENABLED=true`. Por tanto, un build normal de producción:

- declara `index, follow` en las rutas públicas aprobadas;
- responde con `Allow: /` en `/robots.txt`;
- publica un sitemap con las rutas aprobadas para producción;
- usa `https://www.montsepereda.com` como origen canónico.

Las rutas `/yo`, `/notas` y `/mediateca` se conservan como shells de acceso
directo, pero fuerzan `noindex, nofollow` incluso en producción. También quedan
fuera de la navegación, Registro y el sitemap. Los layouts de detalle de Notas
y Mediateca aplican la misma protección a cualquier contenido que se restaure
antes de reabrir esas secciones.

El servidor de desarrollo no carga `.env.production` y continúa declarando
`noindex, nofollow` con `Disallow: /`. La página 404 también permanece bloqueada
en cualquier entorno. No guardes secretos en `.env.production`: todo valor que
empiece por `PUBLIC_` se considera visible para el build. Para generar un build
privado de revisión, anula explícitamente la variable con
`PUBLIC_INDEXING_ENABLED=false`.

`SITE_URL` permite construir una variante con otro origen canónico:

```sh
SITE_URL=https://www.montsepereda.com pnpm run build
```

Si no se define, Astro usa el dominio previsto. Cambiar `SITE_URL` no despliega
ni conecta el dominio; solo modifica URLs absolutas generadas durante el build.

## Metadatos y descubrimiento

`src/layouts/BaseLayout.astro` genera en todas las rutas canónicas:

- título y descripción;
- URL canónica;
- Open Graph y tarjeta social grande;
- imagen social local optimizada por Astro y texto alternativo;
- favicon local;
- grafo JSON-LD con `WebSite`, `Person` y la entidad de la página;
- directivas de indexación coherentes.

Los índices usan `CollectionPage`, `/yo` usa `ProfilePage`, las Notas usan
`Article` y los detalles de Mediateca y Portafolio usan `CreativeWork`. Las
portadas disponibles se reutilizan como imágenes sociales; las páginas sin
cubierta usan la imagen social general.

`src/pages/sitemap.xml.ts` incluye exactamente las 10 rutas públicas e
indexables del build de producción. Comparte `src/lib/site-routes.ts` con
`/registro`, usa las mismas funciones que excluyen drafts y fixtures, añade
fechas de modificación cuando existen y no publica Yo, Notas, Mediateca ni los
aliases de `/biblioteca`.
`src/pages/robots.txt.ts` enlaza ese sitemap y permite su rastreo en producción.

`src/pages/404.astro` genera `404.html` con el mismo shell, jerarquía tipográfica
y tratamiento de foco que el resto del sitio. La ruta queda fuera del sitemap y
fuerza `noindex, nofollow` incluso cuando se habilite la indexación general. El
hosting debe servir este archivo para rutas inexistentes y conservar el estado
HTTP 404; mostrar el diseño con una respuesta 200 no es correcto.

Cuando cambie el dominio previsto, actualiza `SITE_ORIGIN` en `src/lib/site.ts`
y construye con el mismo valor en `SITE_URL`. Verifica después el HTML, el
sitemap y `robots.txt` con `pnpm run test:production`.

## Redirects de hosting

Astro genera redirects estáticos de compatibilidad durante el build. El hosting
debe reproducirlos como respuestas HTTP permanentes antes de conectar el
dominio:

| Origen              | Destino            | Estado |
| ------------------- | ------------------ | -----: |
| `/biblioteca`       | `/mediateca`       |    301 |
| `/biblioteca/:slug` | `/mediateca/:slug` |    301 |

Además, el hosting debe elegir un único origen canónico. Si se conecta el
dominio raíz, redirígelo permanentemente a `www.montsepereda.com` para que
coincida con las URLs generadas. Comprueba los redirects con peticiones HTTP,
no solo mediante navegación en el navegador.

## Cabeceras del entorno público

Configura y revisa en el proveedor de hosting, como mínimo:

- HTTPS y redirección permanente desde HTTP;
- `X-Content-Type-Options: nosniff`;
- una `Referrer-Policy` adecuada;
- una `Permissions-Policy` restrictiva;
- una Content Security Policy probada con los iframes permitidos de YouTube y
  Vimeo antes de aplicarla en modo estricto.

Estas cabeceras dependen del proveedor y no se simulan en el build estático. No
copies una CSP genérica sin probar vídeos, fuentes, imágenes y scripts propios.

## Verificación de lanzamiento

La secuencia completa es:

```sh
pnpm run format
git diff --check
pnpm run verify:launch
```

`verify:launch` ejecuta la suite normal y después Lighthouse sobre la portada,
una Nota, una referencia y un caso de Portafolio. Los informes JSON temporales
se guardan en `.lighthouse/`, que Git ignora. Los mínimos automáticos son:

| Categoría        | Mínimo |
| ---------------- | -----: |
| Rendimiento      |     75 |
| Accesibilidad    |     95 |
| Buenas prácticas |     95 |
| SEO              |     95 |

La auditoría SEO debe confirmar que el build es rastreable. El mínimo vuelve a
95 ahora que el bloqueo intencional se ha retirado; una caída por `noindex`, por
un `robots.txt` restrictivo o por metadatos incompletos debe fallar la revisión.
Tras desplegar el entorno definitivo, repite Lighthouse contra la URL pública y
valida las tarjetas sociales con los inspectores de las plataformas relevantes.

El caso de Syra Coffee puede obtener 77 en buenas prácticas porque sus iframes
de Vimeo generan la cookie técnica `__cf_bm` y la incidencia de cookies
correspondiente aun usando `dnt=1`. El script solo admite esos dos IDs de
auditoría en esa ruta y exige al menos 75; cualquier excepción nueva vuelve a
fallar. Las rutas sin Vimeo conservan el mínimo 95.

## Aprobaciones manuales finales

Las pruebas no pueden aprobar por sí solas:

- biografía, Notas, referencias y casos de Portafolio;
- derechos, créditos, captions, alternativas y enlaces externos;
- recortes y contenido de las imágenes sociales;
- lectura con teclado y lector de pantalla real;
- DNS, HTTPS, redirects, cabeceras y la respuesta HTTP real de la página 404;
- consentimiento o requisitos legales de proveedores de vídeo;
- retirada de avisos editoriales provisionales.

La lista operativa completa permanece en `docs/LAUNCH_CHECKLIST.md`.
