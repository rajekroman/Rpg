from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance, ImageFont
import math, random
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'ui' / 'professional'
TEX = ROOT / 'assets' / 'textures' / 'professional'
OUT.mkdir(parents=True, exist_ok=True)
TEX.mkdir(parents=True, exist_ok=True)
SEED = 120771
random.seed(SEED)

PALETTE = [
    (7,8,10),(13,14,17),(21,22,25),(30,31,34),(41,42,44),(55,55,55),(72,71,68),(91,88,82),
    (111,105,96),(133,125,111),(157,147,128),(185,173,147),(214,198,163),(236,222,188),
    (35,19,15),(58,29,21),(83,42,29),(112,58,38),(143,79,52),(176,105,72),(204,136,95),(224,166,120),
    (29,20,18),(51,33,27),(77,49,37),(103,68,49),(132,91,66),(163,116,86),(193,146,113),(218,176,142),
    (27,26,31),(42,42,50),(60,62,72),(82,86,98),(107,113,127),(137,145,161),(171,181,197),(207,216,225),
    (17,25,31),(25,39,47),(33,55,66),(44,73,86),(59,94,108),(82,119,134),(111,149,163),(151,185,196),
    (15,24,16),(24,38,24),(35,54,30),(49,72,39),(66,91,49),(86,113,61),(111,138,75),(144,166,96),
    (31,19,37),(49,27,57),(70,38,80),(94,53,107),(121,71,137),(153,94,168),(185,126,197),(216,165,224),
    (45,28,9),(70,44,13),(96,61,19),(126,82,28),(158,106,39),(190,133,55),(219,164,77),(239,196,113),
    (62,10,13),(92,15,18),(127,23,26),(162,35,35),(195,54,49),(220,80,67),(237,113,94),(247,153,125),
    (9,22,61),(13,34,94),(20,50,130),(31,70,164),(49,93,194),(75,120,218),(111,153,236),(157,190,248),
]

def quantize(img: Image.Image, colors=96, dither=Image.Dither.FLOYDSTEINBERG) -> Image.Image:
    if img.mode != 'RGBA': img = img.convert('RGBA')
    alpha = img.getchannel('A')
    rgb = img.convert('RGB')
    pal = Image.new('P',(1,1))
    flat=[]
    for c in PALETTE:
        flat.extend(c)
    flat += [0]*(768-len(flat))
    pal.putpalette(flat)
    q = rgb.quantize(palette=pal, dither=dither)
    out = q.convert('RGBA')
    out.putalpha(alpha)
    return out

def gradient_rect(draw, box, top, bottom, steps=128):
    x0,y0,x1,y1=box
    h=max(1,y1-y0)
    for i in range(h):
        t=i/max(1,h-1)
        c=tuple(round(top[j]*(1-t)+bottom[j]*t) for j in range(3))
        draw.line((x0,y0+i,x1,y0+i), fill=c)

def add_noise(img, amount=10, seed=0, mono=False):
    rng=np.random.default_rng(seed)
    arr=np.array(img.convert('RGBA')).astype(np.int16)
    n=rng.normal(0,amount,(arr.shape[0],arr.shape[1],1 if mono else 3))
    if mono: n=np.repeat(n,3,axis=2)
    arr[:,:,:3]=np.clip(arr[:,:,:3]+n,0,255)
    return Image.fromarray(arr.astype(np.uint8),'RGBA')

