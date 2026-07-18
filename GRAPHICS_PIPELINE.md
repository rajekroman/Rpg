# Grafický pipeline — Milník 09

## Cíl

Oddělit vizuální obsah od herní logiky a rendereru. Hra nyní načítá bitmapové atlasy před vytvořením instance `Game`. Při chybě načtení zůstává dostupný původní procedurální fallback, aby hra neselhala prázdnou obrazovkou.

## Struktura

```text
assets/
├── textures/
│   ├── walls.png
│   └── floors.png
├── sprites/
│   ├── world.png
│   ├── enemies.png
│   └── weapons.png
├── effects/
│   └── spells.png
└── ui/
    ├── icons.png
    ├── portrait-daren.png
    ├── portrait-lyra.png
    ├── portrait-orin.png
    └── portrait-saela.png
```

## Atlasy

| Atlas | Buňka | Sloupce × řádky | Obsah |
|---|---:|---:|---|
| `walls.png` | 64×64 | 5×1 | kámen, dřevo, les, krypta, runová bariéra |
| `floors.png` | 64×64 | 3×1 | tráva, dlažba, krypta |
| `world.png` | 64×64 | 4×14 | NPC, objekty, mechanismy, truhly a ostatky |
| `enemies.png` | 64×64 | 12×6 | šest nepřátelských archetypů |
| `weapons.png` | 64×64 | 4×4 | meč, palcát, luk, hůl |
| `spells.png` | 64×64 | 6×10 | projektily, magie, zásah, léčení a smrt |
| `icons.png` | 32×32 | 10×5 | 34 předmětů a 16 schopností |

## Animace nepřátel

Každý řádek nepřátelského atlasu používá jednotný kontrakt:

| Snímky | Stav |
|---|---|
| 0–3 | klid |
| 4–7 | pohyb |
| 8–9 | útok nebo sesílání |
| 10 | zásah |
| 11 | smrt |

Modul `AnimationState.js` převádí stav `CombatSystem` a `EnemyAI` na číslo snímku. Renderer neobsahuje rozhodovací logiku bossů ani soubojů; pouze spotřebovává výsledný animační stav.

## Načítání

`AssetManager`:

1. načte manifest z `src/data/assets.js`,
2. asynchronně přednačte všechny PNG soubory,
3. vrací výřezy atlasů jako `{ image, sx, sy, sw, sh }`,
4. poskytuje mapování textur, spriteů, efektů, zbraní a ikon,
5. zaznamená selhané soubory a dovolí rendereru použít fallback.

URL jsou vytvářeny pomocí `new URL(..., import.meta.url)`, takže fungují i v podadresáři GitHub Pages.

## Renderer

`Raycaster` používá atlasy v těchto krocích:

1. vykreslí oblohu a perspektivně škálované řádky podlahové textury,
2. pro každý ray použije jeden pixelový sloupec textury stěny,
3. seřadí billboardy podle vzdálenosti a vykreslí příslušný animační snímek,
4. vykreslí projektilové sprite efekty,
5. aplikuje světlo a mlhu,
6. vykreslí zásahové efekty a čísla poškození,
7. přidá animovanou zbraň aktivní postavy.

`imageSmoothingEnabled` je vždy vypnuto a CSS používá `image-rendering: pixelated`.

## UI ikony

Předměty a schopnosti mají stabilní index v atlasu `icons.png`. UI používá CSS background-position, takže při zobrazení seznamu nemusí vytvářet samostatný obrázek pro každou položku.

## Generátor

`tools/generate_assets.py` používá Pillow a pevný seed. Výstup je reprodukovatelný. Generátor je určen jako vývojový nástroj; hra za běhu Python ani Pillow nepotřebuje.

## Fallback

Procedurální kresba z předchozích milníků zůstává uvnitř rendereru pouze pro případ:

- chybějícího souboru,
- chybné cesty po nasazení,
- neúspěšného dekódování PNG.

Při správném nasazení GitHub Pages se fallback nepoužívá.
