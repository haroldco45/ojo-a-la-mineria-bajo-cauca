// Robot de videos reales de YouTube para Ojo a la Minería · Bajo Cauca
import { readFile, writeFile } from 'node:fs/promises';

const ARCHIVO = 'data/videos.json';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const CONSULTAS = ['minería Bajo Cauca 2026', 'minería ilegal Bajo Cauca', 'minería ilegal El Bagre', 'minería Caucasia Antioquia', 'mina batallón Caucasia', 'distrito minero Bajo Cauca', 'formalización minera Bajo Cauca', 'mercurio río Nechí', 'Zaragoza Antioquia minería', 'Cáceres Antioquia minería', 'paro minero Bajo Cauca 2026'];
const MAX_DIAS = 365; // solo videos del último año

// Convierte "hace 3 a", "hace 8 m", "hace 2 sem", "3 years ago"... en días
function diasDesde(hace) {
  const t = (hace || '').toLowerCase().replace('transmitido', '');
  const m = t.match(/(\d+)\s*(min|h|d|sem|w|m|a|y)/);
  if (!m) return null;
  const n = +m[1], u = m[2];
  if (u === 'min' || u === 'h') return 0;
  if (u === 'd') return n;
  if (u === 'sem' || u === 'w') return n * 7;
  if (u === 'm') return n * 30; // meses
  return n * 365; // a, año, y, year
}
const RELEVANTE = /miner|oro\b|mercurio|draga|barequ|bajo cauca|el bagre|caucasia|zaragoza|nech[ií]/i;

function buscarRenderers(nodo, out) {
  if (!nodo || typeof nodo !== 'object') return;
  if (nodo.videoRenderer) out.push(nodo.videoRenderer);
  for (const v of Object.values(nodo)) buscarRenderers(v, out);
}

async function main() {
  let previo = { items: [] };
  try { previo = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}
  const ahora = Date.now();
  // Se botan los videos viejos que ya estaban guardados
  const mapa = new Map(previo.items.filter(v => v.publicado && ahora - new Date(v.publicado) < MAX_DIAS * 864e5).map(v => [v.id, v]));
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
        const dias = diasDesde(hace);
        if (dias === null || dias >= MAX_DIAS) continue;
        if (!mapa.has(v.videoId)) mapa.set(v.videoId, {
          publicado: new Date(ahora - dias * 864e5).toISOString(),
          id: v.videoId, titulo,
          canal: v.ownerText?.runs?.[0]?.text || '',
          hace, duracion: v.lengthText?.simpleText || '',
          visto: new Date().toISOString()
        });
      }
    } catch (e) { console.log('fallo', q, e.message); }
  }
  const items = [...mapa.values()].sort((a, b) => new Date(b.publicado) - new Date(a.publicado)).slice(0, 30);
  await writeFile(ARCHIVO, JSON.stringify({ actualizado: new Date().toISOString(), items }, null, 1));
  console.log('videos:', items.length);
}
main().catch(e => { console.error(e); process.exit(1); });
