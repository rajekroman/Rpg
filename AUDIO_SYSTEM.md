# Audio systém — Milník 10

## Cíl

Milník 10 nahrazuje původní jednotlivé procedurální tóny skutečnou souborovou zvukovou bankou. Audio zůstává stylizované jako retro fantasy soundtrack, ale runtime již přehrává WAV soubory, nikoli jen oscilátory vytvořené při každé události.

## Zvuková banka

Projekt obsahuje **64 WAV souborů** v PCM 16 bit / 22 050 Hz:

- **8 hudebních témat**,
- **3 ambientní smyčky**,
- **53 krátkých zvukových efektů**.

Celková nekomprimovaná velikost audia je přibližně **22,1 MiB**.

### Hudba

| Soubor | Použití | Přibližná délka |
|---|---|---:|
| `menu.wav` | titulní obrazovka | 25,3 s |
| `vale-day.wav` | Vrbové údolí ve dne | 20,9 s |
| `vale-night.wav` | Vrbové údolí v noci | 27,4 s |
| `pass-day.wav` | Stříbrný průsmyk ve dne | 27,7 s |
| `pass-night.wav` | Stříbrný průsmyk v noci | 24,6 s |
| `crypt.wav` | Krypta zlomených ozvěn | 30,0 s |
| `combat.wav` | běžný boj | 29,1 s |
| `boss.wav` | boss souboj | 26,0 s |

Hudební témata se přepínají podle:

- aktuální obrazovky,
- oblasti,
- dne nebo noci,
- aktivního boje,
- aktivního boss souboje.

Přechod probíhá plynulým crossfadem. Při skončení boje se systém vrátí k tématu oblasti.

### Ambient

- `forest.wav` — šum vegetace a vzdálené ptačí tóny,
- `mountain-wind.wav` — horské poryvy a hluboký větrný základ,
- `crypt-depths.wav` — nízký podzemní drone a vzdálené rezonance.

Hudba a ambient běží na oddělených sběrnicích, takže lze jejich hlasitost řídit nezávisle.

### Zvukové efekty

Zvuková banka rozlišuje:

- kroky na trávě, kameni a kryptové podlaze, vždy ve třech variantách,
- meč, palcát, luk a magickou hůl,
- zásah do masa, zásah do zbroje, kritický zásah a minutí,
- otevírání, zavírání a zamčené dveře,
- páku, sběr předmětu, past a její zneškodnění,
- aktualizaci a dokončení questu,
- objevení tajemství a přechod oblasti,
- oheň, mráz, blesk, léčení, spirituální a jedovou magii,
- útok a smrt každého ze šesti nepřátelských archetypů,
- rozhraní a taktickou pauzu.

## Runtime architektura

### `AudioManager`

Audio manager zajišťuje:

1. načtení všech souborů přes HTTP,
2. vytvoření Web Audio grafu,
3. dekódování WAV dat,
4. oddělené audio sběrnice,
5. přehrávání jednorázových samplů,
6. opakované hudební a ambientní smyčky,
7. plynulé prolínání scén,
8. ukládání uživatelského nastavení.

### Audio graf

```text
music ──────┐
ambience ───┤
sfx ────────┼─> master ─> dynamics compressor ─> output
ui ─────────┘
```

Dynamický kompresor omezuje nečekané hlasité špičky při souběhu kouzel, zásahů a hudby.

### Odemknutí audia

Mobilní Safari a další prohlížeče blokují automatické spuštění zvuku. Projekt proto:

- stáhne audio data během startu,
- Web Audio kontext odemkne při prvním dotyku nebo stisku klávesy,
- teprve potom dekóduje a spustí požadovanou hudební scénu.

## Mixer

Menu **Nastavení zvuku** obsahuje:

- celkovou hlasitost,
- hudbu,
- prostředí,
- efekty,
- zvuky rozhraní,
- úplné ztlumení.

Nastavení se ukládá do `localStorage` nezávisle na herní pozici.

## Deterministická regenerace

Audio banku lze znovu vytvořit příkazem:

```bash
python3 tools/generate_audio.py
```

Generátor používá pevný seed a vytváří stejné WAV soubory. Implementuje vlastní oscilátory, obálky, filtry, perkuse, delay, stereofonní panoramu a syntézu šumu.

## Formát a nasazení

- PCM WAV,
- 16 bit,
- 22 050 Hz,
- hudba a ambient stereo,
- většina efektů mono,
- relativní URL odvozené z `import.meta.url`,
- kompatibilní s nasazením v podadresáři GitHub Pages.

WAV byl zvolen pro jednoduchou, spolehlivou kontrolu a širokou podporu. Před finálním vydáním lze hudbu a ambient převést do vhodného webového formátu, například Opus, a ponechat WAV jako zdrojové master soubory.

## Známá omezení

- nejde o živou orchestrální nahrávku ani dabing,
- nepřátelské zvuky zatím nemají vzdálenostní útlum podle pozice ve 3D světě,
- aktivní panoramování je zatím použito pouze u vybraných krátkých efektů,
- audio data se při prvním odemknutí musí dekódovat, což může být na starším iPhonu krátce znatelné,
- WAV soubory jsou větší než budoucí Opus distribuce,
- praktický poslech na fyzickém iPhonu a v Safari nebyl v tomto prostředí proveden.

## Release distribuce 1.0 RC

Milník 12 převádí runtime banku do MP3 při 22 050 Hz. Zdrojový generátor nadále vytváří WAV mastery; `tools/compress_audio.py` je převádí na distribuční soubory a zapisuje `audio-index.json` s délkou, velikostí a SHA-256. Distribuční audio kleslo z 22,1 MiB na přibližně 3,0 MiB. Audio se navíc načítá na pozadí a neblokuje zpřístupnění titulního menu.
