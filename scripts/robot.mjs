// Robot de noticias de Ojo a la Minería · Bajo Cauca — Vibras Positivas HM
// Corre en GitHub Actions cada 30 minutos. Node 22, sin dependencias obligatorias.
import { readFile, writeFile } from 'node:fs/promises';

const ARCHIVO = 'data/noticias.json';
const MAX_ITEMS = 250;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const CONSULTAS = [
  'minería "Bajo Cauca"',
  'minería Caucasia',
  'minería "El Bagre"',
  'minería Zaragoza Antioquia',
  'minería Cáceres Antioquia',
  'minería Nechí',
  'minería Tarazá',
  'minería ilegal Antioquia',
  'mercurio río Nechí',
  'mercurio río Cauca Antioquia',
  '"Mineros S.A." El Bagre',
  'La Mandinga Cáceres mina',
  'Agencia Nacional de Minería Antioquia',
  'Secretaría de Minas Antioquia',
  'títulos mineros Antioquia',
  'dragas Bajo Cauca'
];

const MINERO = /miner|minas?\b|oro\b|mercurio|draga|barequ|aluvi|t[ií]tulo|catastro|ANM\b/i;
const ZONA = /bajo cauca|caucasia|c[aá]ceres|el bagre|zaragoza|nech[ií]|taraz[aá]|antioqu|mandinga|segovia|remedios|buritic[aá]/i;
const RELEVANTE = { test: t => MINERO.test(t) && ZONA.test(t) };

function limpiar(t = '') {
  return t
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ').trim();
}

function tag(xml, nombre) {
  const m = xml.match(new RegExp(`<${nombre}[^>]*>([\\s\\S]*?)</${nombre}>`, 'i'));
  return m ? limpiar(m[1]) : '';
}

async function traer(url, ms = 15000) {
  const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'es-CO,es;q=0.9' }, signal: AbortSignal.timeout(ms), redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

function parsearRSS(xml, origen) {
  const out = [];
  for (const bloque of xml.split(/<item>/i).slice(1)) {
    let titulo = tag(bloque, 'title');
    let url = tag(bloque, 'link');
    let fuente = tag(bloque, 'source') || '';
    const fecha = tag(bloque, 'pubDate');
    if (origen === 'bing') {
      try { const u = new URL(url); url = u.searchParams.get('url') || url; } catch {}
      fuente = fuente || tag(bloque, 'News:Source');
    }
    if (origen === 'google' && / - [^-]+$/.test(titulo)) {
      const i = titulo.lastIndexOf(' - ');
      if (!fuente) fuente = titulo.slice(i + 3);
      titulo = titulo.slice(0, i);
    }
    if (!titulo || !url) continue;
    const d = new Date(fecha);
    out.push({ titulo, url, fuente: fuente || new URL(url).hostname.replace(/^www\./, ''), fecha: isNaN(d) ? new Date().toISOString() : d.toISOString(), imagen: '' });
  }
  return out;
}

