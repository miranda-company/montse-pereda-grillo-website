# Documentación

Esta carpeta reúne la documentación editorial y técnica activa del proyecto.
Las capturas históricas de diseño ya no se conservan aquí; los checkpoints
anteriores siguen disponibles en el historial y las etiquetas de Git.

## Por dónde empezar

- [Estado del proyecto](PROJECT_STATUS.md) — qué existe, qué se publica y qué
  falta antes del lanzamiento.
- [Modelo de contenido](CONTENT_MODEL.md) — colecciones, campos compartidos y
  límites entre desarrollo y producción.
- [Lista de lanzamiento](LAUNCH_CHECKLIST.md) — revisión editorial, técnica y de
  hosting que sigue pendiente tras habilitar la indexación.
- [Preparación técnica para lanzamiento](LAUNCH_READINESS.md) — metadatos,
  sitemap, indexación, redirects y auditoría Lighthouse.

## Crear y editar contenido

- [Escribir Notas](WRITING_NOTES.md), incluidas tarjetas para artículos externos
- [Escribir referencias de Mediateca](WRITING_MEDIATECA.md)
- [Guía completa de proyectos de Portafolio](PORTFOLIO_PROJECT_GUIDE.md)
- [Referencia breve para escribir Portafolio](WRITING_PORTFOLIO.md)
- [Plantillas](templates/) para nuevas entradas Markdown y MDX

La guía de Portafolio contiene la referencia completa de metadatos y el mapa de
archivos técnicos. Las guías de escritura se concentran en el flujo editorial y
en el uso de imágenes, carruseles, vídeo y código.

## Mantener la implementación

- [Arquitectura](ARCHITECTURE.md) — estructura de páginas, colecciones, rutas y
  componentes compartidos.
- [Sistema tipográfico](TYPOGRAPHY_SYSTEM.md) — fuentes, escala semántica y
  reglas para H1–H6 y texto editorial.
- [Verificación y calidad](QUALITY_ASSURANCE.md) — pruebas de navegador,
  accesibilidad, límites de producción, presupuestos y CI.
- [Preparación técnica para lanzamiento](LAUNCH_READINESS.md) — configuración
  segura del dominio, indexación y hosting.

## Qué documento usar

| Necesidad                                  | Documento                                                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Conocer el estado actual                   | `PROJECT_STATUS.md`                                                                                  |
| Crear una Nota                             | `WRITING_NOTES.md`                                                                                   |
| Crear una referencia                       | `WRITING_MEDIATECA.md`                                                                               |
| Crear o modificar un proyecto              | `PORTFOLIO_PROJECT_GUIDE.md`                                                                         |
| Limpiar relaciones tras borrar o renombrar | [Procedimiento compartido](CONTENT_MODEL.md#cleaning-connections-after-renaming-or-deleting-content) |
| Consultar todos los campos de contenido    | `CONTENT_MODEL.md`                                                                                   |
| Cambiar layouts o componentes compartidos  | `ARCHITECTURE.md`                                                                                    |
| Cambiar tipografía                         | `TYPOGRAPHY_SYSTEM.md`                                                                               |
| Ejecutar o mantener pruebas                | `QUALITY_ASSURANCE.md`                                                                               |
| Entender la infraestructura de publicación | `LAUNCH_READINESS.md`                                                                                |
| Aprobar publicación o dominio              | `LAUNCH_CHECKLIST.md`                                                                                |

`src/content.config.ts` es la fuente de verdad para la validación. Si una guía y
el schema no coinciden, debe corregirse la documentación antes de publicar.
