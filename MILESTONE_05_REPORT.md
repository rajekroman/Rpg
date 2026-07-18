# Předávací protokol — Milník 05

## Stav

**Dokončeno jako samostatně spustitelná verze navazující na celý obsah Milníku 04.**

## Implementovaný rozsah

- boj v reálném čase,
- samostatný cooldown každého člena družiny,
- automatické a ruční přepínání cíle,
- útok mečem, palcátem, lukem, holí a beze zbraně,
- fyzické a spirituální projektily,
- šance zásahu, minutí a kritický zásah,
- armor, odvozená obrana a šest existujících odolností,
- pět datově definovaných archetypů protivníků,
- šest bojových setkání v prologové oblasti,
- základní aggro, pronásledování, střelba, leash a kolize AI,
- jeden bossový archetyp,
- životy cíle a recovery panel v HUD,
- feedback poškození, minutí a zásahu družiny,
- taktická pauza,
- bezvědomí, smrt a obrazovka porážky,
- zkušenosti za zabití,
- ostatky a pět nových loot tabulek,
- uložení kompletního bojového stavu,
- migrace uložené pozice Milníku 04 a starších verzí,
- desktopové a dotykové bojové ovládání,
- procedurální zvuky útoku a taktických stavů.

## Architektura

Nové moduly:

- `src/data/enemies.js`
- `src/systems/CombatSystem.js`

Významně změněné moduly:

- `World.js` — veřejná line-of-sight a kolizní rozhraní, bojové API, save/restore,
- `Raycaster.js` — pět nepřátelských sprite archetypů, ostatky, projektily a damage feedback,
- `Hud.js` — cílový panel a bojové údaje,
- `Game.js` — vstup, porážka a integrace soubojových událostí,
- `InputManager.js` — levé tlačítko myši a blokování klávesy Tab,
- `AudioManager.js` — zvukové signály zbraní a taktické pauzy,
- `SaveManager.js` — formát uložené pozice verze 5.

## Automatická kontrola

Příkaz `npm test` spouští všechny regresní testy Milníků 01–04 a nové bojové scénáře:

1. integrita pěti nepřátelských archetypů,
2. integrita šesti setkání a jejich umístění,
3. přítomnost bosse a střelce,
4. útok zblízka,
5. minutí, zásah a kritická větev výpočtu,
6. recovery aktivního člena,
7. střelba a fyzický projektil,
8. smrt protivníka,
9. zkušenosti za zabití,
10. transformace protivníka na ostatky,
11. jednorázová kořist,
12. aggro a nepřátelský útok na dálku,
13. poškození družiny,
14. aktivace bojového stavu,
15. zastavení AI, projektilů a pohybu v taktické pauze,
16. přepínání cíle,
17. persistence životů nepřítele, cooldownu, cíle a pauzy,
18. migrace snapshotu bez bojové sekce.

Všechny testy procházejí také po změně umístění nepřátel tak, aby hráč nebyl napaden bezprostředně po spuštění nové hry.

## Vizuální ověření

Pokus o automatický screenshot přes systémový Chromium byl proveden. Chromium v kontejneru nedokončil běh v časovém limitu kvůli chybějícímu DBus, omezenému NETLINK namespace a limitům file watcherů. Screenshot proto není označen jako úspěšný test.

Automaticky jsou ověřeny syntax, importy, data, HTML kontrakt, mapa, kolize, questy, postavy, předměty, ekonomika, bojové výpočty, AI scénáře, save/restore a migrace. Praktické vizuální ověření musí proběhnout v běžném Safari nebo Chrome.

## Záměrně nedokončený rozsah

Milník 05 nepředstírá dokončení následujících systémů:

- aktivní kouzla a hotbar,
- stavové efekty jako jed, omráčení nebo hoření,
- plošné útoky,
- pokročilá skupinová AI a navigace,
- boss fáze a telegraphing,
- animace z více směrů,
- opotřebení, opravy, identifikace a procedurální affixy vybavení.

Stavové efekty a plošné útoky patří do Milníku 06, pokročilá AI a boss fáze do Milníku 07. Instance předmětů a affixy budou zařazeny až po stabilizaci magie a dropů, aby se neměnil save formát dvakrát bez herního přínosu.

## Další milník

**Milník 06 — magie, schopnosti, spellbook, hotbar a stavové efekty.**