async function buscar(q) {
  const res = [];
  const g = `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:30d')}&hl=es-419&gl=CO&ceid=CO:es-419`;
  const b = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=es-CO&cc=CO&qft=sortbydate%3d%221%22`;
  for (const [u, o] of [[g, 'google'], [b, 'bing']]) {
    try { res.push(...parsearRSS(await (await traer(u)).text(), o)); }
    catch (e) { console.log('fallo', o, q, e.message); }
  }
  return res;
}

async function resolverGoogle(url) {
  if (!/news\.google\.com/.test(url)) return url;
  try { const r = await traer(url, 10000); return r.url || url; } catch { return url; }
}

async function ogImagen(url) {
  try {
    const r = await traer(url, 12000);
    const html = (await r.text()).slice(0, 400000);
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::src)?["'][^>]*content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    if (!m) return { img: '', final: r.url };
    return { img: new URL(m[1].replace(/&amp;/g, '&'), r.url).href, final: r.url };
  } catch { return { img: '', final: url }; }
}

const clave = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90);

async function main() {
  let previo = { items: [] };
  try { previo = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}
  const mapa = new Map(previo.items.map(i => [clave(i.titulo), i]));

  const nuevos = [];
  for (const q of CONSULTAS) {
    for (const it of await buscar(q)) {
      if (!RELEVANTE.test(it.titulo)) continue;
      const k = clave(it.titulo);
      if (mapa.has(k)) continue;
      mapa.set(k, it); nuevos.push(it);
    }
  }
  console.log('nuevas noticias:', nuevos.length);

  // Fotos reales: og:image de cada nota (las que aún no tienen)
  const sinFoto = [...mapa.values()].filter(i => !i.imagen && !i._intentado).slice(0, 45);
  let hechos = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (sinFoto.length) {
      const it = sinFoto.shift();
      it.url = await resolverGoogle(it.url);
      const { img, final } = await ogImagen(it.url);
      if (final && !/news\.google\.com/.test(final)) it.url = final;
      if (img && !/googleusercontent|gstatic|logo|favicon/i.test(img)) { it.imagen = img; hechos++; }
      else it._intentado = true;
    }
  }));
  console.log('fotos nuevas:', hechos);

  const items = [...mapa.values()]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, MAX_ITEMS);

  await writeFile(ARCHIVO, JSON.stringify({ actualizado: new Date().toISOString(), items }, null, 1));
  await portada(items);
}

// Una foto real tiene pocos píxeles blancos planos; las infografías y tablas tienen muchos
async function esFoto(sharp, buf) {
  const { data, info } = await sharp(buf).resize(64, 64, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let blancos = 0, total = info.width * info.height;
  for (let i = 0; i < data.length; i += 3) if (data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) blancos++;
  const { width, height } = await sharp(buf).metadata();
  return blancos / total < 0.18 && width >= 500 && height >= 280;
}

// Imagen de vista previa (la que sale al compartir el enlace) con foto real
async function portada(items) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { console.log('sin sharp, no se rehace portada'); return; }
  let meta = {};
  try { meta = JSON.parse(await readFile('data/portada.json', 'utf8')); } catch {}
  const candidatas = items.filter(i => i.imagen && !/infograf|grafic|logo|banner/i.test(i.imagen)).slice(0, 12);
  for (const c of candidatas) {
    if (meta.imagen === c.imagen) return; // ya está al día
    try {
      const buf = Buffer.from(await (await traer(c.imagen, 15000)).arrayBuffer());
      if (!(await esFoto(sharp, buf))) { console.log('descarto (parece gráfico):', c.imagen); continue; }
      const base = sharp(buf).resize(1200, 630, { fit: 'cover', position: 'attention' });
      const capa = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.25" stop-color="#0d1310" stop-opacity="0.05"/><stop offset="1" stop-color="#0d1310" stop-opacity="0.95"/></linearGradient></defs>
        <rect width="1200" height="630" fill="url(#g)"/>
        <rect x="60" y="440" width="12" height="130" fill="#f5b700"/>
        <text x="96" y="500" font-family="DejaVu Sans, Arial" font-weight="700" font-size="58" fill="#ffffff">Ojo a la Minería · Bajo Cauca</text>
        <text x="96" y="556" font-family="DejaVu Sans, Arial" font-size="30" fill="#ffd34d">¿Quién se queda con el oro y quién con el agua?</text>
        <text x="1140" y="600" text-anchor="end" font-family="DejaVu Sans, Arial" font-size="22" fill="#cfd6e6">Vibras Positivas HM</text>
      </svg>`);
      await base.composite([{ input: capa }]).jpeg({ quality: 84 }).toFile('portada.jpg');
      await writeFile('data/portada.json', JSON.stringify({ imagen: c.imagen, fuente: c.fuente, url: c.url, fecha: new Date().toISOString() }, null, 1));
      console.log('portada nueva desde', c.fuente);
      return;
    } catch (e) { console.log('portada falló con', c.imagen, e.message); }
  }
  if (!meta.imagen) await portadaSatelite(sharp);
}

// Si todavía no hay foto de noticia: imagen de satélite real del Bajo Cauca
async function portadaSatelite(sharp) {
  const SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-75.45,7.45,-74.70,8.05&bboxSR=4326&imageSR=3857&size=1200,630&format=jpg&f=image';
  try {
    const buf = Buffer.from(await (await traer(SAT, 20000)).arrayBuffer());
    const capa = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.2" stop-color="#0d1310" stop-opacity="0.1"/><stop offset="1" stop-color="#0d1310" stop-opacity="0.95"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/><rect x="60" y="440" width="12" height="130" fill="#f5b700"/>
      <text x="96" y="500" font-family="DejaVu Sans, Arial" font-weight="700" font-size="58" fill="#ffffff">Ojo a la Minería · Bajo Cauca</text>
      <text x="96" y="556" font-family="DejaVu Sans, Arial" font-size="30" fill="#ffd34d">¿Quién se queda con el oro y quién con el agua?</text>
      <text x="1140" y="600" text-anchor="end" font-family="DejaVu Sans, Arial" font-size="22" fill="#cfd6e6">Vibras Positivas HM</text></svg>`);
    await sharp(buf).resize(1200, 630, { fit: 'cover' }).composite([{ input: capa }]).jpeg({ quality: 84 }).toFile('portada.jpg');
    console.log('portada satelital lista');
  } catch (e) { console.log('portada satelital falló', e.message); }
}

main().catch(e => { console.error(e); process.exit(1); });
