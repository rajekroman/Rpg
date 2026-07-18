from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math, random

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/ui/icons.png'
S=128
CELL=32
COLS=10
ROWS=5

ITEMS=[
  'iron-longsword','silver-watch-blade','ashwood-bow','echo-string-bow',
  'apprentice-staff','resonance-staff','silver-mace','silent-bell-mace',
  'oak-buckler','watch-shield','chain-hauberk','rangers-leathers',
  'archivist-robes','bell-vestments','iron-cap','seers-circlet',
  'trail-boots','ring-of-clear-thought','amulet-of-the-gate',
  'minor-healing-potion','greater-healing-potion','mana-tonic','moonleaf-tonic','antidote',
  'travel-ration','moonleaf','silver-dust','wolf-pelt','old-silver-brooch',
  'silver-fragment','lost-satchel','eliras-seal','crypt-warden-key','mirror-silver',
]
ABILITIES=[
  'powerStrike','shieldBash','rally','guardianStance',
  'aimedShot','pinningShot','volley','fieldDressing',
  'emberBolt','frostShard','chainLightning','fireNova',
  'mend','guardianWard','cleanse','resurrection',
]

# restrained mature palette
INK=(6,7,9,255); DEEP=(12,13,16,255); STEEL=(166,177,181,255); HIGHLIGHT=(226,226,210,255)
DARK_STEEL=(62,69,75,255); GOLD=(178,136,66,255); GOLD_HI=(230,193,112,255); BRONZE=(116,73,38,255)
LEATHER=(82,46,27,255); WOOD=(96,58,30,255); RED=(148,31,34,255); BLUE=(36,86,151,255)
GREEN=(55,103,62,255); VIOLET=(92,50,126,255); BONE=(190,180,153,255); WHITE=(220,215,198,255)


def line(d, pts, fill, width, shadow=True):
    if shadow:
        off=[(x+3,y+4) for x,y in pts]; d.line(off,fill=(0,0,0,170),width=width+5,joint='curve')
    d.line(pts,fill=fill,width=width,joint='curve')


def poly(d, pts, fill, outline=INK, width=4):
    d.polygon(pts,fill=fill)
    if outline: d.line(pts+[pts[0]],fill=outline,width=width,joint='curve')


def frame(seed):
    rng=random.Random(seed)
    im=Image.new('RGBA',(S,S),DEEP); d=ImageDraw.Draw(im)
    # inner obsidian with directional light
    for y in range(S):
        t=y/(S-1); c=int(22-12*t)
        d.line((0,y,S,y),fill=(c+2,c+1,c,255))
    # frame
    d.rounded_rectangle((2,2,125,125),radius=9,outline=(22,20,18),width=8)
    d.rounded_rectangle((5,5,122,122),radius=7,outline=GOLD,width=4)
    d.rounded_rectangle((11,11,116,116),radius=4,outline=(53,48,41),width=7)
    d.rounded_rectangle((16,16,111,111),radius=2,outline=(111,94,67),width=2)
    # etched scratches, low contrast
    for _ in range(12):
        x=rng.randrange(15,112); y=rng.randrange(15,112)
        if rng.random()<.5: d.line((x,y,min(112,x+rng.randrange(3,13)),y+rng.choice([-1,0,1])),fill=(92,79,60,70),width=1)
    return im,d


def sword(d, silver=False, rune=False):
    blade=HIGHLIGHT if silver else STEEL
    poly(d,[(55,96),(69,96),(76,35),(64,17),(51,36)],blade)
    d.polygon([(61,88),(67,88),(71,37),(64,24),(62,87)],fill=(236,236,219,150))
    d.polygon([(55,88),(61,88),(62,30),(54,39)],fill=DARK_STEEL)
    if rune:
        for y in (44,58,72): line(d,[(60,y),(65,y-5),(69,y)],(53,154,184,255),3,False)
    poly(d,[(34,88),(54,83),(64,90),(75,83),(96,89),(89,100),(71,97),(64,106),(56,98),(40,100)],GOLD,width=3)
    d.rounded_rectangle((59,98,69,121),radius=3,fill=LEATHER,outline=INK,width=3)


