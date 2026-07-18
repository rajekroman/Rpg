# Kroniky Stříbrné brány — Release Candidate 1.0

Původní retro 3D fantasy RPG pro moderní prohlížeče a iPhone. Projekt používá vlastní raycastingový engine, svět, postavy, grafiku, hudbu a příběh. Inspiruje se strukturou first-person RPG devadesátých let, ale nekopíruje konkrétní hru ani její assety.

## Obsah

- 10 propojených oblastí,
- 20 hlavních a 30 vedlejších questů,
- 3 frakce s oddělenou reputací,
- 15 dialogových stromů a 7 zakázkových tabulí,
- 183 mapových entit a 60 bojových setkání,
- 46 předmětů,
- 4 hrdinové, 15 dovedností a 16 aktivních schopností,
- boj v reálném čase, taktická pauza, magie, loot a obchody,
- čtyřfázový závěrečný boss Mor-Kharr,
- 9 variant epilogu,
- 7 grafických atlasů, 4 portréty a 64 komprimovaných MP3 assetů.

## Release funkce

- PWA manifest a instalace na domovskou obrazovku,
- service worker s offline cache,
- GitHub Pages deployment workflow,
- kvalita vykreslení Auto / Úsporná / Vyvážená / Vysoká,
- vysoký kontrast, větší text, omezení pohybu a volitelný zaměřovač,
- nastavitelná viditelnost dotykových prvků,
- automatické ukládání každé dvě minuty a při skrytí aplikace,
- kontrolní součet uložené pozice a automatická záloha předchozího save,
- export a import uložené hry ve formátu JSON,
- audio načítané na pozadí, takže menu nečeká na celou banku,
- komprimovaná audio banka zmenšená z 22,1 MiB WAV na přibližně 3 MiB MP3.

## Spuštění

Projekt používá ES moduly, proto jej spouštějte přes HTTP:

```bash
python3 -m http.server 8080
```

Poté otevřete `http://localhost:8080`.

## Ovládání

- `WASD` — pohyb
- myš / dotyk — rozhlížení
- kliknutí nebo `R` — základní útok
- `1–8` — schopnosti rychlé lišty
- `F1–F4` — aktivní člen družiny
- `F` — interakce
- `Tab` — další bojový cíl
- `T` — taktická pauza
- `J` — deník
- `C` — postavy
- `I` — inventář
- `K` — kniha kouzel
- `M` — mapa
- `F5` — uložit

## Testy

```bash
npm test
```

Testovací sada obsahuje 53 navazujících skupin. Kontroluje celou kampaň, devět zakončení, finální boss fight, mapy, renderer, inventář, ekonomiku, AI, magii, audio, PWA, přístupnost, zálohování save a release rozpočty.

## Nasazení na GitHub Pages

Workflow `.github/workflows/pages.yml` po pushi do `main`:

1. spustí `npm test`,
2. vytvoří čistý statický adresář `dist`,
3. publikuje jej přes GitHub Pages.

V nastavení repozitáře musí být Pages zdroj nastaven na **GitHub Actions**.

## Známá omezení RC

- kampaň byla automaticky simulována, ale nebyla kompletně ručně dohrána na fyzickém iPhonu,
- pokus o Chromium průchod v pracovním prostředí blokovala organizační politika přístupu k lokálním URL,
- balancing ekonomiky, zkušeností a některých pozdějších bojů vyžaduje lidský playtest,
- nové oblasti stále sdílejí část grafických atlasů,
- billboardy nemají osm směrových pohledů,
- dabing a prostorový 3D zvuk nejsou součástí RC.

Podrobnosti jsou v `MILESTONE_12_REPORT.md` a `RELEASE_QA.md`.
