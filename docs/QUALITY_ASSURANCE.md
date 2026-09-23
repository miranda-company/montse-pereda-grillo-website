# Verificación y calidad

Este documento describe las comprobaciones automáticas que protegen la
estructura, la accesibilidad, los límites editoriales y el peso de la salida
estática. Complementan la revisión visual y editorial; no la sustituyen.

## Preparación local

Después de `pnpm install`, instala la versión de Chromium fijada por Playwright:

```sh
pnpm exec playwright install chromium
```

Playwright sirve el build estático mediante Astro en `127.0.0.1:4173`, aislado
del servidor de desarrollo interactivo, normalmente abierto en el puerto 8444
para este proyecto. `pnpm run test:e2e`
genera primero un build actualizado; dentro de `pnpm run verify` se reutiliza el
`dist/` que acaba de construirse. La variable `PLAYWRIGHT_PORT` permite usar
otro puerto si es necesario.

## Comandos

```sh
pnpm run test:content     # identificadores y orden publicados únicos
pnpm run test:e2e         # build, navegador, interacción y accesibilidad
pnpm run test:production  # rutas, conteos y exclusión de fixtures en dist
pnpm run test:budgets     # límites de peso para la salida ya construida
pnpm run test:links       # destinos y fragmentos internos de la salida
pnpm run test             # todas las comprobaciones anteriores
pnpm run verify           # formato, build y todas las pruebas
pnpm run audit:lighthouse # build y auditoría de cuatro rutas representativas
pnpm run audit:lighthouse:dist # audita el dist existente sin reconstruirlo
pnpm run verify:launch   # suite normal y Lighthouse, con un único build
```

`test:production` y `test:budgets` requieren un `dist/` reciente. El comando
`verify` siempre ejecuta el build antes de ellos y es la opción recomendada
antes de entregar o integrar cambios.

`test:links` permite temporalmente el único destino provisional
`/montse-pereda-cv.pdf`. Elimina esa excepción de
`scripts/check-internal-links.mjs` al añadir el PDF definitivo a `public/`.

`audit:lighthouse` sirve el build en `127.0.0.1:4321` y audita la portada, el
índice de Portafolio, `/portafolio/modulab-barcelona` y
`/portafolio/syra-coffee`. Guarda
informes JSON ignorados por Git en `.lighthouse/`. Usa `verify:launch` para una
revisión previa a publicación: reutiliza el `dist/` generado por `verify` para
no construir dos veces. `audit:lighthouse:dist` debe ejecutarse solo después de
generar un build reciente. Lighthouse no se ejecuta en cada push porque es más
lento y sensible al entorno local que la suite determinista de CI.

## Integridad editorial del contenido

`scripts/check-content-integrity.mjs` lee el frontmatter de Notas, Mediateca y
Portafolio y comprueba que no existan `archiveNumber` duplicados entre entradas
publicadas. También exige un `displayOrder` único para los proyectos publicados.
Los borradores pueden conservar identificadores provisionales, pero deben
normalizarse antes de cambiar `draft` a `false`; la siguiente ejecución de
`pnpm run test:content` impedirá publicar una colisión.

## Cobertura de navegador

`tests/e2e/site.spec.ts` comprueba:

- rutas principales, página 404 y detalles representativos a 1440 × 900 y
  390 × 844;
- respuesta correcta, un único `main`, un único H1 e idioma español;
- ausencia de imágenes visibles rotas, errores propios de consola y overflow
  horizontal; el ruido interno de iframes externos se excluye porque no pertenece
  al código del sitio;
- navegación por fragmento desde una ruta secundaria;
- estado de scroll compartido para la cabecera fija y el control para volver
  arriba, incluida la ausencia de saltos, el color de acento compartido y el
  movimiento reducido;
- entrada CSS del hero y revelado único mediante Intersection Observer para
  las tarjetas, sin ocultar el footer;
- menú móvil con teclado, cierre con Escape y restauración del foco;
- navegación pública limitada a Inicio y Portafolio, y enlaces actuales del
  footer;
