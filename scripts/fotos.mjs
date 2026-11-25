// Baja fotos reales de las noticias y vistas de satélite reales del Bajo Cauca para el video y el flyer
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const n = JSON.parse(await readFile('data/noticias.json', 'utf8'));
await mkdir('promo/fotos', { recursive: true });
const lista = [];
for (const it of n.items.filter(i => i.imagen && !/infograf|grafic|logo|banner/i.test(i.imagen))) {
  if (lista.length >= 12) break;
  try {
    const r = await fetch(it.imagen, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) });
    const buf = Buffer.from(await r.arrayBuffer());
    const { data, info } = await sharp(buf).resize(64, 64, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let b = 0; for (let i = 0; i < data.length; i += 3) if (data[i] > 235 && data[i+1] > 235 && data[i+2] > 235) b++;
    const m = await sharp(buf).metadata();
    if (b / (info.width * info.height) > 0.18 || m.width < 700) continue;
    const f = `promo/fotos/foto${lista.length + 1}.jpg`;
    await sharp(buf).jpeg({ quality: 90 }).toFile(f);
    lista.push({ archivo: f, fuente: it.fuente, titulo: it.titulo, url: it.url, imagen: it.imagen });
  } catch (e) { console.log('falló', it.imagen, e.message); }
}
// Vistas de satélite reales (Esri World Imagery) de zonas mineras del río Nechí y el Cauca
const SAT = [
  ['sat-region', -75.45, 7.40, -74.65, 8.15, 1500, 1400],
  ['sat-elbagre', -74.86, 7.55, -74.74, 7.66, 1400, 1300],
  ['sat-zaragoza', -74.92, 7.44, -74.80, 7.55, 1400, 1300],
  ['sat-nechi', -74.83, 8.03, -74.71, 8.14, 1400, 1300],
  ['sat-caceres', -75.40, 7.53, -75.28, 7.64, 1400, 1300],
  ['sat-caucasia', -75.25, 7.93, -75.13, 8.04, 1400, 1300]
];
for (const [nom, x1, y1, x2, y2, w, h] of SAT) {
  try {
    const u = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${x1},${y1},${x2},${y2}&bboxSR=4326&imageSR=3857&size=${w},${h}&format=jpg&f=image`;
    const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
    await sharp(Buffer.from(await r.arrayBuffer())).jpeg({ quality: 92 }).toFile(`promo/fotos/${nom}.jpg`);
    lista.push({ archivo: `promo/fotos/${nom}.jpg`, fuente: 'Esri World Imagery (satélite)' });
  } catch (e) { console.log('sat falló', nom, e.message); }
}
await writeFile('promo/fotos/creditos.json', JSON.stringify(lista, null, 1));
console.log('fotos:', lista.length);
