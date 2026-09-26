# Lista de preparación para lanzamiento

Estas tareas siguen pendientes antes de presentar el jardín como una
publicación terminada. La indexación técnica se habilitó por autorización
explícita el 30 de agosto de 2026; esa decisión no sustituye las revisiones
editoriales, de hosting y de accesibilidad enumeradas aquí.

La revisión editorial consolidada prevista como Fase 5 se ha pospuesto por
decisión del responsable del proyecto. Esto no aprueba automáticamente ninguna
de las tareas editoriales siguientes: permanecen abiertas hasta que se revisen
de forma explícita.

## Edición

- [x] Aprobar la biografía y la trayectoria de Yo.
- [x] Integrar el párrafo personal aprobado y retirar su aviso editorial.
- [x] Retirar las etiquetas de casos pendientes que no publican un enlace.
- [ ] Revisar y aprobar los resúmenes y cuerpos de las cinco Notas locales
      publicadas: `el-magnifico-mundo-de-los-jardines-digitales`,
      `metodos-para-descubrir-el-problema`,
      `mis-lugares-favoritos-de-internet`, `scrum` y
      `zettelkasten-un-metodo-para-organizar-nuestro-conocimiento`.
- [ ] Confirmar la revisión editorial final de las quince referencias de
      Mediateca incluidas en producción.
- [ ] Retirar los avisos de copia provisional cuando el contenido correspondiente
      esté aprobado.
- [ ] Revisar y aprobar los siete casos de Portafolio que entran en producción:
      `syra-coffee`, `bsc`, `minka-icm`, `cn-sant-andreu`,
      `modulab-barcelona`, `eloquent` y `elespacio`.
- [ ] Confirmar en cada caso publicado el periodo, rol, organización, resultados,
      derechos, créditos, enlaces, alternativas y leyendas.
- [ ] Confirmar periodo, estado y métricas de `uned-girona`; sustituir sus tres
      imágenes dummy antes de retirar `draft` y `placeholder`.
- [ ] Confirmar periodo y estado de `bcn-mes-artist-based-in-barna`; sustituir sus
      tres imágenes dummy antes de retirar `draft` y `placeholder`.
- [ ] Mantener los ocho placeholders restantes de Portafolio como drafts hasta
      sustituir todo el contenido pendiente.
- [ ] Normalizar `archiveNumber` y `displayOrder` antes de publicar cualquiera
      de esos placeholders.
- [ ] Aprobar o reemplazar cada URL externa provisional antes de publicar su
      entrada.
- [ ] Confirmar que cada referencia aprobada usa `editorialState: revisado` y
      que ningún aviso provisional se ha retirado antes de la aprobación.

## Imágenes y contenido enriquecido

- [ ] Confirmar derechos, procedencia y aprobación de cada imagen editorial,
      portada y galería.
- [ ] Revisar que toda imagen significativa tenga texto alternativo útil y que
      las leyendas no dupliquen información innecesariamente.
- [ ] Mantener activos locales en las carpetas por colección y evitar imágenes
      remotas no controladas.
- [ ] Verificar los cuerpos `.rich-content` de Notas, Portafolio y Mediateca en
      escritorio y móvil, incluidos tablas, notas al pie, citas y enlaces.

## Idiomas y metadatos

- [ ] Confirmar el alcance editorial de la primera versión en español.
- [ ] Preparar la versión inglesa antes de activar cualquier ruta de traducción.
- [x] Implementar títulos, descripciones, URLs canónicas, JSON-LD, sitemap y
      metadatos sociales en el build.
- [ ] Revisar manualmente títulos, descripciones, imágenes y previews sociales
      con el contenido editorial definitivo.
- [x] Mantener `noindex` y el bloqueo de `robots.txt` por defecto hasta la
      aprobación final.
- [x] Habilitar `index, follow` y `Allow: /` en builds de producción tras la
      autorización explícita del 30 de agosto de 2026.
- [ ] Verificar las directivas de indexación en el dominio público.

## Vídeo, MDX y código

- [ ] Confirmar que cada vídeo aprobado de YouTube o Vimeo sigue disponible y
      permite reproducción embebida.
- [ ] Verificar que cada iframe tiene un `title` accesible, específico y acorde
      con el contenido real.
- [ ] Revisar captions editoriales y enlaces de respaldo hacia la página
      canónica de cada vídeo.
- [ ] Confirmar el uso de `youtube-nocookie.com` para YouTube y `dnt=1` para
      Vimeo.
- [ ] Configurar en el hosting la política CSP necesaria para los reproductores
      externos y revisar sus requisitos de medios, privacidad y terceros.
- [ ] Evaluar el comportamiento final de cookies y el contexto legal aplicable
      antes de decidir si hace falta un mecanismo de consentimiento.
- [ ] Confirmar que ninguna entrada con `fixture: true`, incluidos su HTML,
      metadatos, imágenes técnicas, IDs de vídeo y muestras, aparece en
      producción.
- [ ] Confirmar que ningún proyecto publicado contiene etiquetas, captions,
      vídeos o imágenes descritos como pruebas técnicas aunque no use
      `fixture: true`.
- [ ] Rechazar componentes que acepten iframes arbitrarios o scripts pegados;
      cada futuro proveedor necesita un componente revisado y permitido.
- [ ] Comprobar en móvil que las líneas largas de los bloques de código se
      desplazan dentro del bloque sin desbordar la página.

## Rutas, hosting y dominio

- [ ] Configurar el hosting contratado en Nominalia y documentar el acceso FTP.
- [ ] Configurar redirects permanentes de `/biblioteca` a `/mediateca` y de
      `/biblioteca/*` a `/mediateca/*` en el hosting.
- [x] Mantener un único redirect dinámico para `/biblioteca/[slug]`, sin
      solapamientos en el build.
- [x] Generar una página `404.html` propia, accesible y siempre no indexable.
- [ ] Verificar rutas directas, fragments y páginas de error en el entorno
      desplegado.
- [ ] Conectar `www.montsepereda.com` y verificar DNS, HTTPS y redirección
      del dominio raíz si se utiliza.
- [ ] Ejecutar la comprobación, la compilación y la revisión responsive final.
- [ ] Ejecutar `pnpm run verify:launch` y conservar los resultados finales en la
      revisión de lanzamiento.
- [ ] Verificar canonical, JSON-LD, sitemap, `robots.txt` y tarjetas sociales en
      el dominio público.
- [ ] Configurar y comprobar HTTPS, cabeceras de seguridad y que el proveedor
      sirva `404.html` con estado HTTP 404.

## Higiene del repositorio

- [x] Excluir archivos `.DS_Store` del repositorio.
- [ ] Retirar recursos duplicados o sin uso después de confirmar cuál es la
      copia canónica de cada imagen.
- [x] Documentar y automatizar el alcance mínimo de pruebas y Lighthouse antes
      del lanzamiento.
