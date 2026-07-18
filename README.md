# Kroniky Stříbrné brány — Professional Visual Edition 2.0

Původní first-person fantasy RPG pro prohlížeče, počítače a iPhone. Verze `2.0.0` zachovává dokončitelnou kampaň a nahrazuje předchozí prototypovou grafiku jednotnou, dospělou vizuální vrstvou inspirovanou klasickými dungeon RPG devadesátých let.

## Vizuální identita

- nízké interní rozlišení 320–512 px s nearest-neighbour škálováním,
- prostorové WebGL prostředí s perspektivou, mlhou, světlem a základními stíny,
- vlastní kamenné, dřevěné, travnaté a runové textury,
- dospělé nízkopolygonové modely šesti nepřátelských archetypů,
- čtyři ručně kurátorované portréty družiny,
- jednotná sada 50 předmětových a schopnostních ikon,
- tmavý kamenný HUD s mosaznými hranami,
- velký herní obraz bez překrývajících se mobilních panelů,
- filmovější, tlumená barevnost bez pastelových „dětských“ spriteů.

Staré bitmapové atlasy zůstávají pouze jako technický fallback pro nouzový Canvas renderer. Hlavní WebGL renderer používá profesionální materiály, modely a portréty z edice 2.0.

## Rozhraní

Obrazovka je rozdělena podle osvědčené struktury klasických dungeon RPG:

- vlevo čtyři karty družiny s HP a manou,
- uprostřed pohled první osoby,
- dole minimapa, utility lišta, textový log a osm schopností,
- vpravo rychlý inventář a systémové volby,
- na telefonu pouze kontextový joystick a dotyková plocha pro rozhlížení; žádná druhá překrývající se sada tlačítek.

## Herní obsah

- 10 propojených oblastí,
- 20 hlavních a 30 vedlejších úkolů,
- 3 frakce,
- 15 dialogových stromů,
- 183 mapových entit,
- 60 bojových setkání,
- 46 předmětů,
- 16 aktivních schopností,
- čtyřfázový závěrečný boss,
- 9 variant epilogu.

## Ovládání

### Počítač

- `WASD` — pohyb,
- myš — rozhlížení,
- kliknutí nebo `R` — útok,
- `1–8` — schopnosti,
- `F` — interakce,
- `Tab` — další cíl,
- `T` — taktická pauza,
- `Esc` — menu.

### Telefon

- levá část výhledu — kontextový pohybový joystick,
- pravá část výhledu — rozhlížení v obou osách,
- spodní HUD — útok, použití, cílení, mapa, odpočinek, schopnosti a inventář,
- doporučená orientace na šířku.

## Spuštění

Projekt používá ES moduly a musí běžet přes HTTP:

```bash
python3 -m http.server 8080
```

Poté otevřete `http://localhost:8080`.

## Testy a produkční build

```bash
npm test
npm run build
```

Testovací sada obsahuje 53 skupin pokrývajících mapy, kampaň, souboje, AI, magii, inventář, audio, ukládání, PWA, přístupnost a statický kontrakt profesionální vizuální edice.

Produkční GitHub Pages obsah vznikne v adresáři `dist/`.

## Dokumentace

- `PROFESSIONAL_VISUAL_EDITION.md` — renderer, materiály, modely a HUD,
- `FINAL_RELEASE_REPORT.md` — předávací a validační protokol,
- `PROFESSIONAL_FINAL_PREVIEW.png` — cílová kompozice rozhraní,
- `PROFESSIONAL_ASSET_SHEET.png` — skutečně dodávané portréty, textury, ikony a PWA identita.

## Ověřená omezení

- Automatické modulové, datové, HTTP a PWA testy prošly.
- Pracovní prostředí blokuje Chromium na lokálních i přesměrovaných adresách, proto zde nebylo možné pořídit důvěryhodný screenshot skutečného WebGL výstupu.
- Finální vizuální kontrola latence, čitelnosti a proporcí musí proběhnout na živé GitHub Pages stránce a fyzickém iPhonu.
- Náhled rozhraní je designová kompozice, nikoli tvrzení, že jde o browserový screenshot.