def bow(d, spectral=False):
    c=(164,188,202,255) if spectral else (122,76,38,255)
    # layered limbs
    line(d,[(37,104),(28,83),(30,57),(44,31),(61,18)],c,9)
    line(d,[(91,104),(100,83),(98,57),(84,31),(67,18)],c,9)
    string=(89,199,228,255) if spectral else BONE
    line(d,[(61,18),(64,64),(37,104)],string,2,False)
    line(d,[(67,18),(64,64),(91,104)],string,2,False)
    # arrow
    line(d,[(24,66),(100,63)],STEEL,4)
    poly(d,[(100,63),(88,55),(90,70)],HIGHLIGHT,width=2)


def staff(d, arcane=False):
    line(d,[(43,112),(67,36)],WOOD,10)
    line(d,[(46,112),(70,37)],(142,91,47,255),3,False)
    if arcane:
        d.ellipse((52,14,91,52),fill=(33,15,49,255),outline=GOLD,width=4)
        d.ellipse((59,21,84,46),fill=(111,59,155,255),outline=(207,163,227,255),width=3)
        line(d,[(66,27),(76,40),(83,25)],(224,187,245,255),3,False)
    else:
        poly(d,[(52,38),(63,18),(80,19),(91,38),(72,53)],(74,105,119,255),width=3)
        d.ellipse((63,25,78,40),fill=(119,183,201,255))


def mace(d, bell=False):
    line(d,[(45,111),(68,57)],WOOD,10)
    if bell:
        poly(d,[(51,57),(47,40),(56,23),(79,20),(91,35),(86,55),(72,66)],(96,92,84,255),width=4)
        d.arc((56,26,85,56),0,180,fill=GOLD_HI,width=3)
        d.ellipse((67,52,76,62),fill=GOLD)
    else:
        d.ellipse((48,23,88,63),fill=DARK_STEEL,outline=INK,width=5)
        for a in range(0,360,45):
            cx=68+math.cos(math.radians(a))*23; cy=43+math.sin(math.radians(a))*23
            poly(d,[(cx-4,cy-4),(cx+3,cy-4),(cx+7,cy+4),(cx-6,cy+5)],STEEL,width=2)
        d.ellipse((58,33,78,53),fill=(101,108,111),outline=(207,212,207),width=2)


def shield(d, watch=False):
    fill=(52,75,91,255) if watch else (89,67,39,255)
    poly(d,[(31,25),(97,25),(94,72),(64,108),(34,72)],fill,width=5)
    d.line((64,28,64,99),fill=GOLD_HI,width=5)
    d.line((38,47,90,47),fill=(196,182,151),width=4)
    if watch:
        d.polygon([(64,36),(78,64),(64,86),(50,64)],fill=(64,135,164),outline=HIGHLIGHT)
    else:
        d.ellipse((53,51,75,73),fill=BRONZE,outline=GOLD_HI,width=3)


def armor(d, leather=False, robe=False):
    if robe:
        poly(d,[(46,19),(82,19),(91,41),(85,111),(64,101),(43,111),(37,42)],(47,35,63,255),width=4)
        d.line((64,24,64,99),fill=(141,110,166),width=4)
        d.arc((45,27,83,61),180,360,fill=GOLD_HI,width=3)
    else:
        base=LEATHER if leather else (85,92,96,255)
        poly(d,[(42,25),(54,17),(74,17),(87,25),(100,43),(89,61),(84,107),(44,107),(39,61),(28,44)],base,width=5)
        if leather:
            for y in (45,62,80): d.line((44,y,84,y+2),fill=(146,94,53),width=3)
            for x in (52,76): d.ellipse((x,45,x+5,50),fill=GOLD)
        else:
            for y in (39,52,65,78,91): d.arc((43,y-7,85,y+10),0,180,fill=(184,190,184),width=3)


def helm(d,circlet=False):
    if circlet:
        d.arc((28,34,100,100),180,360,fill=GOLD_HI,width=9)
        poly(d,[(64,38),(74,53),(64,66),(54,53)],(86,148,171,255),width=3)
        d.ellipse((57,46,71,60),fill=(120,211,229),outline=HIGHLIGHT,width=2)
    else:
        poly(d,[(35,95),(31,55),(43,27),(64,18),(86,28),(97,57),(92,95)],(75,82,88,255),width=5)
        d.line((64,21,64,94),fill=(184,190,188),width=4)
        d.rectangle((36,55,92,68),fill=(21,23,27),outline=INK,width=3)
        for x in range(42,90,10): d.line((x,57,x,67),fill=(132,139,141),width=2)