- exclusión explícita de Yo, Notas y Mediateca del índice;
- tipografía compacta y wrapping seguro en detalles móviles;
- búsqueda, estado vacío y recuperación de Portafolio;
- correspondencia entre Registro y sitemap;
- deduplicación del grafo editorial y relaciones mutuas;
- enlaces entre casos desde URLs con slash final;
- estados inicial y final del carrusel, controles móviles y movimiento reducido.

`tests/e2e/accessibility.spec.ts` usa axe-core con reglas WCAG 2 A/AA y WCAG
2.1 A/AA en las rutas principales, detalles representativos y controles móviles
abiertos. Una prueba automática no puede validar toda la accesibilidad: el orden
de lectura, la calidad del texto alternativo, la comprensión, el contraste sobre
fotografías y el uso real con lectores de pantalla siguen necesitando revisión
manual.

## Límite editorial de producción

`scripts/verify-production.mjs` trata la lista de rutas publicadas como un
contrato explícito. Verifica 10 rutas públicas e indexables, los tres shells
ocultos (`/yo`, `/notas` y `/mediateca`), el redirect de `/biblioteca` y el
archivo `404.html`, además de los 6 proyectos publicados de Portafolio.

También impide que `ejemplo-mdx` o los números reservados `N.999`, `M.999` y
`P.999` aparezcan en `dist`. Cuando se apruebe una entrada nueva para
producción, hay que actualizar el contenido y este contrato en el mismo cambio.
El mismo script comprueba que cada ruta pública tenga `index, follow`,
canonical, Open Graph, tarjeta social y JSON-LD, y que `robots.txt` permita el
rastreo y el sitemap contenga exactamente el contrato previsto. Los tres
shells ocultos y la página 404 deben conservar `noindex, nofollow` aunque el
resto del build permita la indexación.

## Lighthouse

`scripts/run-lighthouse.mjs` aplica mínimos de 75 en rendimiento y 95 en
accesibilidad, buenas prácticas y SEO. La indexación ya está habilitada en el
build de producción, por lo que `is-crawlable` debe superar la auditoría; una
regresión de las directivas de robots vuelve a hacer fallar el lanzamiento.

Las rutas sin reproductores externos mantienen el mínimo 95 de buenas
prácticas. `/portafolio/syra-coffee` admite únicamente los fallos
`third-party-cookies` e `inspector-issues` producidos por la cookie `__cf_bm` de
Vimeo, con un mínimo específico de 75. El script compara los IDs exactos para
que una regresión propia o una nueva incidencia de terceros no quede oculta.

## Presupuestos de salida

`scripts/check-performance-budgets.mjs` aplica límites deliberadamente
conservadores sobre el build actual:

| Medida               |                           Límite |
| -------------------- | -------------------------------: |
| `dist` completo      |                           16 MiB |
| HTML total           | 18 KiB × número de archivos HTML |
| Un archivo HTML      |                           43 KiB |
| CSS total            |                           90 KiB |
| JavaScript emitido   |                           25 KiB |
| Fuentes totales      |                          240 KiB |
| Un archivo de imagen |                          500 KiB |

Estos límites detectan aumentos accidentales; no son objetivos de Lighthouse ni
equivalen al peso transferido de una página concreta. Si una decisión editorial
legítima necesita superarlos, primero hay que optimizar el recurso y después
ajustar el límite con una explicación en el cambio.

El límite agregado de HTML crece con el número de archivos generados: los 15
archivos HTML actuales permiten 270 KiB en total. El promedio de 18 KiB refleja
la concentración actual en seis casos de estudio largos. Los estilos se emiten
como archivos compartidos en lugar de repetirse dentro de cada documento; el
límite de 43 KiB por archivo sigue evitando que una página concreta crezca sin
control.

Astro agrupa el controlador compartido de filtros de Notas y Mediateca en un
módulo JavaScript pequeño; el resto de la interacción mínima puede permanecer
inline o producir módulos específicos durante el build. El presupuesto de
JavaScript emitido protege el total de esos archivos.

## Integración continua

`.github/workflows/quality.yml` ejecuta `pnpm run verify` en cada pull request y
en cada push a `main`, usando Node.js 22, pnpm 10.34.3 y Chromium. Si Playwright
falla, el workflow conserva durante siete días el informe, las capturas, vídeos
y trazas disponibles.
