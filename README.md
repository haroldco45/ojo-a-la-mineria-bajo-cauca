# Ojo a la Minería · Bajo Cauca

App ciudadana (PWA) de **Vibras Positivas HM** para hacerle seguimiento a la minería en Caucasia, Cáceres, El Bagre, Zaragoza, Nechí y Tarazá: títulos, solicitudes, minería ilegal, mercurio y un derecho de petición a todas las entidades a la vez.

- `data/mineria.json` — cifras, municipios, casos, línea de tiempo y autoridades (se edita a mano, siempre con fuente).
- `data/noticias.json`, `data/videos.json` — los llena el robot.
- `.github/workflows/robot.yml` — robot cada 30 min: noticias, fotos reales (og:image), videos de YouTube y la imagen de vista previa `portada.jpg`.
- Mapa con imagen de satélite real (Esri World Imagery).
- Datos de expedientes por departamento: atlas «Colombia en venta» de @efren.fotograma (colombiaenventa.v1tr0.com).

Publicada en Netlify: https://ojo-a-la-mineria-bajo-cauca.netlify.app