def bevel_frame(size, border=14, metal=True):
    s=size*4
    im=Image.new('RGBA',(s,s),(0,0,0,0)); d=ImageDraw.Draw(im)
    # outer soot and shadow
    d.rounded_rectangle((2,2,s-3,s-3), radius=10, fill=(10,10,11,255), outline=(2,2,2,255), width=7)
    gradient_rect(d,(8,8,s-9,s-9),(105,104,98),(31,32,35))
    d.rounded_rectangle((10,10,s-11,s-11),radius=8,outline=(184,173,148,255),width=5)
    d.rounded_rectangle((20,20,s-21,s-21),radius=5,outline=(23,23,24,255),width=9)
    d.rounded_rectangle((29,29,s-30,s-30),radius=3,outline=(98,91,79,255),width=4)
    # rivets
    for x,y in [(18,18),(s-19,18),(18,s-19),(s-19,s-19)]:
        d.ellipse((x-5,y-5,x+5,y+5),fill=(38,38,39,255),outline=(177,163,137,255),width=2)
        d.point((x-1,y-1), fill=(232,218,184,255))
    # chips
    rng=random.Random(size*9)
    for _ in range(55):
        side=rng.randrange(4)
        if side==0: x=rng.randrange(12,s-12); y=rng.randrange(7,24)
        elif side==1: x=rng.randrange(12,s-12); y=rng.randrange(s-24,s-7)
        elif side==2: x=rng.randrange(7,24); y=rng.randrange(12,s-12)
        else: x=rng.randrange(s-24,s-7); y=rng.randrange(12,s-12)
        col=(16,16,17,210) if rng.random()<.65 else (155,145,123,120)
        d.rectangle((x,y,x+rng.randrange(2,7),y+rng.randrange(1,4)),fill=col)
    im=add_noise(im,4,size)
    im=im.resize((size,size),Image.Resampling.LANCZOS)
    return quantize(im,96)

def make_panel(name,size=(96,96),variant='dark'):
    w,h=size; s=4
    im=Image.new('RGBA',(w*s,h*s),(0,0,0,255)); d=ImageDraw.Draw(im)
    if variant=='dark':
        gradient_rect(d,(0,0,w*s,h*s),(25,22,19),(7,8,9))
        for _ in range(120):
            x=random.randrange(w*s); y=random.randrange(h*s)
            r=random.choice([1,1,2,3])
            d.ellipse((x-r,y-r,x+r,y+r),fill=random.choice([(45,40,34,80),(4,4,5,120),(72,61,48,45)]))
    elif variant=='parchment':
        gradient_rect(d,(0,0,w*s,h*s),(164,143,103),(68,54,37))
    im=add_noise(im,7,SEED+w+h)
    im=im.resize((w,h),Image.Resampling.LANCZOS)
    quantize(im,96).save(OUT/name)

def face_gradient(base, light, size):
    w,h=size
    im=Image.new('RGBA',size,(0,0,0,0)); p=im.load()
    for y in range(h):
        for x in range(w):
            nx=(x-w*.48)/(w*.48); ny=(y-h*.45)/(h*.55)
            v=max(0,1-math.sqrt(nx*nx*.8+ny*ny))
            side=max(0,min(1,(x/w)*1.4))
            c=tuple(int(base[i]*(1-v*.25)+light[i]*(v*.25+side*.08)) for i in range(3))
            p[x,y]=(*c,255)
    return im

