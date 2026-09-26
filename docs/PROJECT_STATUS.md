# Estado del proyecto

Fuente de verdad sobre el estado actual del sitio de Montse Pereda Grillo.

## Resumen

- **Fecha de revisión:** 26 de septiembre de 2026.
- **Rama:** `main`.
- **Framework:** Astro 7, TypeScript estricto y salida HTML estática.
- **Idioma activo:** español.
- **Dominio previsto:** `www.montsepereda.com`.
- **Hosting previsto:** Nominalia mediante subida FTP; todavía no configurado ni
  verificado.
- **Alcance inmediato:** portada de Montse y Portafolio. Yo, Notas y Mediateca
  permanecen como shells ocultos para fases posteriores: no aparecen en la
  navegación, Registro ni sitemap y fuerzan `noindex, nofollow`.

## Experiencia actual

- Portada de una sola página con hero oscuro y el Portafolio completo debajo.
- Navegación visible limitada a `Inicio` y `Portafolio`.
- CTA `Descarga mi CV` dirigido al documento definitivo en
  `/montse-pereda-cv.pdf`.
- Título del hero separado en `heroTitle` y `heroTitleAccent`, para editar la
  parte Georgia cursiva sin tocar la plantilla.
- Descripción del hero como texto plano en `connectionLabel`; se eliminó
  `connectionLink` del contenido, schema, plantilla y CSS.
- El hero usa una entrada CSS escalonada basada en opacidad y desplazamiento
  vertical; el resto de textos, medios y tarjetas se revela una sola vez al
  entrar en el viewport. Los bloques del cuerpo de los casos se revelan de
  forma individual solo en expanded; en compact y medium permanecen visibles
  para que el contenido no dependa del observer. El footer queda siempre
  visible y todo el movimiento se desactiva con `prefers-reduced-motion`.
- Retrato de Montse en
  `src/assets/images/homepage/montse-pereda-portrait.png`.
- El antiguo índice de cuatro tarjetas y la sección final de acceso rápido no
  se renderizan en la portada actual.
- Portada y `/portafolio` comparten `PortfolioSection.astro` y la misma rejilla
  de tarjetas: 3 columnas en expanded, 2 en medium y 1 en compact.

## Portafolio

Producción muestra seis casos publicados:

- `cn-sant-andreu`
- `cats`
- `museu-lh`
- `syra-coffee`
- `eloquent`
- `modulab-barcelona`

Desarrollo añade dos casos provisionales, visibles únicamente para revisión:

- `uned-girona`
- `bcn-mes-artist-based-in-barna`

Ambos usan `draft: true` y `placeholder: true`, imágenes dummy locales y los
identificadores provisionales `P.009` y `P.010`. Antes de publicarlos hay que
confirmar fechas, estado, métricas y material gráfico definitivo.

La búsqueda, los filtros por etiqueta, el conteo y el estado vacío funcionan
con JavaScript ligero y sin framework cliente.

## Diseño y tipografía

- Fuente principal: Helvetica Neue → Helvetica → Arial → sans-serif.
- Énfasis editorial: Georgia → Times New Roman → serif, en cursiva.
- Escala fluida compartida `--text-h1` a `--text-h6`; H1 usa
  `clamp(2.75rem, 5.2vw, 5.75rem)`.
- Hero: fondo oscuro `#171b18`. El token compartido `--accent-color: #dff09a` se usa
  en el hero, la cabecera fija y el control para volver arriba.
- Imágenes y tarjetas sin desbordamiento horizontal en los breakpoints
  revisados.

## Verificación reciente

- `pnpm run build`: correcto; Astro check informa 69 archivos, 0 errores, 0
  avisos y 0 sugerencias.
- `pnpm run test`: correcto; pasan las 45 pruebas de navegador y accesibilidad,
  además de integridad editorial, rutas de producción, enlaces internos y
  presupuestos de salida.
- El CSS compartido se emite como archivos externos: el HTML total pesa 264,0
  KiB frente a un presupuesto de 270 KiB y el JavaScript emitido pesa 4,6 KiB.
- El contrato de producción verifica 10 rutas públicas indexables y 3 rutas
  ocultas con `noindex, nofollow`; Registro y sitemap contienen únicamente las
  rutas públicas.
- `git diff --check`: correcto en los últimos cambios de implementación.
- Revisión visual manual completada a 1440 px, 1024 px, 390 px y el viewport
  iPhone SE de 375 × 667 sobre portada, índice de Portafolio, un caso de estudio
  y el footer.
- Sin errores de consola, overlays, imágenes rotas ni overflow horizontal.
- La rejilla responde 3 → 2 → 1 columnas como se esperaba.

## Pendientes conocidos

- Recuperar el retrato circular solicitado: actualmente el contenedor usa
  `border-radius: 8px` y se ve como un cuadrado redondeado.
- Añadir el PDF final a `public/montse-pereda-cv.pdf` y comprobar su descarga.
- Revisar los metadatos, textos, enlaces y datos estructurados que todavía
  procedan de la implementación de referencia.
- Confirmar derechos y créditos de todas las imágenes y casos publicados.
- Desplegar `dist/` en Nominalia, conectar DNS y verificar HTTPS, redirects,
  canonical, sitemap, `robots.txt` y la respuesta 404 real.

## Comandos de trabajo

```sh
pnpm run dev --host 127.0.0.1 --port 8444
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
pnpm run build
pnpm run verify
```

Después de cambiar `src/content.config.ts`, reinicia el servidor de desarrollo
si Astro conserva una colección de contenido antigua.
