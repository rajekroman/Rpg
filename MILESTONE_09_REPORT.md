# Předávací protokol — Milník 09

## Stav

**Dokončeno jako samostatně spustitelná vývojová verze 0.9.0.**

Milník nahrazuje hlavní procedurální grafiku assetovým pipeline. Neprohlašuje však grafiku za finální produkční art celé kampaně.

## Implementovaný rozsah

- 7 PNG atlasů,
- 4 samostatné portréty,
- 262 buněk atlasů,
- 5 textur stěn,
- 3 textury podlah,
- 14 druhů světových objektů,
- 6 animovaných archetypů nepřátel,
- 4 animované zbraně v první osobě,
- 10 druhů efektů,
- 50 UI ikon,
- asynchronní `AssetManager`,
- centralizovaný manifest,
- stavový automat animací,
- smrtelný přechod před změnou na ostatky,
- bitmapové portréty a ikony v HUD, inventáři a obchodu,
- deterministický generátor assetů,
- formát uložené hry verze 9 s migrací verze 8.

## Automatické ověření

Úspěšně prošlo 39 testovacích skupin:

- úplná regrese Milníků 01–08,
- kontrola 38 JavaScriptových modulů,
- 3 oblasti, 57 entit a 4 přechody,
- 34 předmětů a 16 schopností,
- rozměry a PNG signatura všech atlasů a portrétů,
- shoda manifestu s počtem buněk,
- idle, movement, attack, hit a death animace,
- asynchronní preload a výřezy atlasů,
- renderer smoke test bez assetů,
- renderer smoke test s externími atlasy,
- 1 805 volání vykreslení externích bitmap v testovací scéně,
- save verze 9 a migrace verze 8.

## HTTP kontrola

Lokální server vrátil stav 200 pro:

- `/`,
- `/src/main.js`,
- `/assets/sprites/enemies.png`.

## Neúspěšná kontrola

Headless Chromium nedokončil screenshot. Důvodem byly systémové chyby prostředí:

- chybějící DBus,
- zakázaný NETLINK socket,
- selhání EGL/ANGLE,
- omezení `inotify`.

Tato kontrola není započítána jako úspěšné vizuální ověření. Fyzický iPhone a Safari zatím nebyly testovány.

## Známé technické dluhy

- billboardy mají pouze kamerový čelní pohled,
- podlahová perspektiva používá scanline škálování, nikoli plný per-pixel floor casting,
- atlas neobsahuje samostatné směrové fáze pro každého protivníka,
- animace dveří zůstává změnou mapové dlaždice,
- procedurální fallback je stále součástí bundle,
- finální art direction jednotlivých oblastí vyžaduje samostatný obsahový průchod.

## Následující milník

Milník 10: původní hudební témata, nahrané nebo předgenerované zvukové samply, ambientní vrstvy, audio mixer a nastavení hlasitosti.
