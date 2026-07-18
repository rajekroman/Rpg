# Professional Visual Edition 2.0

## Cíl

Edice 2.0 odstraňuje dvě předchozí slepé uličky: provizorní pixelové kresby bez anatomie a moderní mobilní overlay, který se překrýval se starým HUDem. Nový systém používá jeden konzistentní výtvarný jazyk: dospělou fantasy, tlumenou VGA barevnost, hmotné materiály a rozhraní odvozené z klasických party-based dungeon RPG.

## Renderer

Hlavní renderer je `src/render/CinematicRenderer.js` nad Three.js. Canvas raycaster zůstává jen jako fallback.

### Obrazová charakteristika

- antialiasing je vypnutý,
- interní šířka renderu je 320–512 px,
- výsledný canvas se zvětšuje bez interpolace,
- materiály používají nearest filtering a vypnuté mipmapy,
- ploché stínování a geometrické kontury drží čitelné siluety,
- barevnost je tmavá, kovová a zemní,
- scéna používá mlhu, hemisférické světlo, směrové světlo a lokální runová či pochodňová světla.

Tento přístup nevytváří náhodný „pixel filter“. Obraz se skládá v nízkém rozlišení od začátku, takže hrany, materiály a siluety odpovídají zamýšlenému 12bitovému výrazu.

## Nepřátelé

Aktivní WebGL cesta nepoužívá dětsky působící bitmapové billboardy. Šest archetypů má vlastní prostorovou siluetu:

- ozvěnový honič — nízké obrněné tělo, kostěné trny a světélkující oči,
- bahenní lezoun — článkovaný krunýř, osm končetin a jedové oči,
- popelavý nájezdník — kapuce, vrstvená zbroj, toulec a luk,
- dutý strážce — plátová zbroj, štít, kopí a spektrální světlo,
- živá ozvěna — průsvitný hábit, kostěné ruce a orbitální runy,
- Mor-Kharr — těžká temná zbroj, koruna, fialová čepel a výrazně větší měřítko.

Animace stavů vzniká změnou postoje, náklonu, pulzu měřítka, zásahového záblesku, útokového oblouku a řízeného pádu při smrti. Nejde o plnohodnotný skeletální animation set; cílem je čitelná reakce v nízkém rozlišení bez infantilních spriteů.

## Prostředí

Produkční textury v `assets/textures/professional/`:

- `grass.png`,
- `stone-floor.png`,
- `crypt-floor.png`,
- `stone-wall.png`,
- `wood-door.png`,
- `hedge.png`,
- `crypt-wall.png`,
- `rune-wall.png`.

Exteriér obsahuje horský prstenec, rozptýlené stromy a balvany, ruiny, dům, rozcestník a vrstvená oblaka. Podzemí používá strop, hustší mlhu, tmavší materiály a lokální světelné zdroje.

## HUD

Rozhraní má jedinou autoritativní CSS implementaci. Odstraněny byly staré duplicitní deklarace, které na iPhonu vykreslovaly současně dva HUDy.

### Rozložení

- družina: pevný levý sloupec se čtyřmi kartami,
- herní obraz: zbytek horní části obrazovky,
- spodní panel: minimapa, utility akce, log/hotbar a rychlý inventář,
- cílový panel: malý, středově zarovnaný, pouze během boje,
- mobilní ovládání: neviditelná dotyková zóna a kontextový joystick.

### Výtvarné prostředky

- obsidiánové panely,
- kamenné a mosazné rámy,
- omezená paleta béžové, šedomodré, tmavě červené a modré,
- serifové titulky a čitelné systémové písmo,
- 50 samostatně navržených ikon předmětů a schopností,
- žádné emoji ani pastelové zástupné symboly.

## Portréty a identita

Čtyři finální portréty jsou ručně kurátorované výřezy z projektového concept artu a jsou dodávány jako samostatné produkční soubory. PWA ikony používají zříceninu Stříbrné brány, heraldický oblouk a runovou čepel místo původního plochého prototypového znaku.

## Mobilní pravidla

Pro landscape telefony do výšky 560 CSS px se HUD, karty družiny, písmo a sloty zmenšují samostatnou media query. `.touch-buttons` je vždy skrytá; tím je vyloučeno opakování obřích tlačítek přes herní obraz. Joystick je viditelný pouze během aktivního dotyku.

## Cache a nasazení

- verze aplikace: `2.0.0`,
- PWA cache: `ksb-2.0.0-professional`,
- cache-busting parametry: `v=2.0.0`,
- service worker obsahuje produkční textury, portréty, ikony, audio a moduly.

Staré cache klíče jsou při aktivaci odstraněny.