def boots(d):
    for off in (0,42):
        poly(d,[(25+off,25),(50+off,25),(48+off,79),(61+off,94),(58+off,109),(24+off,109),(18+off,94),(27+off,77)],LEATHER,width=4)
        for y in (43,58,73): d.line((25+off,y,48+off,y),fill=(145,90,51),width=3)


def jewelry(d,kind):
    if kind=='ring':
        d.ellipse((29,29,99,99),outline=GOLD_HI,width=13)
        d.ellipse((48,48,80,80),fill=DEEP,outline=(74,50,22),width=3)
        poly(d,[(64,15),(77,33),(64,46),(51,33)],(72,144,171,255),width=3)
    else:
        line(d,[(36,22),(64,89),(92,22)],GOLD,5,False)
        poly(d,[(64,48),(82,70),(64,102),(46,70)],(40,99,122,255),width=4)
        d.line((64,56,64,91),fill=(123,208,222),width=3)


def potion(d,color,size='small'):
    w=34 if size=='small' else 44
    x0=64-w//2; x1=64+w//2
    d.rounded_rectangle((x0,46,x1,108),radius=10,fill=(28,27,27),outline=INK,width=5)
    d.rectangle((x0+5,65,x1-5,101),fill=color)
    d.polygon([(x0+6,69),(x0+12,58),(x1-10,59),(x1-6,70)],fill=tuple(min(255,c+45) for c in color[:3])+(255,))
    d.rectangle((51,29,77,52),fill=(104,75,43),outline=INK,width=4)
    d.rectangle((49,24,79,34),fill=(168,128,75),outline=INK,width=3)
    d.line((x0+10,73,x0+10,96),fill=(255,255,255,75),width=3)


def ration(d):
    d.ellipse((22,46,105,103),fill=(121,70,35),outline=INK,width=5)
    d.ellipse((30,38,98,91),fill=(187,127,66),outline=(92,50,29),width=4)
    for x in (47,65,82): d.arc((x-14,45,x+14,77),210,330,fill=(229,177,104),width=4)


def leaf(d):
    line(d,[(63,107),(65,29)],(87,123,58),5)
    for side,y in [(-1,45),(1,54),(-1,65),(1,75),(-1,87)]:
        poly(d,[(64,y),(64+side*28,y-15),(64+side*20,y+8)],(63,126,68,255),width=3)
        d.line((64,y,64+side*22,y-8),fill=(132,175,89),width=2)


def dust(d):
    rng=random.Random(26)
    for _ in range(30):
        x=rng.randrange(28,101); y=rng.randrange(30,103); r=rng.choice([2,3,4])
        d.polygon([(x,y-r),(x+r,y),(x,y+r),(x-r,y)],fill=rng.choice([STEEL,HIGHLIGHT,(104,164,187,255)]))


def pelt(d):
    poly(d,[(29,26),(47,18),(64,31),(82,17),(100,28),(91,48),(99,72),(85,107),(64,95),(43,108),(29,71),(38,49)],(80,72,61,255),width=4)
    for x,y in [(45,42),(71,35),(57,62),(81,72),(44,86)]: d.line((x,y,x+12,y+8),fill=(137,125,103),width=4)


def brooch(d):
    d.ellipse((29,29,99,99),fill=(47,55,63),outline=STEEL,width=7)
    for a in range(0,360,45):
        x=64+math.cos(math.radians(a))*25; y=64+math.sin(math.radians(a))*25
        d.ellipse((x-4,y-4,x+4,y+4),fill=GOLD_HI)
    poly(d,[(64,36),(79,64),(64,91),(49,64)],(66,133,151,255),width=3)


def crystal(d,mirror=False):
    if mirror:
        poly(d,[(40,24),(83,18),(101,49),(87,105),(44,111),(26,72)],(126,154,169,255),width=5)
        d.polygon([(46,31),(77,26),(89,49),(58,92),(37,70)],fill=(195,217,220,180))
        d.line((47,37,82,89),fill=(230,235,222),width=3)
    else:
        poly(d,[(64,16),(93,45),(83,99),(50,113),(31,72),(42,37)],(72,131,166,255),width=4)
        d.polygon([(64,21),(70,91),(48,102),(38,70)],fill=(147,202,217,170))


