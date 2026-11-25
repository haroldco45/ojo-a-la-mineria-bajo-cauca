// Robot de videos reales de YouTube para Ojo a la Minería · Bajo Cauca
import { readFile, writeFile } from 'node:fs/promises';

const ARCHIVO = 'data/videos.json';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const CONSULTAS = ['minería Bajo Cauca', 'minería ilegal El Bagre', 'minería Caucasia Antioquia', 'mercurio río Nechí', 'Zaragoza Antioquia minería', 'paro minero Bajo Cauca'];
const RELEVANTE = /miner|oro\b|mercurio|draga|barequ|bajo cauca|el bagre|caucasia|zaragoza|nech[ií]/i;

function buscarRenderers(nodo, out) {
  if (!nodo || typeof nodo !== 'object') return;
  if (nodo.videoRenderer) out.push(nodo.videoRenderer);
  for (const v of Object.values(nodo)) buscarRenderers(v, out);
}

async function main() {
  let previo = { items: [] };
  try { previo = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}
  const mapa = new Map(previo.items.map(v => [v.id, v]));
  for (const q of CONSULTAS) {
    try {
      const r = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=CAI%253D`, { headers: { 'user-agent': UA, 'accept-language': 'es-CO,es;q=0.9' }, signal: AbortSignal.timeout(15000) });
      const html = await r.text();
      const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
      if (!m) { console.log('sin ytInitialData', q); continue; }
      const lista = []; buscarRenderers(JSON.parse(m[1]), lista);
      for (const v of lista) {
        const titulo = v.title?.runs?.map(x => x.text).join('') || '';
        if (!v.videoId || !RELEVANTE.test(titulo)) continue;
        const hace = v.publishedTimeText?.simpleText || '';
        if (/(\d+)\s*(año|year)/i.test(hace) && !/1 (año|year)/i.test(hace)) continue;
        if (!mapa.has(v.videoId)) mapa.set(v.videoId, {
          id: v.videoId, titulo,
          canal: v.ownerText?.runs?.[0]?.text || '',
          hace, duracion: v.lengthText?.simpleText || '',
          visto: new Date().toISOString()
        });
      }
    } catch (e) { console.log('fallo', q, e.message); }
  }
  const items = [...mapa.values()].sort((a, b) => new Date(b.visto) - new Date(a.visto)).slice(0, 30);
  await writeFile(ARCHIVO, JSON.stringify({ actualizado: new Date().toISOString(), items }, null, 1));
  console.log('videos:', items.length);
}
main().catch(e => { console.error(e); process.exit(1); });