def draw_portrait(spec, path):
    W,H=384,448
    im=Image.new('RGBA',(W,H),(6,7,8,255)); d=ImageDraw.Draw(im)
    # vignette background
    for r in range(280,0,-8):
        t=r/280
        col=(int(12+18*t),int(13+18*t),int(16+22*t),255)
        d.ellipse((W/2-r,H*.42-r*.82,W/2+r,H*.42+r*.82),fill=col)
    # shoulders/costume
    cloth=spec['cloth']; armor=spec['armor']
    d.polygon([(20,H),(55,315),(115,270),(269,270),(330,315),(364,H)],fill=cloth)
    # cape shadow
    d.polygon([(25,H),(72,310),(118,285),(90,H)],fill=tuple(max(0,c-35) for c in cloth))
    d.polygon([(359,H),(312,310),(266,285),(295,H)],fill=tuple(max(0,c-35) for c in cloth))
    # breastplate layers
    gradient_rect(d,(95,270,289,H),tuple(min(255,c+40) for c in armor),tuple(max(0,c-45) for c in armor))
    d.polygon([(105,278),(151,252),(233,252),(279,278),(260,H),(124,H)],outline=(205,191,161),width=5)
    for y in [300,344,392]:
        d.line((106,y,278,y+8),fill=(35,34,34),width=7)
        d.line((112,y-3,272,y+5),fill=(151,142,123),width=2)
    # pauldrons
    for side in [-1,1]:
        cx=95 if side<0 else 289
        d.ellipse((cx-72,270,cx+72,390),fill=armor,outline=(177,164,137),width=6)
        d.arc((cx-62,282,cx+62,374),200 if side<0 else -20,340 if side<0 else 160,fill=(32,32,34),width=9)
        for rr in [14,28,42]: d.arc((cx-rr,292,cx+rr,344),180,360,fill=(133,123,104),width=3)
    # neck
    skin=spec['skin']; light=tuple(min(255,c+36) for c in skin); shadow=tuple(max(0,c-42) for c in skin)
    d.rounded_rectangle((154,225,230,305),radius=24,fill=shadow)
    # ears
    d.ellipse((88,122,135,235),fill=shadow); d.ellipse((249,122,296,235),fill=shadow)
    # face silhouette with jaw
    pts=[(116,74),(151,48),(222,47),(263,82),(275,152),(261,222),(228,268),(157,269),(119,224),(104,151)]
    d.polygon(pts,fill=skin)
    # face shading planes
    d.polygon([(116,74),(151,48),(155,247),(119,224),(104,151)],fill=shadow)
    d.polygon([(222,47),(263,82),(275,152),(261,222),(226,250),(218,80)],fill=tuple(max(0,c-18) for c in skin))
    d.polygon([(155,63),(213,58),(225,140),(206,190),(170,190),(149,136)],fill=light)
    d.polygon([(155,190),(206,190),(228,248),(190,270),(157,249)],fill=tuple(max(0,c-10) for c in skin))
    # hair mass
    hair=spec['hair']; hair_hi=tuple(min(255,c+35) for c in hair); hair_sh=tuple(max(0,c-25) for c in hair)
    style=spec['style']
    if style in ('knight','ranger'):
        d.polygon([(107,95),(123,63),(153,40),(226,40),(263,71),(276,125),(258,103),(238,75),(202,65),(168,66),(135,89),(117,139)],fill=hair)
        for i in range(18):
            x=112+i*8; y=62+int(math.sin(i*.7)*12)
            d.line((x,y,x-8,y+55),fill=hair_hi if i%3==0 else hair_sh,width=4)
    elif style=='mage':
        d.polygon([(92,102),(120,57),(158,31),(231,34),(274,71),(294,150),(282,260),(250,301),(232,224),(260,151),(240,86),(195,66),(143,72),(113,127),(126,236),(103,292),(82,234)],fill=hair)
        for i in range(16):
            x=95+i*12; d.line((x,70+(i%4)*8,x-5,245+(i%3)*18),fill=hair_hi if i%4==0 else hair_sh,width=7)
    else:
        # hood framing the face
        hood=spec.get('hood',(57,49,31))
        d.polygon([(68,111),(107,54),(159,20),(232,22),(283,64),(319,138),(297,319),(250,285),(266,210),(268,113),(226,67),(155,67),(112,114),(111,212),(135,282),(88,321)],fill=hood)
        d.line((106,82,155,54,233,55,281,91),fill=(171,155,112),width=5)
    # brows and eyes
    brow=tuple(max(0,c-15) for c in hair)
    d.polygon([(130,126),(172,119),(174,132),(133,138)],fill=brow)
    d.polygon([(210,120),(254,127),(251,139),(209,133)],fill=brow)
    eye=spec.get('eye',(113,159,177))
    for cx in [151,232]:
        d.polygon([(cx-20,145),(cx,138),(cx+18,146),(cx,154)],fill=(226,214,190))
        d.ellipse((cx-6,140,cx+6,154),fill=eye)
        d.ellipse((cx-2,143,cx+3,151),fill=(8,8,10))
        d.point((cx-2,143),fill=(245,244,225))
    # nose
    d.polygon([(188,139),(176,199),(189,210),(207,199)],fill=tuple(max(0,c-28) for c in skin))
    d.line((183,204,207,204),fill=tuple(max(0,c-48) for c in skin),width=4)
    # mouth
    d.polygon([(151,225),(188,217),(225,225),(191,240)],fill=(67,31,29))
    d.line((158,226,219,226),fill=(24,15,16),width=4)
    d.line((171,236,205,236),fill=(158,88,77),width=2)
    # beard/scars/makeup
    if spec.get('beard'):
        beard=spec['beard']
        d.polygon([(123,194),(151,236),(190,263),(229,237),(260,192),(254,255),(222,292),(157,292),(125,255)],fill=beard)
        for i in range(42):
            x=random.randint(128,252); y=random.randint(205,282)
            d.line((x,y,x+random.randint(-4,4),y+random.randint(10,25)),fill=tuple(min(255,c+25) for c in beard),width=2)
    if spec.get('scar'):
        d.line((236,134,224,178,231,206),fill=(133,49,42),width=4)
        d.line((238,134,226,177,233,206),fill=(222,139,112),width=1)
    if spec.get('runes'):
        for x,y in [(143,177),(245,174),(187,111)]:
            d.line((x-7,y,x,y-9,x+7,y),fill=(148,105,205),width=3)
    # jewelry/collar
    if style=='cleric':
        d.ellipse((175,285,209,319),outline=(211,175,82),width=7)
        d.line((192,269,192,286),fill=(211,175,82),width=5)
    elif style=='mage':
        d.ellipse((178,281,206,309),fill=(90,58,139),outline=(205,154,231),width=4)
    else:
        d.rectangle((169,274,213,292),fill=(39,40,43),outline=(164,151,126),width=4)
    # light and texture
    overlay=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(overlay)
    od.polygon([(0,0),(W*.55,0),(W*.3,H),(0,H)],fill=(255,232,193,26))
    od.polygon([(W*.65,0),(W,0),(W,H),(W*.78,H)],fill=(0,6,18,58))
    im=Image.alpha_composite(im,overlay)
    im=add_noise(im,5,spec['seed'],mono=True)
    im=im.filter(ImageFilter.UnsharpMask(2,140,2))
    # crop and pixelize
    im=im.resize((96,112),Image.Resampling.LANCZOS)
    im=quantize(im,96)
    im.save(path)

