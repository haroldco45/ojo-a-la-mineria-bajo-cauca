from comun import *
W,H=1080,1350
im=Image.new('RGB',(W,H),NOCHE)
FOTO='foto11.jpg'
foto=cover(Image.open(F+FOTO).convert('RGB'),W,820)
im.paste(foto,(0,0))
g=Image.new('L',(1,820))
for y in range(820):
    u=max(0,min(1,(y/820-0.3)/0.7)); g.putpixel((0,y),int(255*(0.12+0.88*u*u*(3-2*u))))
im.paste(Image.new('RGB',(W,820),NOCHE),(0,0),g.resize((W,820)))
# franja de satélite real abajo, muy oscura
sat=cover(Image.open(F+'sat-region.jpg').convert('RGB'),W,H-820)
sat=Image.blend(sat,Image.new('RGB',sat.size,NOCHE),.82); im.paste(sat,(0,820))
d=ImageDraw.Draw(im)
d.rounded_rectangle((50,50,122,122),18,fill=ORO); d.text((86,86),'OM',font=font(ARCH,30),fill=NOCHE,anchor='mm')
d.text((140,86),'Vibras Positivas HM',font=font(FIRAB,32),fill=BLANCO,anchor='lm')
et='SEGUIMIENTO CIUDADANO · BAJO CAUCA'; f=font(FIRAB,28); w=d.textlength(et,font=f)
d.rounded_rectangle((60,400,60+w+40,454),27,fill=(0,0,0)); d.rounded_rectangle((60,400,60+w+40,454),27,outline=ORO,width=2)
d.text((80,427),et,font=f,fill=ORO2,anchor='lm')
texto_oro(im,(52,470),'OJO A LA',font(ANTON,120),brillo=None)
texto_oro(im,(52,590),'MINERÍA',font(ANTON,200),brillo=.62)
for (x,y,r) in [(830,640,26),(150,612,14),(990,520,12)]: destello(im,x,y,r)
d=ImageDraw.Draw(im)
d.text((60,850),'¿Quién se queda con el oro y quién con el agua?',font=font(FIRASB,38),fill=(240,236,220))
cajas=[('3.028','expedientes mineros en Antioquia'),('168','títulos en el Bajo Cauca'),('493 ha','dañadas por minería ilegal en 2025')]
x=50; cw=(W-100-2*20)//3
for n,t in cajas:
    d.rounded_rectangle((x,915,x+cw,1095),24,fill=(20,26,20),outline=(150,108,20),width=2)
    fs=78
    while font(ANTON,fs).getlength(n)>cw-40: fs-=2
    texto_oro(im,(x+22,928),n,font(ANTON,fs),sombra=False)
    d=ImageDraw.Draw(im)
    for k,l in enumerate(wrap(d,t,font(FIRA,25),cw-44)): d.text((x+22,1025+k*30),l,font=font(FIRA,25),fill=(215,215,205))
    x+=cw+20
# pie con QR
d.rounded_rectangle((50,1115,W-50,1310),28,fill=BLANCO)
q=qr(165); im.paste(q,(75,1130))
d=ImageDraw.Draw(im)
d.text((265,1130),'Escanee y abra la app',font=font(FIRAB,36),fill=NOCHE)
for k,l in enumerate(['Mapa satelital · casos · noticias cada 30 min','Derecho de petición a 8 entidades · ES / EN']):
    d.rectangle((267,1190+k*36,277,1200+k*36),fill=ORO); d.text((290,1180+k*36),l,font=font(FIRA,26),fill=(40,46,40))
d.text((265,1296),URL,font=font(FIRAB,31),fill=(150,95,0),anchor='ls')
d.text((W-50,1338),'Foto: '+CRED[FOTO]+' · Satélite: Esri  ·  Datos: ANM, Procuraduría, @efren.fotograma  ·  WhatsApp 311 770 0431',font=font(FIRA,17),fill=(175,175,165),anchor='rs')
out=os.path.join(AQUI,'..')
im.save(out+'/flyer-ojo-a-la-mineria.png'); im.save(out+'/flyer-ojo-a-la-mineria.jpg',quality=92)
print('flyer listo')
