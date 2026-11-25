from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import qrcode, json, subprocess, math, os
AQUI=os.path.dirname(os.path.abspath(__file__))
F=os.path.join(AQUI,'..','fotos')+'/'
CRED={x['archivo'].split('/')[-1]:x['fuente'] for x in json.load(open(F+'creditos.json'))}
def fpath(fam,style=''):
    return subprocess.run(['fc-match','-f','%{file}',f'{fam}:{style}'],capture_output=True,text=True).stdout
ANTON=fpath('Anton'); ARCH=fpath('Archivo Black'); FIRA=fpath('Fira Sans','style=Regular'); FIRAB=fpath('Fira Sans','style=Bold'); FIRASB=fpath('Fira Sans','style=SemiBold')
_fc={}
def font(p,s):
    k=(p,s)
    if k not in _fc: _fc[k]=ImageFont.truetype(p,s)
    return _fc[k]
NOCHE=(13,19,16); ORO=(245,183,0); ORO2=(255,211,77); BLANCO=(255,255,255); ROJO=(229,56,59)
URL='ojo-a-la-mineria-bajo-cauca.netlify.app'
def qr(size):
    q=qrcode.QRCode(border=2,box_size=10,error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data('https://'+URL+'/'); q.make()
    return q.make_image(fill_color=NOCHE,back_color='white').convert('RGB').resize((size,size),Image.NEAREST)
def cover(im,w,h):
    r=max(w/im.width,h/im.height); im=im.resize((int(im.width*r+1),int(im.height*r+1)),Image.LANCZOS)
    x=(im.width-w)//2; y=(im.height-h)//2; return im.crop((x,y,x+w,y+h))
def wrap(d,txt,f,maxw):
    words=txt.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines

# ---- Oro reluciente ----
PARADAS=[(0,(122,78,8)),(.28,(214,158,34)),(.46,(255,233,150)),(.55,(255,214,90)),(.75,(196,132,18)),(1,(255,206,92))]
_grad={}
def gradiente(h):
    if h in _grad: return _grad[h]
    col=Image.new('RGB',(1,h))
    for y in range(h):
        t=y/max(1,h-1)
        for i in range(len(PARADAS)-1):
            a,ca=PARADAS[i]; b,cb=PARADAS[i+1]
            if a<=t<=b:
                u=(t-a)/(b-a); col.putpixel((0,y),tuple(int(ca[k]+(cb[k]-ca[k])*u) for k in range(3))); break
    _grad[h]=col; return col
def texto_oro(im,xy,txt,f,anchor='la',brillo=None,alpha=1.0,sombra=True):
    """Pinta texto dorado metálico. brillo: 0..1 posición del destello que cruza el texto."""
    d=ImageDraw.Draw(im)
    bb=d.textbbox(xy,txt,font=f,anchor=anchor)
    pad=30; x0,y0,x1,y1=bb[0]-pad,bb[1]-pad,bb[2]+pad,bb[3]+pad
    w,h=x1-x0,y1-y0
    m=Image.new('L',(w,h)); ImageDraw.Draw(m).text((xy[0]-x0,xy[1]-y0),txt,font=f,anchor=anchor,fill=255)
    if alpha<1: m=m.point(lambda v:int(v*alpha))
    if sombra:
        s=m.filter(ImageFilter.GaussianBlur(10)).point(lambda v:int(v*.85))
        im.paste(Image.new('RGB',(w,h),(0,0,0)),(x0+4,y0+8),s)
    th=bb[3]-bb[1]
    g=gradiente(max(2,th)).resize((w,th))
    oro=Image.new('RGB',(w,h),PARADAS[0][1]); oro.paste(g,(0,bb[1]-y0))
    if oro.height>bb[3]-y0: oro.paste(Image.new('RGB',(w,h-(bb[3]-y0)),PARADAS[-1][1]),(0,bb[3]-y0))
    if brillo is not None and -0.2<brillo<1.2:
        band=Image.new('L',(w,h)); bd=ImageDraw.Draw(band)
        cx=int(-h+brillo*(w+2*h)); bw=max(30,h//2)
        bd.polygon([(cx,0),(cx+bw,0),(cx+bw-h,h),(cx-h,h)],fill=235)
        band=band.filter(ImageFilter.GaussianBlur(bw//4))
        oro=Image.composite(Image.new('RGB',(w,h),(255,250,225)),oro,band)
    # borde fino oscuro para que resalte
    borde=m.filter(ImageFilter.MaxFilter(3))
    im.paste(Image.new('RGB',(w,h),(70,44,4)),(x0,y0),borde)
    im.paste(oro,(x0,y0),m)
    return bb
def destello(im,x,y,r,a=1.0):
    """Estrella de luz dorada (destello), sin dibujos: solo luz."""
    lay=Image.new('L',(r*4,r*4)); d=ImageDraw.Draw(lay); c=r*2
    d.ellipse((c-r//3,c-r//3,c+r//3,c+r//3),fill=int(255*a))
    d.polygon([(c,c-2*r),(c+r//8,c),(c,c+2*r),(c-r//8,c)],fill=int(220*a))
    d.polygon([(c-2*r,c),(c,c-r//8),(c+2*r,c),(c,c+r//8)],fill=int(220*a))
    lay=lay.filter(ImageFilter.GaussianBlur(max(1,r//6)))
    im.paste(Image.new('RGB',lay.size,(255,236,170)),(int(x-c),int(y-c)),lay)
