import random
from comun import *
W, H, FPS = 1080, 1920, 30
# (foto, seg, etiqueta, grande, sub, contador, sufijo, fuente del dato)
ESC = [
  ('foto11.jpg', 4.4, 'BAJO CAUCA ANTIOQUEÑO', 'EL ORO', '¿Quién se queda con el oro y quién con el agua?', None, '', ''),
  ('sat-region.jpg', 5.0, 'ANTIOQUIA', '3.028', 'expedientes mineros: títulos y solicitudes', 3028, '', 'Catastro ANM 12-nov-2026 · @efren.fotograma'),
  ('foto7.jpg', 4.8, 'BAJO CAUCA', '168', 'títulos mineros en Caucasia, Cáceres, El Bagre, Zaragoza, Nechí y Tarazá', 168, '', 'Agencia Nacional de Minería'),
  ('foto6.jpg', 4.8, 'SOLO EN 2025', '493 ha', 'nuevas dañadas por minería ilegal en el Bajo Cauca', 493, ' ha', 'Procuraduría General de la Nación'),
  ('sat-caucasia.jpg', 4.8, 'LA MANDINGA · CÁCERES', '2.500', 'mineros sin título junto al batallón de Caucasia, según el Ejército', 2500, '', 'El Colombiano, abril de 2026'),
  ('foto4.jpg', 4.6, 'USTED PUEDE PREGUNTAR', 'PETICIÓN', 'a 8 entidades, de una sola vez desde la app', None, '', ''),
]
FIN, XF = 6.0, 0.45
random.seed(7)
fotos = {f: cover(Image.open(F + f).convert('RGB'), int(W * 1.18), int(H * 1.18)) for f, *_ in ESC}
fEt = font(FIRAB, 40); fSub = font(FIRASB, 50); fCred = font(FIRA, 26); fMarca = font(FIRAB, 34); fDato = font(FIRA, 32)
def fGrande(txt):
    s = 300
    while font(ANTON, s).getlength(txt) > W - 140: s -= 6
    return font(ANTON, s)
degr = Image.new('L', (1, H))
for y in range(H):
    u = max(0, min(1, (y / H - 0.28) / 0.45)); degr.putpixel((0, y), int(255 * (0.18 + 0.78 * u * u * (3 - 2 * u))))
