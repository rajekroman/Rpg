#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from random import Random
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
FRAME = 64
rng = Random(41709)


def save(img: Image.Image, relative: str) -> None:
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)


def px(draw: ImageDraw.ImageDraw, x, y, w, h, color):
    draw.rectangle((x, y, x + w - 1, y + h - 1), fill=color)


def outline(draw, box, fill, edge="#15120f", width=2):
    x0, y0, x1, y1 = box
    draw.rectangle(box, fill=edge)
    draw.rectangle((x0 + width, y0 + width, x1 - width, y1 - width), fill=fill)


def dither(draw, box, colors, density=0.16, seed=0):
    local = Random(seed)
    x0, y0, x1, y1 = box
    for y in range(y0, y1 + 1, 2):
        for x in range(x0, x1 + 1, 2):
            if local.random() < density:
                draw.point((x, y), fill=local.choice(colors))


def wall_stone(draw):
    draw.rectangle((0, 0, 63, 63), fill="#635e55")
    for row, y in enumerate(range(0, 64, 12)):
        offset = -8 if row % 2 else 0
        for x in range(offset, 64, 16):
            c = rng.choice(["#777066", "#6d675e", "#81786b"])
            draw.rectangle((x + 1, y + 1, x + 15, y + 11), fill=c)
            draw.line((x, y, x + 16, y), fill="#292724")
            draw.line((x, y, x, y + 12), fill="#292724")
            if rng.random() < .35:
                draw.line((x + 4, y + 4, x + 10, y + 6), fill="#4e4a44")
    dither(draw, (0, 0, 63, 63), ["#8a8174", "#4e4a44"], .12, 11)


def wall_wood(draw):
    draw.rectangle((0, 0, 63, 63), fill="#5a3e25")
    for x in range(0, 64, 8):
        draw.rectangle((x, 0, x + 6, 63), fill=rng.choice(["#6f4b2c", "#795632", "#654326"]))
        draw.line((x + 7, 0, x + 7, 63), fill="#291a11")
        for y in range((x * 3) % 11, 64, 17):
            draw.line((x + 1, y, x + 5, y + 2), fill="#402817")
    draw.rectangle((29, 0, 34, 63), fill="#302016")
    for y in (10, 31, 52):
        draw.rectangle((0, y, 63, y + 2), fill="#2a1b12")
    draw.ellipse((30, 29, 35, 34), fill="#c49a52")


def wall_forest(draw):
    draw.rectangle((0, 0, 63, 63), fill="#263823")
    for i in range(85):
        x, y = rng.randrange(64), rng.randrange(64)
        s = rng.choice([3, 4, 5, 6])
        c = rng.choice(["#31482a", "#3e5c33", "#4e6c3a", "#1f3020"])
        draw.rectangle((x, y, min(63, x+s), min(63, y+s)), fill=c)
    for x in range(2, 64, 14):
        draw.line((x, 64, x+5, 13), fill="#442f20", width=3)
        draw.polygon([(x-8, 29), (x+4, 5), (x+15, 30)], fill="#284128")
        draw.polygon([(x-10, 45), (x+4, 18), (x+18, 46)], fill="#365635")


def wall_crypt(draw):
    draw.rectangle((0, 0, 63, 63), fill="#353238")
    for row, y in enumerate(range(0, 64, 10)):
        offset = -9 if row % 2 else 0
        for x in range(offset, 64, 18):
            draw.rectangle((x+1, y+1, x+17, y+9), fill=rng.choice(["#47434b", "#504a54", "#403d44"]))
            draw.line((x, y, x+18, y), fill="#1b1a1d")
            draw.line((x, y, x, y+10), fill="#1b1a1d")
    for _ in range(18):
        x, y = rng.randrange(64), rng.randrange(64)
        draw.point((x, y), fill="#71617d")
        if rng.random() < .4: draw.point((min(63,x+1),y), fill="#8b7396")


def wall_rune(draw):
    draw.rectangle((0, 0, 63, 63), fill="#24202d")
    draw.rectangle((2, 2, 61, 61), outline="#5d496c", width=2)
    for y in range(8, 64, 16):
        draw.arc((18, y-6, 46, y+13), 195, 345, fill="#8b6ba0", width=2)
        draw.line((31, y-4, 31, y+9), fill="#b595c7", width=2)
        draw.line((24, y+3, 38, y+3), fill="#6f5681", width=2)
    dither(draw, (0,0,63,63), ["#392e46", "#695179"], .18, 55)


