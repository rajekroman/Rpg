from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
W,H=1536,864
img=Image.new('RGB',(W,H),(5,6,8))
d=ImageDraw.Draw(img)
src=Image.open('/mnt/data/středověká_krajina_v_rpg_stylu.png').convert('RGB')
# environment only, slightly darker and pixel-resampled
scene=src.crop((245,0,1210,700)).resize((1280,620),Image.Resampling.LANCZOS)
scene=scene.resize((640,310),Image.Resampling.LANCZOS).resize((1280,620),Image.Resampling.NEAREST)
img.paste(scene,(256,0))
prof=ROOT/'assets/ui/professional'
frame=Image.open(prof/'frame-stone.png').convert('RGBA')
panel=Image.open(prof/'panel-obsidian.png').convert('RGBA')
icons=Image.open(ROOT/'assets/ui/icons.png').convert('RGBA')
util=Image.open(prof/'utility-icons.png').convert('RGBA')
font='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
reg='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
F=ImageFont.truetype(font,24); FS=ImageFont.truetype(font,16); FM=ImageFont.truetype(reg,18); FL=ImageFont.truetype(reg,22)
# left party column
names=['DAREN','LYRA','ORIN','SAELA']; hp=[85,70,55,60]; mp=[30,80,100,120]
for i,n in enumerate(names):
 y=i*155
 card=Image.new('RGBA',(256,155),(9,10,12,245)); cd=ImageDraw.Draw(card)
 cd.rectangle((2,2,253,152),outline=(132,119,91),width=3);cd.rectangle((8,8,247,146),outline=(40,39,37),width=4)
 p=Image.open(prof/f'portrait-{n.lower()}.png').resize((86,108),Image.Resampling.NEAREST)
 card.alpha_composite(p,(13,18));cd.rectangle((12,17,100,127),outline=(167,145,101),width=2)
 cd.text((111,18),n,font=F,fill=(231,215,176))
 def bar(y0,val,maxv,c1,c2):
  cd.rectangle((110,y0,240,y0+23),fill=(8,8,9),outline=(124,106,74),width=2)
  w=int(126*val/maxv);cd.rectangle((112,y0+2,112+w,y0+21),fill=c1)
  cd.text((151,y0+1),f'{val}/{maxv}',font=FS,fill=(246,238,217),anchor='ma')
 bar(62,hp[i],85 if i==0 else [70,55,60][i-1],(151,28,31),(0,0,0))
 bar(94,mp[i],mp[i],(34,70,147),(0,0,0))
 img.paste(card,(0,y),card)
# bottom HUD background
d.rectangle((0,620,W,H),fill=(7,8,10));d.rectangle((0,620,W,625),fill=(124,113,88));d.rectangle((0,626,W,631),fill=(26,26,27))
# minimap block
map_crop=src.crop((10,700,275,1045)).resize((250,224),Image.Resampling.LANCZOS)
img.paste(map_crop,(0,632))
# utility column
ux=252
for i in range(6):
 y=632+i*37
 d.rectangle((ux,y,ux+54,y+34),fill=(14,15,17),outline=(111,96,70),width=2)
 ico=util.crop((i*40,0,i*40+40,40)).resize((30,30),Image.Resampling.NEAREST)
 img.paste(ico,(ux+12,y+2),ico)
# log panel
lx=310; ly=632; lw=890; lh=224
d.rectangle((lx,ly,lx+lw,ly+lh),fill=(9,10,12),outline=(114,101,77),width=4)
d.text((lx+18,ly+15),'OZVĚNA ZHASLÉ BRÁNY',font=FS,fill=(222,192,116))
lines=[('Přijmi od Eliry úkol prozkoumat zhaslé mezníky',(191,180,151)),('V dálce se mezi věžemi pohybuje ozvěna.',(214,203,176)),('Lyra: Stopy jsou čerstvé. Něco nás sleduje.',(164,134,204)),('Daren: Držte formaci. K bráně půjdeme společně.',(214,178,101)),('Hra uložena.',(109,190,83))]
y=ly+48
for t,c in lines:d.text((lx+18,y),t,font=FM,fill=c);y+=25
# hotbar
for i in range(8):
 x=lx+18+i*73;y=ly+169
 d.rectangle((x,y,x+64,y+48),fill=(11,12,14),outline=(126,109,75),width=2)
 icon=icons.crop(((34+i)%10*32,(34+i)//10*32,(34+i)%10*32+32,(34+i)//10*32+32)).resize((42,42),Image.Resampling.NEAREST)
 img.paste(icon,(x+11,y+3),icon);d.text((x+3,y+31),str(i+1),font=FS,fill=(237,221,179))
# quick inventory
qx=1206;qy=632
d.rectangle((qx,qy,W-4,H-8),fill=(9,10,12),outline=(114,101,77),width=4)
for i in range(9):
 x=qx+15+(i%3)*102;y=qy+13+(i//3)*68
 d.rectangle((x,y,x+88,y+58),fill=(12,13,15),outline=(123,105,75),width=2)
 if i<7:
  icon=icons.crop((i*32,0,i*32+32,32)).resize((48,48),Image.Resampling.NEAREST);img.paste(icon,(x+20,y+5),icon)
# sword foreground from original image, clipped crop
sword=src.crop((1245,0,1448,720)).resize((200,710),Image.Resampling.LANCZOS)
# simple mask around sword region
mask=Image.new('L',sword.size,0);md=ImageDraw.Draw(mask);md.polygon([(75,0),(150,0),(154,520),(194,604),(178,619),(52,619),(18,603),(58,530)],fill=255);md.rectangle((0,620,200,710),fill=0);mask=mask.filter(ImageFilter.GaussianBlur(1))
img.paste(sword,(W-200,0),mask)
# label
D=ImageDraw.Draw(img);D.text((W-18,18),'PROFESSIONAL VISUAL EDITION 2.0',font=FS,fill=(235,218,178),anchor='ra')
img.save(ROOT/'PROFESSIONAL_FINAL_PREVIEW.png',quality=95)
print('preview generated')