def satchel(d):
    d.rounded_rectangle((24,45,104,108),radius=10,fill=LEATHER,outline=INK,width=5)
    d.arc((36,20,92,72),180,360,fill=(150,96,56),width=8)
    d.rectangle((30,50,98,65),fill=(112,65,36),outline=INK,width=3)
    d.rectangle((56,60,72,80),fill=GOLD,outline=INK,width=3)


def seal(d):
    d.ellipse((29,22,99,92),fill=(132,24,31),outline=GOLD_HI,width=5)
    d.polygon([(43,79),(48,116),(64,101),(79,116),(85,79)],fill=(114,20,29),outline=INK)
    d.line((46,57,82,57),fill=(229,187,103),width=4)
    d.line((64,40,64,75),fill=(229,187,103),width=4)


def key(d):
    d.ellipse((23,24,62,63),outline=GOLD_HI,width=10)
    line(d,[(54,57),(100,103)],GOLD_HI,10)
    d.line((86,89,103,72),fill=GOLD_HI,width=8)
    d.line((94,98,110,83),fill=GOLD_HI,width=8)


def ability(d,name):
    # mature heraldic/arcane symbols rather than toy blobs
    if name=='powerStrike':
        sword(d,False,False); line(d,[(29,92),(98,35)],(184,42,36,255),8)
    elif name=='shieldBash':
        shield(d,True); d.ellipse((79,22,112,55),outline=HIGHLIGHT,width=5); line(d,[(90,44),(111,24)],HIGHLIGHT,4,False)
    elif name=='rally':
        line(d,[(42,110),(42,24)],WOOD,7); poly(d,[(44,28),(99,38),(80,67),(44,59)],(121,29,33,255),width=4); d.line((55,42,84,47),fill=GOLD_HI,width=4)
    elif name=='guardianStance':
        shield(d,False); line(d,[(26,102),(102,26)],STEEL,5); line(d,[(26,26),(102,102)],STEEL,5)
    elif name=='aimedShot':
        d.ellipse((22,22,106,106),outline=GOLD_HI,width=5); d.ellipse((43,43,85,85),outline=(115,37,38),width=5); line(d,[(17,64),(111,64)],STEEL,5); poly(d,[(111,64),(96,54),(96,74)],HIGHLIGHT,width=2)
    elif name=='pinningShot':
        line(d,[(21,31),(105,95)],STEEL,5); poly(d,[(105,95),(88,91),(98,78)],HIGHLIGHT,width=2); d.line((39,86,91,86),fill=GOLD,width=6)
    elif name=='volley':
        for off in (-14,0,14): line(d,[(27+off,103),(80+off,27)],STEEL,4); poly(d,[(80+off,27),(67+off,38),(84+off,42)],HIGHLIGHT,width=2)
    elif name=='fieldDressing':
        d.rounded_rectangle((28,45,100,84),radius=10,fill=BONE,outline=INK,width=4); d.line((34,52,94,78),fill=(119,83,55),width=5); d.line((34,78,94,52),fill=(119,83,55),width=5); d.rectangle((56,30,72,101),fill=(143,31,33))
    elif name=='emberBolt':
        poly(d,[(26,91),(44,42),(61,64),(70,20),(101,55),(90,96),(62,111)],(150,38,23,255),width=4); poly(d,[(48,91),(60,58),(70,76),(82,52),(84,91),(66,101)],(232,148,48,255),width=2)
    elif name=='frostShard':
        poly(d,[(64,13),(82,47),(104,62),(78,77),(64,113),(49,79),(23,63),(47,48)],(88,151,188,255),width=4); d.line((64,23,64,102),fill=(212,234,236),width=4); d.line((32,63,96,63),fill=(195,225,233),width=3)
    elif name=='chainLightning':
        poly(d,[(77,13),(39,62),(61,62),(42,112),(96,53),(72,53)],(92,158,215,255),width=4); line(d,[(28,34),(46,46),(34,58)],(179,215,239,255),3,False); line(d,[(92,80),(108,91),(96,104)],(179,215,239,255),3,False)
    elif name=='fireNova':
        d.ellipse((34,34,94,94),outline=(226,141,47),width=10); d.ellipse((47,47,81,81),fill=(117,24,18),outline=GOLD_HI,width=3); 
        for a in range(0,360,45):
            x1=64+math.cos(math.radians(a))*39; y1=64+math.sin(math.radians(a))*39; x2=64+math.cos(math.radians(a))*54; y2=64+math.sin(math.radians(a))*54
            line(d,[(x1,y1),(x2,y2)],(184,47,28,255),6,False)
    elif name=='mend':
        d.ellipse((35,35,93,93),fill=(39,78,50),outline=GOLD_HI,width=5); d.rectangle((57,24,71,104),fill=(220,202,143)); d.rectangle((24,57,104,71),fill=(220,202,143)); d.ellipse((48,48,80,80),outline=(238,222,161),width=3)
    elif name=='guardianWard':
        shield(d,True); d.arc((42,42,86,86),0,360,fill=(121,202,218),width=5); d.line((64,40,64,88),fill=(184,229,235),width=3)
    elif name=='cleanse':
        poly(d,[(64,18),(94,58),(84,101),(64,112),(43,101),(33,58)],(68,124,159,255),width=4); d.line((43,79,57,92,86,47),fill=(228,225,204),width=6,joint='curve')
    elif name=='resurrection':
        d.ellipse((28,28,100,100),outline=GOLD_HI,width=7); d.ellipse((54,37,74,57),fill=WHITE); d.polygon([(64,56),(43,93),(85,93)],fill=WHITE); d.line((64,15,64,31),fill=GOLD_HI,width=5); d.line((23,64,39,64),fill=GOLD_HI,width=5); d.line((89,64,105,64),fill=GOLD_HI,width=5)