def make_texture_atlas():
    img = Image.new("RGB", (FRAME*5, FRAME), "black")
    funcs = [wall_stone, wall_wood, wall_forest, wall_crypt, wall_rune]
    for i, fn in enumerate(funcs):
        tile = Image.new("RGB", (FRAME, FRAME), "black")
        fn(ImageDraw.Draw(tile))
        img.paste(tile, (i*FRAME, 0))
    save(img, "assets/textures/walls.png")


def floor_grass(draw):
    draw.rectangle((0,0,63,63), fill="#34442b")
    for _ in range(190):
        x,y=rng.randrange(64),rng.randrange(64)
        c=rng.choice(["#405437", "#52613a", "#2a3826", "#6b6b3d"])
        draw.point((x,y), fill=c)
        if rng.random()<.25 and y>1: draw.point((x,y-1), fill=c)
    for _ in range(8):
        x,y=rng.randrange(64),rng.randrange(64)
        draw.point((x,y), fill=rng.choice(["#a788b7", "#d1b969", "#7e99be"]))


def floor_stone(draw):
    draw.rectangle((0,0,63,63), fill="#514f48")
    for y in range(0,64,16):
        for x in range(0,64,16):
            draw.rectangle((x+1,y+1,x+14,y+14), fill=rng.choice(["#5c5951", "#656159", "#4b4944"]))
            draw.line((x,y,x+16,y), fill="#292824")
            draw.line((x,y,x,y+16), fill="#292824")
    dither(draw,(0,0,63,63),["#747066", "#403e39"],.10,77)