degr = degr.resize((W, H)); NEGRO = Image.new('RGB', (W, H), NOCHE)
def ease(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
# Polvo de oro: partículas de luz que suben
PART = [(random.uniform(0, W), random.uniform(0, H), random.uniform(2, 6), random.uniform(40, 120), random.uniform(0, 6.28)) for _ in range(70)]
def polvo(im, T):
    lay = Image.new('L', (W, H)); d = ImageDraw.Draw(lay)
    for x, y, r, v, ph in PART:
        yy = (y - v * T) % H; xx = x + 18 * math.sin(T * 1.3 + ph)
        a = int(150 + 105 * math.sin(T * 3 + ph))
        d.ellipse((xx - r, yy - r, xx + r, yy + r), fill=max(0, a))
    glow = lay.filter(ImageFilter.GaussianBlur(4))
    lay = ImageChops.lighter(lay, glow)
    im.paste(Image.new('RGB', (W, H), (255, 214, 110)), (0, 0), lay.point(lambda v: int(v * .75)))
def marca(im):
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((60, 90, 132, 162), 18, fill=ORO); d.text((96, 126), 'OM', font=font(ARCH, 30), fill=NOCHE, anchor='mm')
    d.text((152, 126), 'Ojo a la Minería · Bajo Cauca', font=fMarca, fill=BLANCO, anchor='lm')
def escena(i, t, T):
    f, dur, et, gr, sub, cont, suf, dato = ESC[i]
    base = fotos[f]; p = t / dur; z = 1.0 + 0.12 * p
    cw = int(W * 1.18 / z); ch = int(H * 1.18 / z)
    dx = (base.width - cw) * (0.5 + 0.3 * math.sin(i * 1.7) * p); dy = (base.height - ch) * 0.45
    im = base.crop((int(dx), int(dy), int(dx) + cw, int(dy) + ch)).resize((W, H), Image.BILINEAR)
    im = Image.composite(NEGRO, im, degr)
    polvo(im, T); marca(im)
    a1, a2, a3 = ease((t - .15) / .5), ease((t - .4) / .6), ease((t - .8) / .6)
    y0 = 1000; d = ImageDraw.Draw(im)
    if a1 > 0:
        w = d.textlength(et, font=fEt)
        lay = Image.new('RGBA', (W, H)); dl = ImageDraw.Draw(lay)
        dl.rounded_rectangle((70, y0, 70 + w + 44, y0 + 70), 35, fill=(0, 0, 0, int(200 * a1)), outline=ORO + (int(255 * a1),), width=3)
        dl.text((92, y0 + 35), et, font=fEt, fill=ORO2 + (int(255 * a1),), anchor='lm')
        im.paste(lay, (int(-40 * (1 - a1)), 0), lay)
    txt = gr
    if cont: txt = f"{int(round(cont * ease((t - .4) / 1.6))):,}".replace(',', '.') + suf
    fg = fGrande(gr)
    if a2 > 0:
        texto_oro(im, (70, y0 + 100 + int(60 * (1 - a2))), txt, fg, brillo=(t - 1.6) / 1.1, alpha=a2)
    gh = fg.getbbox(gr)[3]
    if a3 > 0:
        lay = Image.new('RGBA', (W, H)); dl = ImageDraw.Draw(lay)
        yy = y0 + 140 + gh
        dl.rectangle((70, yy, 70 + int(160 * a3), yy + 8), fill=ORO + (255,))
        k = 0
        for k, ln in enumerate(wrap(dl, sub, fSub, W - 150)):
            dl.text((70, yy + 40 + k * 66), ln, font=fSub, fill=BLANCO + (int(245 * a3),))
        if dato: dl.text((70, yy + 40 + (k + 1) * 66 + 14), 'Fuente: ' + dato, font=fDato, fill=(225, 200, 140, int(230 * a3)))
        im.paste(lay, (0, 0), lay)
    if 1.6 < t < 2.6: destello(im, 80 + fg.getlength(txt) * 0.85, y0 + 140, int(34 * math.sin((t - 1.6) * math.pi)) + 4)
    d = ImageDraw.Draw(im)
    cr = CRED.get(f, '')
    d.text((W - 50, H - 60), ('Imagen: ' if 'sat' in f else 'Foto: ') + cr, font=fCred, fill=(200, 200, 190), anchor='rs')
    d.rectangle((0, H - 10, int(W * p), H), fill=ORO)
    return im
QR = qr(500)
FONDO = Image.blend(cover(Image.open(F + 'sat-elbagre.jpg').convert('RGB'), W, H), Image.new('RGB', (W, H), NOCHE), .8)
def final(t, T):
    im = FONDO.copy(); polvo(im, T); d = ImageDraw.Draw(im)
    a = ease(t / .6)
    d.rounded_rectangle((W // 2 - 70, 190, W // 2 + 70, 330), 34, fill=ORO); d.text((W // 2, 260), 'OM', font=font(ARCH, 64), fill=NOCHE, anchor='mm')
    texto_oro(im, (W // 2, 440), 'OJO A LA', font(ANTON, 120), anchor='mm', brillo=(t - .3) / 1.2)
    texto_oro(im, (W // 2, 600), 'MINERÍA', font(ANTON, 190), anchor='mm', brillo=(t - .6) / 1.2)
    d = ImageDraw.Draw(im)
    d.text((W // 2, 730), 'Bajo Cauca · seguimiento ciudadano', font=fSub, fill=(235, 230, 215), anchor='mm')
    s = int(500 * (0.85 + 0.15 * a)); q = QR.resize((s, s)); pad = 28; x = (W - s) // 2; y = 810 + (500 - s) // 2
    d.rounded_rectangle((x - pad, y - pad, x + s + pad, y + s + pad), 36, fill=BLANCO, outline=ORO, width=6); im.paste(q, (x, y))
    d.text((W // 2, 1420), URL, font=font(FIRAB, 46), fill=ORO2, anchor='mm')
    for k, ln in enumerate(['Noticias que se actualizan solas cada 30 minutos', 'Mapa satelital · Español e inglés']):
        d.text((W // 2, 1505 + k * 60), ln, font=font(FIRA, 40), fill=(220, 218, 205), anchor='mm')
    d.text((W // 2, 1720), 'Vibras Positivas HM', font=font(FIRAB, 46), fill=BLANCO, anchor='mm')
    d.text((W // 2, 1782), 'Caucasia, Antioquia · WhatsApp 311 770 0431', font=font(FIRA, 36), fill=(200, 198, 185), anchor='mm')
    if 1 < t < 2.4: destello(im, W // 2 + 330, 560, int(40 * math.sin((t - 1) / 1.4 * math.pi)) + 4)
    return im
out = os.path.join(AQUI, '..', 'ojo-a-la-mineria.mp4')
# Música: acorde suave tipo campana dorada (generado), con fundido
musica = "aevalsrc='0.10*sin(2*PI*220*t)*exp(-mod(t,2.4)*1.2)+0.07*sin(2*PI*277.18*t)*exp(-mod(t,2.4)*1.2)+0.06*sin(2*PI*329.63*t)*exp(-mod(t,2.4)*1.1)+0.04*sin(2*PI*880*t)*exp(-mod(t+1.2,2.4)*3)+0.05*sin(2*PI*110*t):s=44100',aformat=channel_layouts=stereo"
inicios = []; acc = 0
for e in ESC: inicios.append(acc); acc += e[1]
total = acc + FIN
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
    '-f', 'lavfi', '-i', musica, '-af', f'afade=t=in:d=1,afade=t=out:st={total-1.5}:d=1.5', '-t', str(total),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
n = int(total * FPS)
for k in range(n):
    T = k / FPS
    if T >= acc:
        fr = final(T - acc, T)
        if T - acc < XF: fr = Image.blend(escena(len(ESC) - 1, ESC[-1][1] - 0.001, T), fr, (T - acc) / XF)
    else:
        i = max(j for j, s in enumerate(inicios) if s <= T)
        fr = escena(i, T - inicios[i], T)
        nxt = inicios[i] + ESC[i][1]
        if nxt - T < XF:
            sig = escena(i + 1, 0, T) if i + 1 < len(ESC) else final(0, T)
            fr = Image.blend(fr, sig, 1 - (nxt - T) / XF)
    ff.stdin.write(fr.tobytes())
    if k % 200 == 0: print(k, '/', n, flush=True)
ff.stdin.close(); ff.wait(); print('listo', total, 's')
