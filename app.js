/* Ojo a la Minería · Bajo Cauca — Vibras Positivas HM */
'use strict';
const URL_APP = 'https://ojo-a-la-mineria-bajo-cauca.netlify.app/';
const TZ = 'America/Bogota';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = n => Number(n).toLocaleString('es-CO');

/* Imagen de satélite real (Esri World Imagery) alrededor de un punto */
const sat = (lat, lng, d = 0.035, w = 900, h = 520) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${lng - d * 1.6},${lat - d},${lng + d * 1.6},${lat + d}&bboxSR=4326&imageSR=3857&size=${w},${h}&format=jpg&f=image`;

/* ---------- Idioma ---------- */
const T = {
  es: {
    nav_hoy:'Hoy', nav_mapa:'Mapa', nav_casos:'Casos', nav_videos:'Videos', nav_peticion:'Petición', actualizar:'Actualizar',
    hero_pildora:'Bajo Cauca antioqueño · seguimiento ciudadano',
    hero_titulo:'¿Quién se queda con el oro y quién con el agua?',
    hero_sub:'Caucasia, Cáceres, El Bagre, Zaragoza, Nechí y Tarazá. Seguimos cada título, cada solicitud y cada daño de la minería en nuestra tierra, con la fuente al lado.',
    hero_pie:'Fondo: imagen de satélite real del Bajo Cauca y fotos de las noticias del día.',
    hoy_t:'Hoy', hoy_i:'Lo último sobre minería en el Bajo Cauca y Antioquia. Se actualiza cada vez que usted entra y el robot trae noticias nuevas cada 30 minutos.',
    buscar_ph:'Buscar en vivo: El Bagre, mercurio, Mineros, La Mandinga…', buscar:'Buscar',
    ma_t:'El mapa de nuestra tierra', ma_i:'Imagen de satélite real del Bajo Cauca. Cada círculo es un municipio y su tamaño es el número de títulos mineros. Toque un círculo para ver el detalle.',
    titulos:'títulos mineros', ver_noticias:'Ver noticias de {m}',
    ca_t:'Los casos que vigilamos', ca_noticias:'{n} noticias recientes',
    est_abierto:'Caso abierto', est_decidido:'Ya decidido', est_vigilancia:'En vigilancia', fuente:'Fuente',
    pa_t:'Antioquia frente al resto del país', pa_i:'Expedientes mineros (títulos más solicitudes) por departamento. Antioquia tiene más que Tolima, Chocó y Nariño juntos.',
    cr_t:'Datos de «Colombia en venta»', cr_btn:'Ver el atlas completo',
    li_t:'Cómo llegamos hasta aquí',
    qu_t:'¿Quién responde?', qu_i:'Estas son las entidades que deciden y vigilan la minería en el Bajo Cauca. A todas les llega la petición de abajo.',
    vi_t:'Videos reales', vi_i:'Reportajes y noticias en video sobre la minería en el Bajo Cauca. El robot busca videos nuevos cada 30 minutos.',
    pr_t:'Lo que queremos saber',
    pe_t:'Derecho de petición: que nos cuenten qué está pasando',
    pe_i:'Llene sus datos y envíe una sola petición a todas las entidades a la vez. La ley les da 15 días hábiles para responder (artículo 23 de la Constitución y Ley 1755 de 2015). Si una entidad no es la competente, debe pasarla a la que sí.',
    pe_nombre:'Nombre completo', pe_cc:'Cédula', pe_ciudad:'Ciudad', pe_correo:'Su correo para la respuesta', pe_tel:'Celular (opcional)', pe_muni:'Municipio que más le preocupa', todos_muni:'Todo el Bajo Cauca',
    pe_dest:'Se envía a', pe_enviar:'Enviar a todas las entidades', pe_gmail:'Abrir en Gmail', pe_copiar:'Copiar texto',
    pe_nota:'La app no guarda sus datos: el correo sale desde su propia cuenta. Revise los correos de las entidades antes de enviar; pueden cambiar.',
    fu_t:'Todas las noticias', ver_mas:'Ver más',
    pie_txt:'App ciudadana independiente. No es del Gobierno ni de ninguna empresa minera. Los datos vienen de entidades oficiales y medios, siempre con su fuente. Gracias a @efren.fotograma por el atlas «Colombia en venta».',
    compartir:'Compartir por WhatsApp',
    hoy_ultimas:'Hoy no hay notas nuevas todavía. Estas son las últimas:', robot:'Robot: última búsqueda {h} (hora Colombia)',
    busc_cargando:'Buscando en vivo en los medios…', busc_ok:'{n} noticias en vivo encontradas', busc_nada:'La búsqueda en vivo no respondió. Mostramos lo que trajo el robot.',
    sin_noticias:'El robot está trayendo las primeras noticias. Toque «Actualizar» en un momento.',
    nueva:'NUEVA', hace_min:'hace {n} min', hace_h:'hace {n} h', hace_d:'hace {n} d',
    sin_videos:'El robot todavía no trae videos. Se llenan solos en la próxima búsqueda.', buscar_yt:'Ver videos en YouTube',
    copiado:'Texto copiado',
    compartir_txt:'¿Quién se queda con el oro del Bajo Cauca y quién con el agua? Seguimiento ciudadano a la minería en Caucasia y la región, con noticias que se actualizan solas:'
  },
  en: {
    nav_hoy:'Today', nav_mapa:'Map', nav_casos:'Cases', nav_videos:'Videos', nav_peticion:'Petition', actualizar:'Refresh',
    hero_pildora:'Bajo Cauca, Antioquia · citizen watch',
    hero_titulo:'Who keeps the gold, and who keeps the water?',
    hero_sub:'Caucasia, Cáceres, El Bagre, Zaragoza, Nechí and Tarazá. We track every title, every application and every harm from mining in our land, with the source next to it.',
    hero_pie:'Background: real satellite image of Bajo Cauca and photos from today\'s news.',
    hoy_t:'Today', hoy_i:'The latest on mining in Bajo Cauca and Antioquia. It refreshes every time you open the app, and the robot brings new stories every 30 minutes.',
    buscar_ph:'Live search: El Bagre, mercury, Mineros, La Mandinga…', buscar:'Search',
    ma_t:'The map of our land', ma_i:'Real satellite image of Bajo Cauca. Each circle is a town, sized by its number of mining titles. Tap a circle for details.',
    titulos:'mining titles', ver_noticias:'See news about {m}',
    ca_t:'Cases we are watching', ca_noticias:'{n} recent stories',
    est_abierto:'Open case', est_decidido:'Decided', est_vigilancia:'Under watch', fuente:'Source',
    pa_t:'Antioquia vs. the rest of the country', pa_i:'Mining files (titles plus applications) per department. Antioquia has more than Tolima, Chocó and Nariño combined.',
    cr_t:'Data from "Colombia en venta"', cr_btn:'See the full atlas',
    li_t:'How we got here',
    qu_t:'Who answers?', qu_i:'These are the agencies that decide on and oversee mining in Bajo Cauca. All of them get the petition below.',
    vi_t:'Real videos', vi_i:'Video reports and news on mining in Bajo Cauca. The robot looks for new videos every 30 minutes.',
    pr_t:'What we want to know',
    pe_t:'Right of petition: tell us what is going on',
    pe_i:'Fill in your details and send one petition to every agency at once. By law they have 15 business days to answer (Article 23 of the Constitution, Law 1755 of 2015). If an agency is not competent, it must forward it.',
    pe_nombre:'Full name', pe_cc:'ID number (cédula)', pe_ciudad:'City', pe_correo:'Your email for the reply', pe_tel:'Mobile (optional)', pe_muni:'Town you care most about', todos_muni:'All of Bajo Cauca',
    pe_dest:'Sent to', pe_enviar:'Send to all agencies', pe_gmail:'Open in Gmail', pe_copiar:'Copy text',
    pe_nota:'The app does not store your data: the email goes out from your own account. Check the agency addresses before sending; they may change. The petition itself is in Spanish, as Colombian agencies require.',
    fu_t:'All news', ver_mas:'Show more',
    pie_txt:'Independent citizen app. Not affiliated with the government or any mining company. Data comes from official agencies and media, always with its source. Thanks to @efren.fotograma for the "Colombia en venta" atlas.',
    compartir:'Share on WhatsApp',
    hoy_ultimas:'No new stories today yet. Here are the latest:', robot:'Robot: last search {h} (Colombia time)',
    busc_cargando:'Searching live across the media…', busc_ok:'{n} live stories found', busc_nada:'Live search did not respond. Showing what the robot found.',
    sin_noticias:'The robot is fetching the first stories. Tap "Refresh" in a moment.',
    nueva:'NEW', hace_min:'{n} min ago', hace_h:'{n} h ago', hace_d:'{n} d ago',
    sin_videos:'The robot has not brought videos yet. They fill in on the next search.', buscar_yt:'See videos on YouTube',
    copiado:'Text copied',
    compartir_txt:'Who keeps Bajo Cauca\'s gold, and who keeps the water? Citizen tracking of mining in Caucasia and the region, with auto-updating news:'
  }
};
let LANG = 'es';
try { LANG = localStorage.getItem('om_lang') || (navigator.language || 'es').slice(0, 2); } catch {}
if (!T[LANG]) LANG = 'es';
const t = (k, v = {}) => (T[LANG][k] ?? T.es[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
const Tx = (o, es = 'es', en = 'en') => (LANG === 'en' && o[en]) ? o[en] : o[es];

function aplicarIdioma() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('#btnLang').textContent = LANG === 'es' ? 'EN' : 'ES';
}

/* ---------- Fechas en hora de Colombia ---------- */
const fmtDia = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const diaCO = d => fmtDia.format(new Date(d));
const hoyCO = () => diaCO(Date.now());
function fechaLarga(d, conHora) {
  return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-US', { timeZone: TZ, day: 'numeric', month: 'short', year: conHora ? undefined : 'numeric', hour: conHora ? 'numeric' : undefined, minute: conHora ? '2-digit' : undefined }).format(new Date(d));
}
const fechaCorta = f => new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-US', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(f + 'T12:00:00Z'));
function hace(d) {
  const m = Math.max(1, Math.round((Date.now() - new Date(d)) / 60000));
  if (m < 60) return t('hace_min', { n: m });
  if (m < 1440) return t('hace_h', { n: Math.round(m / 60) });
  return t('hace_d', { n: Math.round(m / 1440) });
}

/* ---------- Datos ---------- */
let D = { m: null, noticias: { items: [] }, videos: { items: [] } };
let enVivo = [];
async function cargarJSON(ruta) {
  const r = await fetch(`${ruta}?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(ruta);
  return r.json();
}
async function cargarTodo() {
  const [a, n, v] = await Promise.allSettled([cargarJSON('data/mineria.json'), cargarJSON('data/noticias.json'), cargarJSON('data/videos.json')]);
  if (a.status === 'fulfilled') D.m = a.value;
  if (n.status === 'fulfilled') D.noticias = n.value;
  if (v.status === 'fulfilled') D.videos = v.value;
}