PORTRAITS={
 'daren':dict(seed=31,style='knight',skin=(139,91,66),hair=(62,53,44),beard=(58,46,37),cloth=(34,38,43),armor=(82,88,93),eye=(68,108,117),scar=True),
 'lyra':dict(seed=41,style='ranger',skin=(153,102,73),hair=(58,35,24),cloth=(34,49,37),armor=(74,84,61),eye=(64,117,72)),
 'orin':dict(seed=51,style='mage',skin=(117,82,70),hair=(36,27,47),cloth=(30,23,48),armor=(65,53,84),eye=(131,88,180),runes=True),
 'saela':dict(seed=61,style='cleric',skin=(171,117,83),hair=(113,68,38),hood=(73,64,42),cloth=(56,49,31),armor=(98,90,62),eye=(97,119,84)),
}
for k,spec in PORTRAITS.items():
    portrait_path = OUT / f'portrait-{k}.png'
    if not portrait_path.exists():
        draw_portrait(spec, portrait_path)

# HUD textures
bevel_frame(128).save(OUT/'frame-stone.png')
bevel_frame(64).save(OUT/'frame-slot.png')
make_panel('panel-obsidian.png',(128,128),'dark')

# button surface
btn=Image.new('RGBA',(192,64),(0,0,0,0)); d=ImageDraw.Draw(btn)
gradient_rect(d,(0,0,192,64),(73,64,52),(21,20,20)); d.rounded_rectangle((2,2,189,61),radius=6,outline=(186,164,124),width=3); d.rounded_rectangle((7,7,184,56),radius=4,outline=(31,28,26),width=4)
for x in [11,181]: d.ellipse((x-4,28,x+4,36),fill=(45,45,45),outline=(187,169,130))
quantize(add_noise(btn,4,77),96).save(OUT/'button.png')

# utility icons, 6 x 40
icons=Image.new('RGBA',(240,40),(0,0,0,0))
D=ImageDraw.Draw(icons)
GOLD=(225,194,128,255); STEEL=(200,210,215,255); DARK=(13,14,17,255); RED=(181,56,45,255); BLUE=(71,128,177,255)
def icon_box(x):
    D.rectangle((x,0,x+39,39),fill=(0,0,0,0))