def item(d,name):
    if name=='iron-longsword': sword(d,False,False)
    elif name=='silver-watch-blade': sword(d,True,True)
    elif name=='ashwood-bow': bow(d,False)
    elif name=='echo-string-bow': bow(d,True)
    elif name=='apprentice-staff': staff(d,False)
    elif name=='resonance-staff': staff(d,True)
    elif name=='silver-mace': mace(d,False)
    elif name=='silent-bell-mace': mace(d,True)
    elif name=='oak-buckler': shield(d,False)
    elif name=='watch-shield': shield(d,True)
    elif name=='chain-hauberk': armor(d,False,False)
    elif name=='rangers-leathers': armor(d,True,False)
    elif name=='archivist-robes': armor(d,False,True)
    elif name=='bell-vestments': armor(d,False,True); d.ellipse((54,54,74,74),outline=GOLD_HI,width=4)
    elif name=='iron-cap': helm(d,False)
    elif name=='seers-circlet': helm(d,True)
    elif name=='trail-boots': boots(d)
    elif name=='ring-of-clear-thought': jewelry(d,'ring')
    elif name=='amulet-of-the-gate': jewelry(d,'amulet')
    elif name=='minor-healing-potion': potion(d,RED,'small')
    elif name=='greater-healing-potion': potion(d,(182,48,41,255),'large')
    elif name=='mana-tonic': potion(d,BLUE,'small')
    elif name=='moonleaf-tonic': potion(d,GREEN,'small')
    elif name=='antidote': potion(d,(116,128,57,255),'small')
    elif name=='travel-ration': ration(d)
    elif name=='moonleaf': leaf(d)
    elif name=='silver-dust': dust(d)
    elif name=='wolf-pelt': pelt(d)
    elif name=='old-silver-brooch': brooch(d)
    elif name=='silver-fragment': crystal(d,False)
    elif name=='lost-satchel': satchel(d)
    elif name=='eliras-seal': seal(d)
    elif name=='crypt-warden-key': key(d)
    elif name=='mirror-silver': crystal(d,True)

atlas=Image.new('RGBA',(COLS*CELL,ROWS*CELL),(0,0,0,0))
for idx,name in enumerate(ITEMS+ABILITIES):
    im,d=frame(idx+971)
    if idx < len(ITEMS): item(d,name)
    else: ability(d,name)
    # subtle highlight and pixel-friendly controlled reduction
    im=im.filter(ImageFilter.UnsharpMask(radius=1.2,percent=115,threshold=2))
    im=im.resize((CELL,CELL),Image.Resampling.LANCZOS)
    # Quantize but retain alpha and sophisticated palette from adaptive image.
    alpha=im.getchannel('A')
    q=im.convert('RGB').quantize(colors=96,dither=Image.Dither.FLOYDSTEINBERG).convert('RGBA')
    q.putalpha(alpha)
    atlas.alpha_composite(q,((idx%COLS)*CELL,(idx//COLS)*CELL))
atlas.save(OUT,optimize=True)
print(f'Generated {len(ITEMS)+len(ABILITIES)} professional item and ability icons: {OUT}')