/* ---------- Búsqueda en vivo (Google News + Bing por proxies) ---------- */
const MINERO = /miner|minas?\b|oro\b|mercurio|draga|barequ|aluvi|t[ií]tulo|catastro|ANM|Mineros\b/i;
const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
];
async function traerProxy(u) {
  for (const p of PROXIES) {
    try {
      const r = await fetch(p(u), { signal: AbortSignal.timeout(9000) });
      if (r.ok) { const txt = await r.text(); if (txt.includes('<item')) return txt; }
    } catch {}
  }
  throw new Error('proxies');
}
function parsearRSS(xml, bing) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  return [...doc.querySelectorAll('item')].map(it => {
    let titulo = it.querySelector('title')?.textContent?.trim() || '';
    let url = it.querySelector('link')?.textContent?.trim() || '';
    let fuente = it.querySelector('source')?.textContent?.trim() || '';
    if (bing) { try { url = new URL(url).searchParams.get('url') || url; } catch {} }
    else if (titulo.includes(' - ')) { const i = titulo.lastIndexOf(' - '); fuente = fuente || titulo.slice(i + 3); titulo = titulo.slice(0, i); }
    const f = new Date(it.querySelector('pubDate')?.textContent || Date.now());
    let foto = '';
    const media = [...it.getElementsByTagName('*')].find(e => /content|thumbnail|Image/i.test(e.localName) && (e.getAttribute('url') || /^https?:/.test(e.textContent)));
    if (media) foto = media.getAttribute('url') || media.textContent;
    if (/bing\.com\/th/.test(foto)) foto = '';
    if (!fuente) { try { fuente = new URL(url).hostname.replace(/^www\./, ''); } catch {} }
    return { titulo, url, fuente, fecha: isNaN(f) ? new Date().toISOString() : f.toISOString(), imagen: foto, vivo: true };
  }).filter(x => x.titulo && x.url);
}
async function buscarEnVivo(q) {
  const qq = q ? (MINERO.test(q) ? `${q} Antioquia` : `minería ${q}`) : 'minería "Bajo Cauca"';
  const g = `https://news.google.com/rss/search?q=${encodeURIComponent(qq + ' when:14d')}&hl=es-419&gl=CO&ceid=CO:es-419`;
  const b = `https://www.bing.com/news/search?q=${encodeURIComponent(qq)}&format=rss&setlang=es-CO&cc=CO&qft=sortbydate%3d%221%22`;
  const res = await Promise.allSettled([traerProxy(g).then(x => parsearRSS(x, false)), traerProxy(b).then(x => parsearRSS(x, true))]);
  const out = res.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  return q ? out : out.filter(x => MINERO.test(x.titulo));
}
const claveT = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').slice(0, 80);
function mezclar(...listas) {
  const m = new Map();
  for (const l of listas) for (const it of l) {
    const k = claveT(it.titulo);
    const prev = m.get(k);
    if (!prev) m.set(k, it); else if (!prev.imagen && it.imagen) prev.imagen = it.imagen;
  }
  return [...m.values()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}
const todas = () => mezclar(enVivo, D.noticias.items);
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ---------- Tarjetas ---------- */
function tarjeta(n, grande) {
  const nueva = Date.now() - new Date(n.fecha) < 6 * 3600e3;
  const sello = `<span class="tj-hace ${nueva ? 'nueva' : ''}">${nueva ? t('nueva') + ' · ' : ''}${hace(n.fecha)}</span>`;
  const foto = n.imagen
    ? `<div class="tj-foto" style="background-image:url('${esc(n.imagen)}')">${sello}</div>`
    : `<div class="tj-foto sin">${sello}${esc(n.fuente)}</div>`;
  return `<a class="tj rv ${grande ? 'grande' : ''}" href="${esc(n.url)}" target="_blank" rel="noopener">${foto}<div class="tj-cuerpo"><span class="tj-fuente">${esc(n.fuente)}</span><h3>${esc(n.titulo)}</h3></div></a>`;
}

/* ---------- Hero ---------- */
function pintarHero() {
  const fotos = todas().filter(n => n.imagen).slice(0, 6);
  const cont = $('#heroFotos');
  if (fotos.length && cont.dataset.n !== String(fotos.length)) {
    cont.dataset.n = fotos.length;
    cont.innerHTML = `<div class="on sat"></div>` + fotos.map(f => `<div style="background-image:url('${esc(f.imagen)}')"></div>`).join('');
  }
  $('#heroPie').textContent = t('hero_pie');
  if (!D.m) return;
  $('#marcador').innerHTML = D.m.cifras.map(c => `<div>
      <span class="m-num">${esc(c.pre ? (LANG === 'en' ? 'up to ' : c.pre) : '')}<b class="cuenta" data-fin="${c.num}">0</b></span>
      <span class="m-etq">${esc(Tx(c))}</span>
      <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.fuente)}</a></div>`).join('');
}
function animarCuentas() {
  document.querySelectorAll('.cuenta').forEach(el => {
    const fin = +el.dataset.fin || 0, ini = performance.now(), dur = 1800;
    const paso = ahora => {
      const p = Math.min(1, (ahora - ini) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = num(Math.round(fin * e));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}
let rotador;
function rotarHero() {
  clearInterval(rotador);
  rotador = setInterval(() => {
    const fs = [...document.querySelectorAll('#heroFotos div')];
    if (fs.length < 2) return;
    const i = Math.max(0, fs.findIndex(f => f.classList.contains('on')));
    fs[i].classList.remove('on'); fs[(i + 1) % fs.length].classList.add('on');
  }, 6000);
}
function pintarCinta() {
  const items = todas().slice(0, 14);
  if (!items.length) { $('#cinta').innerHTML = ''; return; }
  const html = items.map(n => `<a href="${esc(n.url)}" target="_blank" rel="noopener"><b>${esc(n.fuente)}</b>${esc(n.titulo)}</a>`).join('');
  $('#cinta').innerHTML = html + html;
}

/* ---------- Hoy ---------- */
const RAPIDAS = ['Caucasia', 'El Bagre', 'Zaragoza', 'Cáceres', 'Nechí', 'Tarazá', 'mercurio', 'La Mandinga', 'Mineros S.A.'];
function pintarRapidas() {
  $('#rapidas').innerHTML = RAPIDAS.map(r => `<button data-q="${esc(r)}">${esc(r)}</button>`).join('');
}
function pintarHoy() {
  const lista0 = todas();
  const hoy = hoyCO();
  let lista = lista0.filter(n => diaCO(n.fecha) === hoy);
  let pre = '';
  if (lista.length < 3) { pre = lista0.length ? `<p class="intro" style="grid-column:1/-1;margin:0">${t('hoy_ultimas')}</p>` : `<p class="intro" style="grid-column:1/-1;margin:0">${t('sin_noticias')}</p>`; lista = lista0.slice(0, 7); }
  $('#hoyFecha').textContent = fechaLarga(Date.now(), true);
  $('#hoyLista').innerHTML = pre + lista.slice(0, 9).map((n, i) => tarjeta(n, i === 0)).join('');
  revelar();
}

/* ---------- Mapa satelital ---------- */
let mapa, capas = [];
function pintarMapa() {
  if (!D.m) return;
  const ms = D.m.municipios, max = Math.max(...ms.map(m => m.t));
  $('#barras').innerHTML = ms.map((m, i) => `<div class="br rv" data-i="${i}"><div class="br-top"><span>${esc(m.n)}</span><b>${m.t}</b></div><div class="br-pista"><i data-w="${(m.t / max * 100).toFixed(1)}"></i></div></div>`).join('');
  $('#notaMapa').textContent = Tx(D.m, 'municipios_nota', 'municipios_nota_en');
  if (!window.L || !$('#mapaSat')) return;
  if (!mapa) {
    mapa = window.L.map('mapaSat', { scrollWheelZoom: false, attributionControl: true }).setView([7.78, -75.08], 9);
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 17, attribution: 'Imagen: Esri, Maxar, Earthstar Geographics' }).addTo(mapa);
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 17, opacity: .8 }).addTo(mapa);
  }
  capas.forEach(c => c.remove()); capas = [];
  ms.forEach(m => {
    const c = window.L.circleMarker([m.lat, m.lng], { radius: 8 + Math.sqrt(m.t) * 3.4, color: '#ffd34d', weight: 2, fillColor: '#f5b700', fillOpacity: .45 })
      .addTo(mapa)
      .bindTooltip(`${m.n} · ${m.t}`, { permanent: true, direction: m.dir || 'top', className: 'etq-mapa', offset: m.dir === 'left' ? [-8, 0] : m.dir === 'right' ? [8, 0] : [0, -6] })
      .bindPopup(`<b>${esc(m.n)}</b><br>${m.t} ${t('titulos')}<br><a href="#hoy" data-q="${esc(m.n)}">${t('ver_noticias', { m: esc(m.n) })}</a>`);
    capas.push(c);
  });
  (D.m.casos || []).filter(c => c.lat).forEach(c => {
    const k = window.L.circleMarker([c.lat, c.lng], { radius: 7, color: '#fff', weight: 2, fillColor: '#e5383b', fillOpacity: .95 })
      .addTo(mapa).bindPopup(`<b>${esc(Tx(c, 'titulo', 'title'))}</b><br>${esc(c.lugar)}<br><a href="#caso-${c.id}">${LANG === 'en' ? 'See case' : 'Ver caso'}</a>`);
    capas.push(k);
  });
  setTimeout(() => mapa.invalidateSize(), 300);
}

/* ---------- Casos ---------- */
const CLAVES_CASO = {
  mandinga: /mandinga|batall[oó]n rifles|c[aá]ceres/i,
  distrito: /distrito (agro)?minero|distritos mineros/i,
  r57011: /mineros s\.?a|mineros aluvial|r57011/i,
  ilegal: /miner[ií]a ilegal|explotaci[oó]n il[ií]cita|dragas?|deep gold/i,
  paro: /paro minero/i
};
function pintarCasos() {
  if (!D.m) return;
  $('#caCorte').textContent = Tx(D.m, 'corte', 'corte_en');
  const ns = todas();
  $('#listaCasos').innerHTML = D.m.casos.map(c => {
    const rel = ns.filter(n => CLAVES_CASO[c.id]?.test(n.titulo));
    const fotoNoticia = rel.find(n => n.imagen)?.imagen;
    const foto = fotoNoticia || (c.lat ? sat(c.lat, c.lng) : sat(7.78, -75.0, .25));
    return `<article class="caso rv" id="caso-${esc(c.id)}">
      <div class="caso-foto" style="background-image:url('${esc(foto)}')"><span class="caso-est ${esc(c.estado)}">${t('est_' + c.estado)}</span></div>
      <div class="caso-in">
        <span class="caso-lugar">${esc(c.lugar)}</span>
        <h3>${esc(Tx(c, 'titulo', 'title'))}</h3>
        <p>${esc(Tx(c, 'texto', 'text'))}</p>
        <div class="caso-pie"><span>${t('fuente')}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.fuente)}</a></span>${rel.length ? `<span class="caso-n">${t('ca_noticias', { n: rel.length })}</span>` : ''}</div>
      </div></article>`;
  }).join('');
}

/* ---------- Departamentos ---------- */
function pintarPais() {
  if (!D.m) return;
  const ds = D.m.departamentos, max = Math.max(...ds.map(d => d.v));
  $('#dptos').innerHTML = ds.map(d => `<div class="dp rv ${d.n === 'Antioquia' ? 'ant' : ''}"><span>${esc(d.n)}</span><div class="dp-pista"><i data-w="${(d.v / max * 100).toFixed(1)}"></i></div><b>${num(d.v)}</b></div>`).join('');
  $('#crTexto').textContent = D.m.departamentos_fuente;
}

/* ---------- Línea de tiempo ---------- */
function pintarLinea() {
  if (!D.m) return;
  $('#lineaT').innerHTML = D.m.linea.map(x => `<li class="rv"><time>${fechaCorta(x.f)}</time><p>${esc(Tx(x))}</p><a href="${esc(x.url)}" target="_blank" rel="noopener">${t('fuente')}</a></li>`).join('');
}

/* ---------- Autoridades y preguntas ---------- */
function pintarAutoridades() {
  if (!D.m) return;
  $('#autoridades').innerHTML = D.m.autoridades.map(a => `<div class="reg rv"><h3>${esc(a.q)}</h3><div class="who">${esc(a.who)}</div><p>${esc(Tx(a))}</p></div>`).join('');
  $('#listaPreguntas').innerHTML = D.m.preguntas.map(p => `<div class="pg rv"><h3>${esc(Tx(p))}</h3></div>`).join('');
}

/* ---------- Videos ---------- */
function pintarVideos() {
  const vs = D.videos.items || [];
  if (!vs.length) {
    $('#reproductor').innerHTML = `<a class="btn-prim" href="https://www.youtube.com/results?search_query=${encodeURIComponent('minería Bajo Cauca')}" target="_blank" rel="noopener">${t('buscar_yt')}</a>`;
    $('#listaVideos').innerHTML = `<p class="intro">${t('sin_videos')}</p>`;
    return;
  }
  const poner = id => {
    $('#reproductor').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    document.querySelectorAll('.vd').forEach(v => v.classList.toggle('on', v.dataset.id === id));
  };
  $('#listaVideos').innerHTML = vs.slice(0, 12).map(v => `<button class="vd" data-id="${esc(v.id)}"><img src="https://i.ytimg.com/vi/${esc(v.id)}/mqdefault.jpg" alt="" loading="lazy"><div>${esc(v.titulo)}<small>${esc(v.canal)}${v.hace ? ' · ' + esc(v.hace) : ''}</small></div></button>`).join('');
  $('#listaVideos').onclick = e => { const b = e.target.closest('.vd'); if (b) poner(b.dataset.id); };
  if (!$('#reproductor iframe')) poner(vs[0].id);
}

/* ---------- Derecho de petición ---------- */
const ENTIDADES = [
  ['Agencia Nacional de Minería (ANM)', 'contactenos@anm.gov.co'],
  ['Ministerio de Minas y Energía', 'menergia@minenergia.gov.co'],
  ['Secretaría de Minas de Antioquia', 'minas@antioquia.gov.co'],
  ['Gobernación de Antioquia (gestión documental)', 'gestiondocumental@antioquia.gov.co'],
  ['Corantioquia', 'corantioquia@corantioquia.gov.co'],
  ['Alcaldía de Caucasia', 'contactenos@caucasia-antioquia.gov.co'],
  ['Procuraduría General de la Nación', 'quejas@procuraduria.gov.co'],
  ['Contraloría General de la República', 'cgr@contraloria.gov.co']
];
const ASUNTO = 'Derecho de petición — minería en el Bajo Cauca antioqueño';
const datosForm = () => Object.fromEntries(new FormData($('#formPet')));
function pintarSelMuni() {
  const sel = $('#selMuni'), v = sel.value;
  sel.innerHTML = `<option value="">${t('todos_muni')}</option>` + (D.m?.municipios || []).map(m => `<option>${esc(m.n)}</option>`).join('');
  sel.value = v;
}
function textoPeticion() {
  const f = datosForm();
  const zona = f.muni ? `el municipio de ${f.muni} (Antioquia)` : 'los municipios de Caucasia, Cáceres, El Bagre, Zaragoza, Nechí y Tarazá (Bajo Cauca antioqueño)';
  const hoy = new Intl.DateTimeFormat('es-CO', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return `${f.ciudad || '[Ciudad]'}, ${hoy}

Señores
Agencia Nacional de Minería; Ministerio de Minas y Energía; Secretaría de Minas y Gobernación de Antioquia; Corantioquia; Alcaldía de Caucasia; Procuraduría General de la Nación; Contraloría General de la República.

Asunto: Derecho de petición de información sobre la minería en ${zona}.

Yo, ${f.nombre || '[Nombre completo]'}, identificado(a) con cédula de ciudadanía ${f.cc || '[Cédula]'}, en ejercicio del derecho fundamental de petición del artículo 23 de la Constitución Política y de la Ley 1755 de 2015, respetuosamente solicito la siguiente información, cada entidad dentro de su competencia:

1. Relación de los títulos mineros vigentes y de las solicitudes y propuestas de contrato de concesión en trámite en ${zona}, con número de expediente, titular o solicitante, mineral, área en hectáreas, etapa y si cuentan con licencia o instrumento ambiental.

2. Cuántos de esos títulos y solicitudes se superponen con resguardos indígenas, consejos comunitarios, áreas protegidas, zonas de reserva forestal o las rondas hídricas de los ríos Cauca y Nechí.

3. Qué pasará con los procesos de formalización minera, los subcontratos de formalización y los planes del Distrito Agrominero y Pesquero del Bajo Cauca tras la derogatoria hecha por el Ministerio de Minas y Energía mediante la Resolución 40579 del 22 de octubre de 2026, y si la ANM ya actualizó el Catastro Minero.

4. Qué acciones se han adelantado en el predio La Mandinga (placa ODH-08201 y polígono LID-09161), vereda Río Man de Cáceres, desde la solicitud de la ANM a la Alcaldía de Cáceres del 10 de octubre de 2025, incluidos amparos administrativos, cierres y denuncias.

5. Qué entidad fiscaliza hoy los títulos del Bajo Cauca, cuántas visitas de fiscalización se hicieron en 2025 y 2026 y cuántas sanciones, multas o caducidades se impusieron.

6. Resultados de los monitoreos de mercurio en agua, sedimentos y peces de los ríos Cauca y Nechí en 2025 y 2026, y las medidas tomadas.

7. Hectáreas afectadas por explotación ilícita de minerales en ${zona} en 2025 y 2026 y el plan de recuperación de esas áreas.

8. Regalías mineras giradas a cada municipio del Bajo Cauca entre 2024 y 2026 y los proyectos en que se invirtieron.

Si alguna entidad no es competente para responder alguno de los puntos, le solicito darle traslado a la entidad competente e informarme, según el artículo 21 de la Ley 1755 de 2015.

Recibiré respuesta en el correo electrónico ${f.correo || '[correo]'}${f.tel ? ' y en el celular ' + f.tel : ''}.

Atentamente,

${f.nombre || '[Nombre completo]'}
C.C. ${f.cc || '[Cédula]'}
${f.ciudad || '[Ciudad]'}`;
}
function pintarPeticion() {
  pintarSelMuni();
  $('#destinos').innerHTML = ENTIDADES.map(([n, c]) => `<li>${esc(n)} — <span>${esc(c)}</span></li>`).join('');
  $('#petTexto').textContent = textoPeticion();
}

/* ---------- Todas las noticias ---------- */
let cuantas = 20;
function pintarTodas() {
  const ts = todas();
  $('#todas').innerHTML = ts.slice(0, cuantas).map(n => `<a class="lf" href="${esc(n.url)}" target="_blank" rel="noopener"><time>${fechaLarga(n.fecha)}</time><div><span>${esc(n.fuente)}</span><b>${esc(n.titulo)}</b></div></a>`).join('');
  $('#btnMas').style.display = ts.length > cuantas ? '' : 'none';
  const h = D.noticias.actualizado;
  $('#robotHora').textContent = h ? t('robot', { h: fechaLarga(h, true) }) : '';
}

/* ---------- Animaciones al bajar ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('ya');
  e.target.querySelectorAll('[data-w]').forEach(i => i.style.width = i.dataset.w + '%');
  io.unobserve(e.target);
}), { threshold: .12 }) : null;
function revelar() {
  document.querySelectorAll('.rv:not(.ya)').forEach(el => {
    if (io) io.observe(el);
    else { el.classList.add('ya'); el.querySelectorAll('[data-w]').forEach(i => i.style.width = i.dataset.w + '%'); }
  });
}

function pintarTodo() {
  aplicarIdioma(); pintarHero(); pintarCinta(); pintarRapidas(); pintarHoy(); pintarMapa(); pintarCasos();
  pintarPais(); pintarLinea(); pintarAutoridades(); pintarVideos(); pintarPeticion(); pintarTodas(); revelar();
}

async function vivo(q) {
  const est = $('#estadoBusq');
  est.textContent = t('busc_cargando');
  try {
    const r = await buscarEnVivo(q);
    if (!r.length) throw new Error('vacio');
    enVivo = mezclar(enVivo, r);
    est.textContent = t('busc_ok', { n: r.length });
    if (q) {
      $('#hoyLista').innerHTML = mezclar(r).slice(0, 12).map((n, i) => tarjeta(n, i === 0)).join('');
      revelar();
    } else { pintarHoy(); pintarCinta(); pintarHero(); pintarCasos(); pintarTodas(); revelar(); }
  } catch { est.textContent = t('busc_nada'); }
}
function buscarDesde(q) {
  $('#q').value = q;
  $('#hoy').scrollIntoView({ behavior: 'smooth' });
  vivo(q);
}
async function actualizar() {
  const b = $('#btnActualizar');
  b.classList.add('cargando');
  await cargarTodo();
  pintarTodo(); animarCuentas();
  await vivo($('#q').value.trim());
  b.classList.remove('cargando');
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  aplicarIdioma();
  await cargarTodo();
  pintarTodo(); animarCuentas(); rotarHero();
  vivo('');  // búsqueda en vivo al abrir
  $('#btnActualizar').onclick = actualizar;
  $('#btnLang').onclick = () => { LANG = LANG === 'es' ? 'en' : 'es'; try { localStorage.setItem('om_lang', LANG); } catch {} pintarTodo(); animarCuentas(); };
  $('#btnBuscar').onclick = () => vivo($('#q').value.trim());
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') vivo($('#q').value.trim()); });
  $('#rapidas').addEventListener('click', e => { const b = e.target.closest('button'); if (b) buscarDesde(b.dataset.q); });
  $('#barras').addEventListener('click', e => {
    const b = e.target.closest('.br'); if (!b || !mapa) return;
    const m = D.m.municipios[+b.dataset.i];
    document.querySelectorAll('.br').forEach(x => x.classList.toggle('on', x === b));
    mapa.flyTo([m.lat, m.lng], 11, { duration: 1.2 });
    capas[+b.dataset.i]?.openPopup();
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('.leaflet-popup a[data-q]');
    if (a) { e.preventDefault(); buscarDesde(a.dataset.q); }
  });
  $('#btnMas').onclick = () => { cuantas += 20; pintarTodas(); };
  $('#formPet').addEventListener('input', () => $('#petTexto').textContent = textoPeticion());
  $('#formPet').addEventListener('change', () => $('#petTexto').textContent = textoPeticion());
  $('#formPet').addEventListener('submit', e => {
    e.preventDefault();
    const to = ENTIDADES.map(x => x[1]).join(',');
    location.href = `mailto:${to}?subject=${encodeURIComponent(ASUNTO)}&body=${encodeURIComponent(textoPeticion())}`;
  });
  $('#btnGmail').onclick = () => {
    if (!$('#formPet').reportValidity()) return;
    const to = ENTIDADES.map(x => x[1]).join(',');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(ASUNTO)}&body=${encodeURIComponent(textoPeticion())}`, '_blank');
  };
  $('#btnCopiar').onclick = async () => {
    try { await navigator.clipboard.writeText(textoPeticion()); $('#btnCopiar').textContent = t('copiado'); setTimeout(() => $('#btnCopiar').textContent = t('pe_copiar'), 2000); } catch {}
  };
  $('#btnCompartir').onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(t('compartir_txt') + ' ' + URL_APP)}`, '_blank');
  // Se refresca solo mientras está abierta y al volver a la app
  setInterval(actualizar, 10 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') actualizar(); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});