# crossed swords
x=0
for dx in [12,25]:
    D.line((x+dx,31,x+(32 if dx==12 else 7),7),fill=DARK,width=7); D.line((x+dx,31,x+(32 if dx==12 else 7),7),fill=STEEL,width=3)
D.line((x+7,28,x+31,28),fill=GOLD,width=4)
# hand
x=40; D.rounded_rectangle((x+13,12,x+27,33),radius=5,fill=(178,126,91),outline=DARK,width=2)
for i in range(4): D.rounded_rectangle((x+8+i*6,4,x+13+i*6,20),radius=2,fill=(196,145,107),outline=DARK,width=1)
# target
x=80
for r,c in [(15,GOLD),(10,DARK),(5,RED)]: D.ellipse((x+20-r,20-r,x+20+r,20+r),outline=c,width=3)
D.line((x+20,2,x+20,38),fill=GOLD,width=2);D.line((x+2,20,x+38,20),fill=GOLD,width=2)
# map/compass
x=120; D.ellipse((x+5,5,x+35,35),outline=GOLD,width=3); D.polygon([(x+20,7),(x+25,22),(x+20,20),(x+15,22)],fill=STEEL,outline=DARK)
# rest moon
x=160; D.ellipse((x+8,5,x+32,32),fill=(205,193,148),outline=DARK,width=2); D.ellipse((x+16,2,x+36,25),fill=(0,0,0,0)); D.text((x+23,20),'Z',fill=BLUE)
# cog
x=200; D.ellipse((x+9,9,x+31,31),outline=STEEL,width=5); D.ellipse((x+17,17,x+23,23),fill=DARK)
for a in range(0,360,45):
    cx=x+20+math.cos(math.radians(a))*15; cy=20+math.sin(math.radians(a))*15
    D.rectangle((cx-3,cy-3,cx+3,cy+3),fill=STEEL)
quantize(icons,96).save(OUT/'utility-icons.png')

# The first-person weapon is built as a detailed 3D model in CinematicRenderer.

# texture generators

