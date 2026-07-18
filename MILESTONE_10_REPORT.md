# Předávací protokol — Milník 10

## Stav

**Dokončeno jako samostatně spustitelná vývojová verze 0.10.0.**

Milník přidává skutečný souborový audio pipeline. Neoznačuje soundtrack za finální studiový master celé budoucí kampaně.

## Implementovaný rozsah

- 8 původních retro fantasy hudebních témat,
- 3 ambientní smyčky,
- 53 samostatných zvukových efektů,
- 64 WAV souborů celkem,
- 22,1 MiB nekomprimovaného audia,
- hudební scény pro menu, tři oblasti, den/noc, boj a boss fight,
- crossfade hudby a prostředí,
- kroky podle tří povrchů,
- čtyři samostatné zvuky zbraní,
- zásah do masa, zbroje, kritický zásah a minutí,
- šest sad zvuků monster pro útok a smrt,
- zvuky magie, pastí, dveří, páky, questů a UI,
- pět audio ovladačů v mixeru včetně master hlasitosti,
- dynamics compressor,
- persistence nastavení zvuku,
- deterministický generátor `tools/generate_audio.py`,
- save formát verze 10 a migrace pozice verze 9.

## Automatické ověření

Úspěšně prošlo **42 testovacích skupin**:

- úplná regrese Milníků 01–09,
- validace 3 oblastí, 57 entit a 4 přechodů,
- kontrola všech herních systémů, grafických atlasů a animací,
- kontrola RIFF/WAVE hlavičky všech 64 audio souborů,
- kontrola PCM 16 bit / 22 050 Hz,
- minimální délka hudby a ambientu,
- maximální délka jednorázových efektů,
- kontrola shody manifestu se soubory,
- výběr hudby podle menu, lokace, dne, noci, boje a bosse,
- preload audio dat,
- dekódování přes Web Audio,
- crossfade smyček,
- spouštění samplů,
- ukládání a omezení hodnot mixeru,
- zápis save verze 10 a migrace verze 9.

## HTTP kontrola

Lokální HTTP server vrátil stav **200** pro:

- `/`,
- `/src/main.js`,
- `/src/data/audio.js`,
- `/assets/audio/music/menu.wav`,
- `/assets/audio/ambience/forest.wav`,
- `/assets/audio/sfx/weapon-sword.wav`.

## Co nebylo ověřeno

V pracovním prostředí nebyl proveden spolehlivý poslech přes fyzické reproduktory ani sluchátka. Nebylo proto potvrzeno:

- subjektivní vyvážení hlasitostí na iPhonu,
- chování audio výstupu při příchozím hovoru,
- přepnutí mezi reproduktorem a Bluetooth,
- latence prvního dekódování v mobilním Safari,
- praktická bezešvost každé smyčky na konkrétním zařízení.

Datový formát, načítání, dekódovací tok a logika mixu jsou otestované; subjektivní audio QA zůstává pro Milník 12.

## Známé technické dluhy

- zvuky monster zatím nemají plné 3D poziční audio,
- není přítomen dabing,
- WAV distribuce je datově větší než plánovaný Opus release,
- soundtrack je syntetizovaný retro základ, nikoli finální orchestrální produkce,
- pro kompletní kampaň budou nutná další lokální a frakční témata.

## Následující milník

Milník 11: rozšíření hry z prologu na obsahově dokončitelnou kampaň — více oblastí, město, frakce, hlavní dějová osa, vedlejší questy, další dungeony a několik zakončení.
