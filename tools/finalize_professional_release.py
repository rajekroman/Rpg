from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont
import math

ROOT = Path(__file__).resolve().parents[1]
PRO = ROOT / 'assets' / 'ui' / 'professional'
ICONS = ROOT / 'assets' / 'icons'
TEX = ROOT / 'assets' / 'textures' / 'professional'


def cover(img, size, center=(0.5,0.45)):
    w,h = img.size; tw,th=size
    s=max(tw/w, th/h)
    nw,nh=round(w*s),round(h*s)
    img=img.resize((nw,nh),Image.Resampling.LANCZOS)
    cx,cy=center
    left=max(0,min(nw-tw,round(nw*cx-tw/2)))
    top=max(0,min(nh-th,round(nh*cy-th/2)))
    return img.crop((left,top,left+tw,top+th))


def make_icon(size, maskable=False):
    bg=Image.open(PRO/'title-background.jpg').convert('RGB')
    # Center the ruined tower rather than the sword or house.
    bg=cover(bg,(size,size),(0.57,0.42))
    bg=ImageEnhance.Color(bg).enhance(.75)
    bg=ImageEnhance.Contrast(bg).enhance(1.16)
    bg=bg.filter(ImageFilter.GaussianBlur(max(0.3,size/900)))
    out=bg.convert('RGBA')
    # Dark vignette and readable central sigil.
    vign=Image.new('RGBA',(size,size),(0,0,0,0)); vd=ImageDraw.Draw(vign)
    for i in range(size//2,0,-4):
        t=i/(size/2)
        a=int(195*(1-t)**1.8)
        vd.ellipse((size/2-i,size/2-i,size/2+i,size/2+i),fill=(0,0,0,max(0,a)))
    # edge darkening with masks
    edge=Image.new('L',(size,size),0); ed=ImageDraw.Draw(edge)
    ed.rectangle((0,0,size-1,size-1),outline=255,width=max(12,size//12))
    edge=edge.filter(ImageFilter.GaussianBlur(size/20))
    dark=Image.new('RGBA',(size,size),(1,2,3,190)); dark.putalpha(edge)
    out=Image.alpha_composite(out,dark)
    d=ImageDraw.Draw(out)
    inset = size*.11 if not maskable else size*.18
    # weathered double frame
    d.rounded_rectangle((inset,inset,size-inset,size-inset),radius=size*.09,outline=(15,14,13,245),width=max(10,size//28))
    d.rounded_rectangle((inset+size*.018,inset+size*.018,size-inset-size*.018,size-inset-size*.018),radius=size*.075,outline=(191,160,99,255),width=max(4,size//90))
    d.rounded_rectangle((inset+size*.035,inset+size*.035,size-inset-size*.035,size-inset-size*.035),radius=size*.065,outline=(65,60,51,235),width=max(3,size//110))
    # Gate/sword sigil: adult heraldic, not a flat cartoon.
    cx=size/2; top=size*.22; bottom=size*.78
    glow=Image.new('RGBA',(size,size),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    gd.line((cx,top,cx,bottom),fill=(88,208,235,120),width=max(18,size//18))
    glow=glow.filter(ImageFilter.GaussianBlur(size/35)); out=Image.alpha_composite(out,glow); d=ImageDraw.Draw(out)
    # pointed gate arch
    arch_box=(size*.34,size*.27,size*.66,size*.76)
    d.arc(arch_box,180,360,fill=(229,213,173,255),width=max(8,size//42))
    d.line((size*.34,size*.515,size*.34,size*.76),fill=(229,213,173,255),width=max(8,size//42))
    d.line((size*.66,size*.515,size*.66,size*.76),fill=(229,213,173,255),width=max(8,size//42))
    d.line((size*.34,size*.76,size*.66,size*.76),fill=(229,213,173,255),width=max(8,size//42))
    # vertical silver blade/rift with runic cuts
    blade=[(cx-size*.025,bottom),(cx+size*.025,bottom),(cx+size*.034,top+size*.09),(cx,top),(cx-size*.034,top+size*.09)]
    d.polygon(blade,fill=(201,215,218,255),outline=(31,37,43,255))
    d.line((cx-size*.006,top+size*.05,cx-size*.006,bottom-size*.02),fill=(240,233,205,220),width=max(2,size//150))
    for y in [0.38,0.48,0.58,0.68]:
        yy=size*y
        d.line((cx-size*.017,yy,cx+size*.012,yy-size*.022,cx+size*.022,yy),fill=(47,145,173,255),width=max(2,size//160))
    # compact jewel and monogram
    r=size*.032
    d.ellipse((cx-r,bottom-r,cx+r,bottom+r),fill=(132,18,27,255),outline=(218,177,79,255),width=max(3,size//120))
    try:
        font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',max(12,round(size*.055)))
    except OSError:
        font=ImageFont.load_default()
    text='KSB'; box=d.textbbox((0,0),text,font=font); tw=box[2]-box[0]
    d.text((cx-tw/2,size*.82),text,font=font,fill=(223,204,158,255),stroke_width=max(1,size//220),stroke_fill=(12,11,10,230))
    # subtle texture/noise
    return out

for n in (512,192,180):
    img=make_icon(n,maskable=False)
    name='apple-touch-icon.png' if n==180 else f'icon-{n}.png'
    img.save(ICONS/name,optimize=True)
make_icon(512,maskable=True).save(ICONS/'icon-maskable-512.png',optimize=True)

# Final asset sheet from the curated, actually shipped assets.
W,H=1440,860
sheet=Image.new('RGB',(W,H),(7,8,10)); d=ImageDraw.Draw(sheet)
try:
    title=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',34)
    label=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',20)
except OSError:
    title=label=ImageFont.load_default()
d.text((30,24),'KRONIKY STŘÍBRNÉ BRÁNY — PROFESSIONAL VISUAL EDITION 2.0',font=title,fill=(226,210,171))
# portraits
for i,name in enumerate(('daren','lyra','orin','saela')):
    p=Image.open(PRO/f'portrait-{name}.png').convert('RGBA').resize((192,240),Image.Resampling.NEAREST)
    x=30+i*220
    # frame and panel
    d.rectangle((x-5,82,x+197,329),fill=(9,10,11),outline=(179,151,98),width=4)
    sheet.paste(p,(x,86),p)
    d.text((x,340),name.upper(),font=label,fill=(207,189,150))
# textures
texnames=('grass.png','stone-floor.png','stone-wall.png','wood-door.png','crypt-wall.png','rune-wall.png')
for i,n in enumerate(texnames):
    t=Image.open(TEX/n).convert('RGB').resize((160,160),Image.Resampling.NEAREST)
    x=30+i*225
    sheet.paste(t,(x,420))
    d.rectangle((x,420,x+159,579),outline=(177,151,104),width=3)
    d.text((x,592),n.rsplit('.',1)[0].replace('-',' ').upper(),font=label,fill=(183,169,141))
# interface materials and icon atlas
frame=Image.open(PRO/'frame-stone.png').convert('RGBA').resize((170,170),Image.Resampling.NEAREST)
panel=Image.open(PRO/'panel-obsidian.png').convert('RGBA').resize((170,170),Image.Resampling.NEAREST)
sheet.paste(frame,(35,660),frame); sheet.paste(panel,(235,660),panel)
icons=Image.open(ROOT/'assets/ui/icons.png').convert('RGBA').resize((640,320),Image.Resampling.NEAREST)
sheet.paste(icons,(445,635),icons)
app=Image.open(ICONS/'icon-512.png').convert('RGBA').resize((190,190),Image.Resampling.LANCZOS)
sheet.paste(app,(1205,645),app)
sheet.save(ROOT/'PROFESSIONAL_ASSET_SHEET.png',quality=94)
print('Final professional app icons and production asset sheet generated.')