def save_texture(name, mode, size=128, seed=0):
    rng=np.random.default_rng(seed)
    arr=np.zeros((size,size,3),dtype=np.float32)
    yy,xx=np.mgrid[0:size,0:size]
    if mode=='grass':
        base=np.array([48,68,39]); arr[:]=base
        noise=rng.normal(0,11,(size,size,1)); arr+=noise
        for _ in range(900):
            x=rng.integers(0,size); y=rng.integers(3,size); l=rng.integers(2,9)
            c=np.array([52,87,42]) if rng.random()<.65 else np.array([93,104,55])
            for k in range(l):
                if 0<=y-k<size and 0<=x+(k//4)<size: arr[y-k,x+(k//4)]=c
    elif mode in ('stone','crypt'):
        base=np.array([82,78,71]) if mode=='stone' else np.array([42,42,47]); arr[:]=base
        arr+=rng.normal(0,10,(size,size,1))
        rh=16; bw=32
        for y in range(0,size,rh):
            arr[y:y+2,:,:]*=.35
            offset=(y//rh%2)*16
            for x in range(offset,size,bw): arr[y:y+rh,x:x+2,:]*=.35
        for _ in range(80):
            x=rng.integers(0,size-5);y=rng.integers(0,size-3);w=rng.integers(2,12)
            arr[y:y+1,x:x+w]+=rng.integers(10,30)
    elif mode=='wood':
        arr[:]=np.array([91,55,29]); arr+=rng.normal(0,8,(size,size,1))
        for x in range(0,size,16):
            arr[:,x:x+2,:]*=.35
            arr[:,x+2:x+3,:]+=22
        for _ in range(30):
            cx=rng.integers(0,size); cy=rng.integers(0,size); rr=rng.integers(2,7)
            mask=(xx-cx)**2+(yy-cy)**2<rr**2
            arr[mask]*=.45
    elif mode=='hedge':
        arr[:]=np.array([29,54,27]); arr+=rng.normal(0,13,(size,size,1))
        for _ in range(260):
            cx=rng.integers(0,size);cy=rng.integers(0,size);rr=rng.integers(2,7)
            mask=(xx-cx)**2+(yy-cy)**2<rr**2
            arr[mask]+=np.array([rng.integers(-8,18),rng.integers(4,28),rng.integers(-8,10)])
    elif mode=='rune':
        arr[:]=np.array([50,47,58]);arr+=rng.normal(0,8,(size,size,1))
        for y in range(0,size,16): arr[y:y+2]*=.4
        for y in range(8,size,32):
            for x in range(8,size,32):
                for k in range(12):
                    xx0=x+k; yy0=y+abs(6-k)
                    if yy0<size and xx0<size: arr[yy0:yy0+2,xx0:xx0+2]=[139,91,196]
    arr=np.clip(arr,0,255).astype(np.uint8)
    im=Image.fromarray(arr,'RGB').convert('RGBA')
    im=quantize(im,96)
    im.save(TEX/name)

save_texture('grass.png','grass',128,101)
save_texture('stone-floor.png','stone',128,102)
save_texture('crypt-floor.png','crypt',128,103)
save_texture('stone-wall.png','stone',128,104)
save_texture('wood-door.png','wood',128,105)
save_texture('hedge.png','hedge',128,106)
save_texture('crypt-wall.png','crypt',128,107)
save_texture('rune-wall.png','rune',128,108)

# Create a contact sheet of real production assets
preview=Image.new('RGB',(960,600),(12,12,14)); pd=ImageDraw.Draw(preview)
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
font=ImageFont.truetype(font_path,24)
small=ImageFont.truetype(font_path,16)
pd.text((24,18),'KRONIKY STŘÍBRNÉ BRÁNY — PROFESSIONAL ART PASS',font=font,fill=(223,207,170))
for i,k in enumerate(PORTRAITS):
    p=Image.open(OUT/f'portrait-{k}.png').resize((144,168),Image.Resampling.NEAREST)
    x=28+i*168;preview.paste(p,(x,64),p);pd.text((x,238),k.upper(),font=small,fill=(201,183,144))
texnames=['grass.png','stone-floor.png','crypt-floor.png','stone-wall.png','wood-door.png','rune-wall.png']
for i,n in enumerate(texnames):
    t=Image.open(TEX/n).resize((112,112),Image.Resampling.NEAREST)
    x=28+i*150;preview.paste(t,(x,315));pd.text((x,434),n.split('.')[0],font=small,fill=(190,177,147))
frame=Image.open(OUT/'frame-stone.png').resize((140,140),Image.Resampling.NEAREST);preview.paste(frame,(760,320),frame)
preview.save(ROOT/'PROFESSIONAL_ART_PREVIEW.png')
print('Generated professional visual assets')
# Rebuild icon atlas with uniform metal frame and richer contrast
src_icons = Image.open(ROOT/'assets/ui/icons.png').convert('RGBA')
new_icons = Image.new('RGBA', src_icons.size, (0,0,0,0))
for idx in range(50):
    x=(idx%10)*32; y=(idx//10)*32
    cell=src_icons.crop((x,y,x+32,y+32)).resize((128,128),Image.Resampling.NEAREST)
    bg=Image.new('RGBA',(128,128),(10,12,14,255)); bd=ImageDraw.Draw(bg)
    gradient_rect(bd,(0,0,128,128),(36,34,31),(8,9,11))
    bd.rounded_rectangle((3,3,124,124),radius=8,outline=(189,165,119),width=5)
    bd.rounded_rectangle((11,11,116,116),radius=5,outline=(37,34,30),width=7)
    # enlarge only the inner symbol by cropping original frame
    symbol=cell.crop((16,16,112,112))
    symbol=ImageEnhance.Contrast(symbol).enhance(1.25)
    symbol=ImageEnhance.Color(symbol).enhance(1.1)
    bg.alpha_composite(symbol,(16,16))
    bg=add_noise(bg,2,500+idx,mono=True)
    bg=bg.resize((32,32),Image.Resampling.LANCZOS)
    new_icons.alpha_composite(quantize(bg,96),(x,y))
new_icons.save(ROOT/'assets/ui/icons.png')
print('Rebuilt icon atlas')