def floor_crypt(draw):
    draw.rectangle((0,0,63,63), fill="#262429")
    for y in range(0,64,12):
        for x in range((y//12%2)*6-6,64,12):
            draw.rectangle((x+1,y+1,x+11,y+11), fill=rng.choice(["#302e34", "#39363d", "#28272c"]))
            draw.line((x,y,x+12,y), fill="#171619")
            draw.line((x,y,x,y+12), fill="#171619")
    for _ in range(16):
        x,y=rng.randrange(64),rng.randrange(64)
        draw.line((x,y,min(63,x+rng.randrange(2,7)),min(63,y+rng.randrange(1,4))), fill="#514558")


def make_floor_atlas():
    img=Image.new("RGB",(FRAME*3,FRAME),"black")
    for i,fn in enumerate([floor_grass,floor_stone,floor_crypt]):
        tile=Image.new("RGB",(FRAME,FRAME),"black"); fn(ImageDraw.Draw(tile)); img.paste(tile,(i*FRAME,0))
    save(img,"assets/textures/floors.png")


def canvas():
    return Image.new("RGBA", (FRAME, FRAME), (0,0,0,0))


def shadow(d, x0=12, x1=52, y=57):
    d.ellipse((x0,y,x1,y+4), fill=(0,0,0,95))


def world_sprite(kind, frame):
    im=canvas(); d=ImageDraw.Draw(im); bob=[0,-1,0,1][frame%4]
    if kind=="npc":
        shadow(d,15,49); outline(d,(20,7+bob,43,26+bob),"#c79d75","#291d17",2); px(d,21,4+bob,22,7,"#59412d")
        px(d,16,25+bob,31,25,"#304d67"); px(d,10,28+bob,8,23,"#253b50"); px(d,45,28+bob,8,23,"#253b50")
        px(d,18,49+bob,10,12,"#251f1b"); px(d,36,49+bob,10,12,"#251f1b")
        px(d,26,15+bob,4,3,"#16110d"); px(d,35,15+bob,4,3,"#16110d"); px(d,27,31+bob,12,4,"#b49a5f")
    elif kind=="obelisk":
        shadow(d,13,51); d.polygon([(32,3),(44,15),(41,52),(22,52),(19,15)], fill="#858b8d", outline="#34383b")
        d.polygon([(32,8),(38,17),(36,47),(27,47),(25,17)], fill="#aab0af")
        glow="#d5f8ff" if frame%2 else "#7ed2e8"; d.polygon([(32,20),(38,31),(32,43),(26,31)], fill=glow, outline="#3f778b")
        px(d,15,52,34,7,"#3b3e40")
    elif kind=="sign":
        shadow(d,16,49); sway=[-1,0,1,0][frame]; px(d,29,18,6,43,"#4b301c"); outline(d,(7+sway,10,56+sway,28),"#91643a","#322116",2)
        px(d,12+sway,15,37,3,"#5b3b23"); px(d,18+sway,21,25,2,"#c39a5f")
    elif kind=="torch":
        shadow(d,24,41); px(d,29,25,6,36,"#5b381e"); px(d,26,27,12,5,"#2f1d12")
        colors=[("#f06a23","#ffd15c","#fff4ad"),("#f2a22b","#ffe170","#fff7c7"),("#e95a20","#ffc342","#fff0a1"),("#ffb134","#ffe98b","#fffad9")][frame]
        d.polygon([(32,4),(42,22),(35,28),(23,22)],fill=colors[0]); d.polygon([(32,8),(38,21),(32,25),(27,20)],fill=colors[1]); px(d,30,12,5,10,colors[2])
    elif kind=="fragment":
        shadow(d,17,47); shift=[0,-2,-1,-2][frame]
        d.polygon([(32,10+shift),(44,29+shift),(36,52+shift),(20,47+shift),(18,26+shift)], fill="#4ca7cf", outline="#1d526b")
        d.polygon([(31,14+shift),(36,29+shift),(31,45+shift),(24,40+shift),(23,27+shift)], fill="#c3f5ff")
        for p in [(15,18),(49,28),(14,43)]: px(d,p[0],p[1]+shift,3,3,"#dffbff")
    elif kind=="satchel":
        shadow(d,13,51); outline(d,(14,27+bob,49,54+bob),"#704528","#2b1c13",2); outline(d,(20,21+bob,43,31+bob),"#90603a","#3d2819",2)
        px(d,28,35+bob,9,9,"#c59c55"); px(d,31,38+bob,3,4,"#49351e")
    elif kind=="herb":
        shadow(d,18,47); px(d,31,32,3,27,"#35542d")
        colors=["#5f86b0","#739bc1","#86acd0","#6c91ba"]
        d.ellipse((16,26+bob,34,39+bob),fill=colors[frame]); d.ellipse((31,21-bob,50,36-bob),fill=colors[(frame+1)%4]); d.ellipse((21,39,39,50),fill="#759fbf")
        for x,y in [(24,31),(40,27),(29,44)]: px(d,x,y,2,2,"#d4e8f5")
    elif kind=="key":
        shadow(d,20,45); angle_shift=[0,1,0,-1][frame]; d.ellipse((20,15+angle_shift,41,36+angle_shift),fill="#d1b35f",outline="#654c20",width=2); d.ellipse((26,21+angle_shift,35,30+angle_shift),fill=(0,0,0,0),outline="#59451f",width=2)
        px(d,29,33+angle_shift,5,25,"#b08c3e"); px(d,33,47+angle_shift,13,5,"#b08c3e"); px(d,39,43+angle_shift,5,9,"#b08c3e")
    elif kind=="lever":
        shadow(d,17,48); outline(d,(21,38,43,58),"#45413e","#201f1d",2); angle=[-5,0,5,0][frame]
        d.line((32,41,32+angle,14),fill="#9b7140",width=5); d.ellipse((24+angle,8,40+angle,22),fill="#bc8a4b",outline="#4c3420",width=2)
    elif kind=="trap":
        shadow(d,10,54); outline(d,(10,47,54,57),"#4a4440","#24211f",2); px(d,16,44,32,4,"#8e6b58");
        if frame%2: d.polygon([(24,44),(32,31),(40,44)],fill="#c15858",outline="#572428")
    elif kind=="chest":
        shadow(d,8,56); open_lid=frame>=2
        outline(d,(8,31,56,56),"#57361f","#21150e",2); px(d,11,35,43,4,"#9e7743"); px(d,28,39,9,11,"#d3aa56")
        if open_lid: outline(d,(9,17,55,32),"#71492a","#27180f",2); px(d,13,25,39,4,"#c4934c")
        else: outline(d,(9,22,55,36),"#71492a","#27180f",2)
    elif kind=="crate":
        shadow(d,8,55); outline(d,(10,21,54,57),"#795838","#302116",2); px(d,13,24,38,30,"#8d6842"); px(d,10,34,44,5,"#3f2b1d"); px(d,29,21,5,36,"#3f2b1d"); d.line((13,25,50,52),fill="#b18a58",width=3)
    elif kind=="stall":
        shadow(d,5,58); px(d,8,27,48,8,"#694326"); px(d,12,35,40,22,"#4a3120");
        stripe_shift=frame%2; colors=["#9b3d3d","#d0b068"]
        for i,x in enumerate(range(7,57,10)): px(d,x,9+stripe_shift,10,18,colors[i%2]); px(d,8,7+stripe_shift,48,3,"#3b2518")
        px(d,17,41,10,10,"#4e7b56"); px(d,38,39,10,12,"#73568e")
    elif kind=="corpse":
        shadow(d,7,55); px(d,8,46,48,10,"#302a27"); px(d,15,40,30,9,"#55453e"); px(d,42,43,10,6,"#171717")
        if frame%2: px(d,23,38,3,2,"#685950")
    return im

WORLD_KINDS=["npc","obelisk","sign","torch","fragment","satchel","herb","key","lever","trap","chest","crate","stall","corpse"]

def make_world_atlas():
    img=Image.new("RGBA",(FRAME*4,FRAME*len(WORLD_KINDS)),(0,0,0,0))
    for row,kind in enumerate(WORLD_KINDS):
        for frame in range(4): img.alpha_composite(world_sprite(kind,frame),(frame*FRAME,row*FRAME))
    save(img,"assets/sprites/world.png")


def enemy_base(kind, pose, frame):
    im=canvas(); d=ImageDraw.Draw(im)
    walk_shift=[0,-1,0,1][frame%4] if pose=="walk" else 0
    attack_shift=[0,-2][frame%2] if pose=="attack" else 0
    hurt_shift=2 if pose=="hurt" else 0
    if pose=="death":
        shadow(d,7,55); color={"enemyHound":"#35404b","enemyCrawler":"#536241","enemyRaider":"#66312b","enemySentinel":"#555b5e","enemyShade":"#49385b","enemyWarden":"#443251"}[kind]
        length=43 if frame==0 else 50; px(d,7,47,length,10,color); px(d,16,40,24,9,color); return im
    bob=walk_shift+attack_shift
    shadow(d,9,51 if kind in ("enemyHound","enemyCrawler") else 57)
    if kind=="enemyHound":
        px(d,8+hurt_shift,30+bob,37,19,"#394552"); px(d,37+hurt_shift,22+bob,18,17,"#4d5b68"); px(d,46+hurt_shift,27+bob,4,4,"#93e5f2")
        px(d,12+hurt_shift,46+bob,7,14,"#202932"); px(d,34+hurt_shift,46+bob,7,14,"#202932"); d.polygon([(8,33+bob),(2,28+bob),(5,38+bob)],fill="#26313a")
        if pose=="attack": d.polygon([(52,34+bob),(62,38+bob),(52,41+bob)],fill="#d4c9b2")
    elif kind=="enemyCrawler":
        d.ellipse((8+hurt_shift,29+bob,55+hurt_shift,53+bob),fill="#51613d",outline="#27301f",width=2); d.ellipse((17+hurt_shift,19+bob,47+hurt_shift,42+bob),fill="#687a4b",outline="#323d27",width=2)
        px(d,23+hurt_shift,27+bob,4,3,"#e0cc58"); px(d,39+hurt_shift,27+bob,4,3,"#e0cc58")
        for x in [8,17,43,52]: d.line((x,45+bob,x-7 if x<32 else x+7,56+bob),fill="#34402a",width=4)
        if pose=="attack": d.polygon([(28,39+bob),(34,47+bob),(40,39+bob)],fill="#b9aa6c")
    elif kind=="enemyRaider":
        outline(d,(23+hurt_shift,7+bob,41+hurt_shift,25+bob),"#b78966","#35251d",2); px(d,20+hurt_shift,4+bob,25,8,"#4c3327")
        px(d,17+hurt_shift,24+bob,31,28,"#6d3029"); px(d,12+hurt_shift,26+bob,8,27,"#3b271f"); px(d,22+hurt_shift,51+bob,9,11,"#2b221c"); px(d,38+hurt_shift,51+bob,9,11,"#2b221c")
        bowx=50+(-6 if pose=="attack" and frame%2 else 0); d.arc((bowx-5,16+bob,bowx+9,57+bob),90,270,fill="#b78a4e",width=3); d.line((bowx+2,17+bob,bowx+2,56+bob),fill="#d8c9a1",width=1)
    elif kind=="enemySentinel":
        outline(d,(21+hurt_shift,4+bob,44+hurt_shift,22+bob),"#747b7e","#2b2e30",2); px(d,16+hurt_shift,20+bob,34,35,"#5a6063"); px(d,8+hurt_shift,24+bob,10,29,"#42474a"); px(d,49+hurt_shift,24+bob,10,29,"#42474a")
        px(d,25+hurt_shift,10+bob,4,3,"#79e4ef"); px(d,37+hurt_shift,10+bob,4,3,"#79e4ef"); px(d,21+hurt_shift,54+bob,10,9,"#34383a"); px(d,38+hurt_shift,54+bob,10,9,"#34383a")
        if pose=="attack": px(d,52,12,5,43,"#9b8f72"); px(d,49,10,12,6,"#c1b082")
    elif kind=="enemyShade":
        d.polygon([(32+hurt_shift,5+bob),(48+hurt_shift,22+bob),(53+hurt_shift,55+bob),(12+hurt_shift,55+bob),(17+hurt_shift,22+bob)],fill="#3d304d",outline="#21192a")
        px(d,22+hurt_shift,12+bob,22,14,"#655079"); px(d,25+hurt_shift,17+bob,4,3,"#e0b7f2"); px(d,37+hurt_shift,17+bob,4,3,"#e0b7f2")
        alpha="#7e60a0" if frame%2 else "#5f477d"; d.polygon([(17,28+bob),(3,34+bob),(17,40+bob)],fill=alpha); d.polygon([(48,28+bob),(62,34+bob),(48,40+bob)],fill=alpha)
        if pose=="attack": d.ellipse((25,29+bob,43,47+bob),fill="#c98bea",outline="#6f4388")
    elif kind=="enemyWarden":
        d.polygon([(32+hurt_shift,2+bob),(47+hurt_shift,18+bob),(53+hurt_shift,57+bob),(11+hurt_shift,57+bob),(17+hurt_shift,18+bob)],fill="#493657",outline="#211927")
        px(d,21+hurt_shift,7+bob,24,18,"#2d2638"); px(d,25+hurt_shift,13+bob,4,3,"#ff9fec" if frame%2 else "#c878df"); px(d,38+hurt_shift,13+bob,4,3,"#ff9fec" if frame%2 else "#c878df")
        outline(d,(24+hurt_shift,29+bob,43+hurt_shift,48+bob),"#774f8d","#342240",2); px(d,30+hurt_shift,35+bob,8,8,"#dda8ef")
        if pose=="attack": d.ellipse((3,19+bob,19,35+bob),fill="#b66ed3",outline="#efd0ff",width=2); d.ellipse((49,19+bob,65,35+bob),fill="#b66ed3",outline="#efd0ff",width=2)
    return im

ENEMY_KINDS=["enemyHound","enemyCrawler","enemyRaider","enemySentinel","enemyShade","enemyWarden"]
# frames 0-3 idle, 4-7 walk, 8-9 attack, 10 hurt, 11 death

def make_enemy_atlas():
    img=Image.new("RGBA",(FRAME*12,FRAME*len(ENEMY_KINDS)),(0,0,0,0))
    for row,kind in enumerate(ENEMY_KINDS):
        for f in range(12):
            if f<4: pose="idle"; pf=f
            elif f<8: pose="walk"; pf=f-4
            elif f<10: pose="attack"; pf=f-8
            elif f==10: pose="hurt"; pf=0
            else: pose="death"; pf=1
            img.alpha_composite(enemy_base(kind,pose,pf),(f*FRAME,row*FRAME))
    save(img,"assets/sprites/enemies.png")


def weapon_frame(kind,frame):
    im=canvas(); d=ImageDraw.Draw(im); swing=[0,-6,3,0][frame]
    if kind=="sword":
        d.polygon([(34+swing,62),(42+swing,62),(58+swing,5),(49+swing,2)],fill="#c8ccd0",outline="#3f4449"); d.line((49+swing,7,37+swing,57),fill="#edf4f6",width=2); px(d,23+swing,50,30,5,"#a77d3f"); px(d,35+swing,54,7,10,"#5a3824")
    elif kind=="mace":
        d.line((35+swing,62,43+swing,20),fill="#7b5a35",width=7); d.ellipse((32+swing,5,56+swing,29),fill="#70777b",outline="#282c2e",width=2)
        for x,y in [(34,8),(49,8),(55,18),(37,25)]: d.polygon([(x+swing,y),(x+5+swing,y+2),(x+swing,y+5)],fill="#a4aaad")
    elif kind=="bow":
        d.arc((18+swing,3,58+swing,68),75,285,fill="#9a6d3d",width=5); d.line((43+swing,8,43+swing,58),fill="#ddd0a7",width=1); d.line((28+swing,36,59+swing,36),fill="#c7b386",width=2); d.polygon([(58+swing,32),(64+swing,36),(58+swing,40)],fill="#b7c1c4")
    else:
        d.line((34+swing,62,43+swing,18),fill="#6f5435",width=7); d.ellipse((31+swing,1,55+swing,24),fill="#599ec1",outline="#d4f3ff",width=2); d.ellipse((37+swing,7,49+swing,19),fill="#b9efff")
    return im


def make_weapon_atlas():
    kinds=["sword","mace","bow","staff"]
    img=Image.new("RGBA",(FRAME*4,FRAME*4),(0,0,0,0))
    for row,k in enumerate(kinds):
        for f in range(4): img.alpha_composite(weapon_frame(k,f),(f*FRAME,row*FRAME))
    save(img,"assets/sprites/weapons.png")


def effect_frame(kind,frame):
    im=canvas(); d=ImageDraw.Draw(im); c=32; phase=frame/5
    if kind=="arrow":
        d.line((7+frame*4,38,52+frame*2,24),fill="#d9c89b",width=3); d.polygon([(50+frame*2,20),(62,22),(54+frame*2,29)],fill="#b9c1c0")
    elif kind=="arcane":
        r=8+frame*2; d.ellipse((c-r,c-r,c+r,c+r),fill="#6bc6e4",outline="#d9f8ff",width=2); d.ellipse((c-4,c-4,c+4,c+4),fill="#f0ffff")
    elif kind=="fire":
        r=8+frame*2; d.ellipse((c-r,c-r,c+r,c+r),fill="#e85c27",outline="#ffbd48",width=3); d.polygon([(32,8),(45,34),(32,51),(20,34)],fill="#ffd35b")
    elif kind=="frost":
        r=10+frame; d.polygon([(32,32-r),(38,25),(32+r,32),(38,39),(32,32+r),(26,39),(32-r,32),(26,25)],fill="#9de1f4",outline="#e7fbff")
    elif kind=="lightning":
        d.line((12+frame*2,4,30,28,20,28,49-frame*2,60),fill="#dac7ff",width=5); d.line((14+frame*2,4,31,27,22,29,47-frame*2,59),fill="#ffffff",width=2)
    elif kind=="venom":
        r=7+frame; d.ellipse((c-r,c-r,c+r,c+r),fill="#759d3f",outline="#c7e66d",width=2); px(d,24,22,5,5,"#d7f58a"); px(d,38,35,4,4,"#4d6c29")
    elif kind=="echo":
        r=8+frame*2; d.ellipse((c-r,c-r,c+r,c+r),outline="#c98fea",width=3); d.ellipse((c-r//2,c-r//2,c+r//2,c+r//2),fill="#6a477c")
    elif kind=="impact":
        r=6+frame*4; d.line((32-r,32,32+r,32),fill="#ffd59a",width=3); d.line((32,32-r,32,32+r),fill="#ffd59a",width=3); d.line((20,20,44,44),fill="#df6f55",width=3); d.line((44,20,20,44),fill="#df6f55",width=3)
    elif kind=="heal":
        r=6+frame*2; d.ellipse((c-r,c-r,c+r,c+r),outline="#8fe19a",width=3); px(d,29,17,7,30,"#d7ffdd"); px(d,17,29,30,7,"#d7ffdd")
    elif kind=="death":
        for i in range(12):
            a=(i*5+frame*3)%64; x=(i*13+frame*7)%52+6; y=58-a//2; s=2+(i+frame)%4; px(d,x,y,s,s,"#766080")
    return im

EFFECTS=["arrow","arcane","fire","frost","lightning","venom","echo","impact","heal","death"]

def make_effect_atlas():
    img=Image.new("RGBA",(FRAME*6,FRAME*len(EFFECTS)),(0,0,0,0))
    for row,k in enumerate(EFFECTS):
        for f in range(6): img.alpha_composite(effect_frame(k,f),(f*FRAME,row*FRAME))
    save(img,"assets/effects/spells.png")


def portrait(member, palette):
    im=Image.new("RGBA",(64,80),(13,10,8,255)); d=ImageDraw.Draw(im)
    d.rectangle((2,2,61,77),fill=palette[0],outline="#a88a55",width=2)
    d.ellipse((17,8,47,42),fill=palette[1],outline="#2b1d16",width=2)
    if member=="daren":
        d.rectangle((15,5,49,17),fill="#747a7e"); d.polygon([(14,13),(50,13),(45,28),(19,28)],fill="#7e8588"); d.rectangle((20,28,44,53),fill="#8d5f3b")
    elif member=="lyra":
        d.polygon([(13,10),(32,2),(52,10),(47,42),(17,42)],fill="#6e4b2d"); d.ellipse((18,9,46,41),fill=palette[1]); d.rectangle((17,40,47,65),fill="#476347")
    elif member=="orin":
        d.polygon([(11,9),(32,0),(54,9),(46,45),(18,45)],fill="#3f3154"); d.ellipse((19,10,45,40),fill=palette[1]); d.rectangle((16,39,48,68),fill="#415f78")
    else:
        d.polygon([(14,9),(32,2),(50,9),(48,43),(16,43)],fill="#d5c5a1"); d.ellipse((19,10,45,40),fill=palette[1]); d.rectangle((16,39,48,68),fill="#725f86")
    d.rectangle((23,23,27,26),fill="#17120f"); d.rectangle((37,23,41,26),fill="#17120f"); d.line((28,33,36,33),fill="#7a4d3b",width=2)
    d.rectangle((12,65,52,76),fill="#16120f"); d.text((18,66),member[:2].upper(),fill="#e4cb7d")
    return im


def make_portraits():
    data={
        "daren":("#281d14","#c59672"),
        "lyra":("#17251b","#d2a37b"),
        "orin":("#171724","#b98a68"),
        "saela":("#241b29","#d7b28b"),
    }
    for member,palette in data.items(): save(portrait(member,palette),f"assets/ui/portrait-{member}.png")




ITEM_ICON_IDS = [
    "iron-longsword", "silver-watch-blade", "ashwood-bow", "echo-string-bow",
    "apprentice-staff", "resonance-staff", "silver-mace", "silent-bell-mace",
    "oak-buckler", "watch-shield", "chain-hauberk", "rangers-leathers",
    "archivist-robes", "bell-vestments", "iron-cap", "seers-circlet",
    "trail-boots", "ring-of-clear-thought", "amulet-of-the-gate",
    "minor-healing-potion", "greater-healing-potion", "mana-tonic", "moonleaf-tonic", "antidote",
    "travel-ration", "moonleaf", "silver-dust", "wolf-pelt", "old-silver-brooch",
    "silver-fragment", "lost-satchel", "eliras-seal", "crypt-warden-key", "mirror-silver",
]

ABILITY_ICON_IDS = [
    "powerStrike", "shieldBash", "rally", "guardianStance",
    "aimedShot", "pinningShot", "volley", "fieldDressing",
    "emberBolt", "frostShard", "chainLightning", "fireNova",
    "mend", "guardianWard", "cleanse", "resurrection",
]


def icon_tile(asset_id):
    im = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 31, 31), fill="#17130f", outline="#695536")
    d.rectangle((2, 2, 29, 29), outline="#342a1d")
    aid = asset_id.lower()
    if "sword" in aid or "blade" in aid or asset_id == "powerStrike":
        d.polygon([(8, 25), (12, 26), (25, 7), (22, 5)], fill="#d5d9da", outline="#555b5e")
        d.rectangle((7, 22, 16, 25), fill="#b38945"); d.rectangle((9, 25, 12, 29), fill="#5d3b22")
    elif "bow" in aid or "shot" in aid or asset_id == "volley":
        d.arc((5, 3, 25, 29), 72, 288, fill="#a8753f", width=3); d.line((16, 5, 16, 27), fill="#d9cfaa")
        d.line((11, 16, 27, 16), fill="#d9c393", width=2); d.polygon([(26, 13), (31, 16), (26, 19)], fill="#bfc6c5")
    elif "staff" in aid or asset_id in {"emberBolt", "frostShard", "chainLightning", "fireNova"}:
        d.line((11, 28, 19, 8), fill="#7a5932", width=4)
        color = "#ef7d34" if asset_id in {"emberBolt", "fireNova"} else "#8eddf3" if asset_id == "frostShard" else "#c6a9ff"
        d.ellipse((14, 3, 27, 16), fill=color, outline="#f1f6e8")
    elif "mace" in aid or asset_id == "shieldBash":
        d.line((10, 28, 18, 12), fill="#795834", width=4); d.ellipse((13, 4, 27, 17), fill="#7a8082", outline="#c3c6c5")
    elif "shield" in aid or asset_id in {"guardianStance", "guardianWard"}:
        d.polygon([(16, 4), (26, 8), (24, 23), (16, 29), (8, 23), (6, 8)], fill="#536e83", outline="#c7b46f")
        d.line((16, 7, 16, 25), fill="#d6c98e", width=2)
    elif any(x in aid for x in ["hauberk", "leathers", "robes", "vestments", "cap", "circlet", "boots"]):
        if "boots" in aid:
            d.polygon([(7, 8), (13, 8), (14, 22), (21, 24), (20, 28), (8, 27)], fill="#6c4a2d", outline="#b48652")
        elif "cap" in aid or "circlet" in aid:
            d.arc((6, 7, 26, 25), 180, 360, fill="#c6ab66", width=4); d.rectangle((7, 16, 25, 20), fill="#73787b")
        else:
            d.polygon([(9, 5), (23, 5), (28, 12), (24, 27), (8, 27), (4, 12)], fill="#5d6570", outline="#c3aa70")
    elif "ring" in aid:
        d.ellipse((7, 7, 25, 25), outline="#d0b85e", width=4); d.ellipse((13, 13, 19, 19), outline="#42351e", width=2)
    elif "amulet" in aid or "brooch" in aid or "seal" in aid:
        d.line((9, 3, 16, 13, 23, 3), fill="#b89a59", width=2); d.ellipse((10, 11, 22, 25), fill="#6aaec7", outline="#d1c17a")
    elif "potion" in aid or "tonic" in aid or "antidote" in aid:
        color = "#c74438" if "healing" in aid else "#3e8bca" if "mana" in aid else "#6da24c"
        d.rectangle((12, 4, 20, 8), fill="#c5aa79"); d.polygon([(10, 8), (22, 8), (25, 24), (21, 28), (11, 28), (7, 24)], fill=color, outline="#d7c9a0")
        d.rectangle((10, 13, 22, 16), fill="#e6eef0")
    elif "ration" in aid:
        d.ellipse((5, 8, 27, 25), fill="#a9743f", outline="#e1b66d"); d.line((8, 15, 24, 15), fill="#674321", width=2)
    elif "moonleaf" in aid:
        d.line((16, 27, 16, 9), fill="#476d3d", width=2); d.ellipse((5, 8, 17, 18), fill="#7297bd"); d.ellipse((15, 5, 28, 17), fill="#8bb2d3")
    elif "dust" in aid:
        for i in range(12):
            x = 5 + (i * 7) % 23; y = 7 + (i * 11) % 19; d.rectangle((x, y, x+1, y+1), fill="#d9d6cf")
    elif "pelt" in aid:
        d.polygon([(5, 8), (13, 4), (16, 9), (21, 4), (28, 9), (25, 27), (7, 27)], fill="#6d6258", outline="#b0a293")
    elif "fragment" in aid or "mirror" in aid:
        d.polygon([(16, 3), (27, 15), (20, 29), (7, 23), (8, 10)], fill="#78d2e9", outline="#e2fbff")
    elif "satchel" in aid:
        d.rectangle((6, 12, 26, 27), fill="#704326", outline="#c09356"); d.arc((9, 4, 23, 18), 180, 360, fill="#c09356", width=3)
    elif "key" in aid:
        d.ellipse((6, 5, 18, 17), outline="#d2b65e", width=3); d.line((15, 15, 27, 27), fill="#b28a3d", width=4); d.line((23, 21, 28, 18), fill="#b28a3d", width=3)
    elif asset_id in {"rally", "fieldDressing", "mend", "cleanse", "resurrection"}:
        color = "#8ee59a" if asset_id != "rally" else "#e6c56a"
        d.rectangle((13, 5, 19, 27), fill=color); d.rectangle((5, 13, 27, 19), fill=color)
    else:
        d.ellipse((7, 7, 25, 25), fill="#8c6ba2", outline="#d7b9e8")
    return im


def make_icon_atlas():
    ids = ITEM_ICON_IDS + ABILITY_ICON_IDS
    columns = 10
    rows = (len(ids) + columns - 1) // columns
    atlas = Image.new("RGBA", (32 * columns, 32 * rows), (0, 0, 0, 0))
    for index, asset_id in enumerate(ids):
        atlas.alpha_composite(icon_tile(asset_id), ((index % columns) * 32, (index // columns) * 32))
    save(atlas, "assets/ui/icons.png")


def make_preview():
    entries = [
        ("Stěny", ROOT / "assets/textures/walls.png"),
        ("Podlahy", ROOT / "assets/textures/floors.png"),
        ("Objekty", ROOT / "assets/sprites/world.png"),
        ("Nepřátelé", ROOT / "assets/sprites/enemies.png"),
        ("Zbraně", ROOT / "assets/sprites/weapons.png"),
        ("Efekty", ROOT / "assets/effects/spells.png"),
        ("Ikony", ROOT / "assets/ui/icons.png"),
    ]
    prepared = []
    max_width = 0
    total_height = 0
    for label, path in entries:
        source = Image.open(path).convert("RGBA")
        scale = 2 if source.width <= 384 else 1
        shown = source.resize((source.width * scale, source.height * scale), Image.Resampling.NEAREST)
        prepared.append((label, shown))
        max_width = max(max_width, shown.width)
        total_height += shown.height + 24
    preview = Image.new("RGB", (max_width, total_height), "#11100f")
    draw = ImageDraw.Draw(preview)
    y = 0
    for label, shown in prepared:
        draw.text((5, y + 5), label, fill="#e5d19a")
        y += 22
        preview.paste(shown, (0, y), shown)
        y += shown.height + 2
    preview.save(ROOT / "ASSET_PREVIEW.png", optimize=True)


def main():
    make_texture_atlas(); make_floor_atlas(); make_world_atlas(); make_enemy_atlas(); make_weapon_atlas(); make_effect_atlas(); make_portraits(); make_icon_atlas(); make_preview()
    print("Pixel assets generated.")

if __name__ == "__main__": main()
