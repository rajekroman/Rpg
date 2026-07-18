# Vývojový plán

Každý milník musí skončit samostatně spustitelnou verzí, automatickými kontrolami a seznamem známých omezení. Následující milník nezačne přepisem předchozího, ale rozšířením stabilních rozhraní.

## 01 — Motor a technická kostra — HOTOVO

**Cíl:** stabilní základ, na kterém lze bezpečně stavět RPG systémy.

- pevný update 60 Hz oddělený od renderování,
- raycasting, depth buffer a billboardy,
- datově definovaná mapa,
- kolize a line-of-sight,
- vstup z klávesnice, myši a dotyku,
- responzivní retro HUD,
- ukládání a načítání,
- debug overlay,
- validace map a CI.

**Výstup:** jedno průchozí technické cvičiště se třemi interakcemi.

## 02 — Datový model kampaně a questový engine — HOTOVO

**Cíl:** příběh nesmí být zadrátovaný do rendereru nebo jednotlivých tlačítek.

- stav kampaně, globální příznaky, zlato a pověst,
- definice questů, kroků, podmínek, počítadel a odměn,
- dialogové uzly, volby a podmíněné repliky,
- questové události oddělené od rendereru,
- deník s hlavními a vedlejšími úkoly,
- sledování aktivního cíle v HUD,
- podmíněná viditelnost a sběr questových objektů,
- automatické testy kritických příběhových průchodů.

**Výstup:** prolog Noc bez ozvěny se třemi NPC, třemi questy, 25 dialogovými uzly a sedmi questovými fázemi.

**Poznámka:** český text je oddělen v datových modulech. Plná vícejazyčná katalogová lokalizace bude doplněna až při přípravě vydání, aby se nyní nemusela udržovat paralelní nehotová jazyková sada.

## 03 — Družina, atributy, dovednosti a postup — HOTOVO

- čtyři samostatní hrdinové,
- atributy, odolnosti a odvozené statistiky,
- třídy, dovednosti a mistrovství,
- zkušenosti, úrovně a body rozvoje,
- stavové efekty, bezvědomí a smrt,
- obrazovka postavy a detailní tooltipy.

**Výstup:** družina postupuje na úroveň 3 a rozdíly mezi rolemi jsou herně patrné.

Implementováno: čtyři třídy, sedm atributů, šest odolností, patnáct dovedností, mistrovství, odvozené statistiky, stav zdraví, odpočinek, přidělování bodů a migrace uložených pozic z Milníku 02.

## 04 — Inventář, vybavení, předměty a ekonomika — HOTOVO

- sdílený inventář, typové stohy, nosnost a 36 slotů,
- sedm slotů vybavení pro každého hrdinu,
- třídní požadavky, dvoruční zbraně a okamžitý přepočet statistik,
- spotřební, materiálové, cenné a questové předměty,
- dva obchody, oddělené zásoby, nákup a prodej,
- ceny ovlivněné diplomacií a pověstí,
- deterministické loot tabulky, rarity a jednorázové schránky,
- verzované ukládání a migrace Milníků 02–03.

**Výstup:** kompletní základní cyklus nález → vyhodnocení → vybavení/prodej/použití.

**Přesunuto k soubojové integraci:** unikátní instance, procedurální prefixy/suffixy, identifikace, opotřebení a opravy. Tyto mechaniky vyžadují nepřátelský drop a poškozování vybavení, které vzniknou v Milníku 05.

## 05 — Soubojový systém v reálném čase — HOTOVO

- automatické a ruční cílení,
- individuální recovery členů družiny,
- útoky zblízka, luky a hole,
- fyzické a spirituální projektily,
- armor, obrana, odolnosti, zásah, minutí a kritické poškození,
- pět archetypů protivníků a šest setkání,
- základní aggro, pronásledování, ranged AI a leash,
- taktická pauza,
- smrt, porážka družiny, zkušenosti a loot z ostatků,
- bojový HUD, feedback, zvuky a persistence verze 5.

**Výstup:** kompletní základní bojový cyklus proti rychlému, obrněnému, střeleckému, těžkému a bossovému archetypu.

**Přesunuto:** plošné a stavové efekty do Milníku 06; pokročilá navigace, skupinová AI a boss fáze do Milníku 07.

## 06 — Magie a schopnosti — HOTOVO

- 16 třídních kouzel a aktivních schopností,
- mana, cooldowny, požadavky úrovně a dovednosti,
- buffy, debuffy, léčení, oživení a kontrola prostoru,
- spellbook, osmipoziční hotbar a cílení,
- projektily, plošné útoky a řetězový zásah,
- devět stavových efektů s tickováním a modifikátory,
- elementární odolnosti protivníků,
- vizuální a procedurální zvukové efekty,
- persistence a migrace uložených pozic verze 5.

**Výstup:** 16 funkčně odlišných schopností, čtyři třídní lišty a plně uložitelný stav magie.

**Přesunuto:** pokročilé nepřátelské sesílání, přerušování kouzel, boss telegraphing a skupinové reakce patří do Milníku 07.

## 07 — AI nepřátel a bossové — HOTOVO

- samostatný stavový automat `EnemyAI`,
- A* navigace po dlaždicích a návrat na domovskou pozici,
- sdílený poplach tří skupin,
- pět taktických rolí,
- ústup a flankování střelců,
- osm nepřátelských schopností,
- podpůrné aury, smečkový buff a negativní efekty družiny,
- třífázový Dozorce zlomené ozvěny,
- dynamické přivolání živých ozvěn,
- persistence AI, boss fáze a summon jednotek verze 7.

**Výstup:** pokročilé bojové setkání a plně testovaný třífázový boss fight v prologové oblasti.

**Přesunuto:** skutečný první dungeon, prostorové pasti a dveřní mechaniky patří do Milníku 08; finální animované telegraphy do Milníku 09.

## 08 — Svět, lokace a přechody — HOTOVO

- tři samostatné oblasti a čtyři obousměrné přechody,
- perzistentní stav entit každé oblasti,
- vrstva dynamických přepisů mapových dlaždic,
- troje dveře, klíčový zámek a páka,
- tajná stěna s detekcí,
- tři pasti s detekcí, zneškodněním a poškozením,
- první dungeon Krypta zlomených ozvěn,
- denní cyklus a rozdílné osvětlení exteriéru a podzemí,
- nový hlavní quest Pod Stříbrnou bránou,
- persistence světa verze 8 a migrace starších pozic.

**Výstup:** Vrbové údolí, Průsmyk Stříbrné brány a Krypta zlomených ozvěn propojené bez ztráty stavu.

**Přesunuto:** plnohodnotné počasí, rozsáhlé město a finální animace mechanismů budou řešeny v obsahovém a vizuálním průchodu pozdějších milníků.

## 09 — Grafický obsah a animace — HOTOVO

- sedm externích PNG atlasů a čtyři samostatné portréty,
- pět textur stěn a tři textury podlah,
- čtrnáct druhů světových objektů se čtyřmi snímky,
- šest čelních billboardových archetypů nepřátel se stavy klid, pohyb, útok, zásah a smrt,
- čtyři animované zbraně v pohledu první osoby,
- deset řad efektů kouzel a projektilů,
- padesát bitmapových ikon předmětů a schopností,
- asynchronní preload, centralizovaný manifest a bezpečný procedurální fallback,
- deterministický Python generátor celé grafické sady,
- persistence verze 9 a migrace uložených pozic verze 8.

**Výstup:** jednotný nízkobarevný 90s vizuální základ se 262 atlasovými buňkami, načítaný ze skutečných PNG souborů.

**Přesunuto:** víceúhlové směrové sprite sady, unikátní výtvarné sady jednotlivých místností, ručně kreslené mezisnímky všech schopností a finální produkční art celé kampaně vyžadují další samostatný obsahový průchod.

## 10 — Hudba, zvuky a ambient — HOTOVO

- osm původních hudebních témat pro menu, oblasti, den/noc, boj a bosse,
- tři samostatné ambientní smyčky,
- 53 krátkých zvukových efektů,
- kroky podle tří povrchů,
- zbraně, zásahy, magie, UI, monstra, pasti a mechanismy,
- pětikanálové nastavení mixeru včetně master hlasitosti,
- dynamics compressor a plynulé crossfady,
- deterministický generátor celé WAV banky,
- persistence save verze 10 a nastavení zvuku.

**Výstup:** kompletní souborový audio průchod současným prologem a prvním dungeonem se 64 WAV soubory a 22,1 MiB PCM dat.

**Přesunuto:** prostorové 3D tlumení, dabing, finální mastering, Opus distribuce a praktické audio QA na iPhonu patří do Milníku 12.

## 11 — Plná kampaň a obsah — HOTOVO

- přesně 20 hlavních a 30 vedlejších questů,
- deset propojených oblastí včetně městského hubu, tří dalších exteriérů a tří dalších dungeonů,
- 183 mapových entit, 19 přechodů a 60 bojových setkání,
- tři frakce s oddělenou reputací,
- dvě zásadní příběhová rozhodnutí,
- sedm zakázkových tabulí pro vedlejší obsah,
- dvanáct nových předmětů včetně tabulky pravého jména,
- čtyřfázový závěrečný boss Mor-Kharr s dynamickými posilami,
- devět kombinací epilogu podle zvolené aliance a osudu relikviáře,
- save formát verze 11 a migrace verze 10,
- automatický průchod hlavní osou, vedlejší zakázkou, epilogy, boss fázemi a všemi oblastmi rendereru.

**Výstup:** obsahově dokončitelná kampaň od Noci bez ozvěny po Prázdný trůn.

**Přesunuto:** lidský balancing, ruční průchod bez vývojových zkratek, unikátní art každé lokace, výkonové QA na iPhonu, přístupnost, Opus distribuce a release packaging patří do Milníku 12.

## 12 — QA, přístupnost, výkon a vydání — HOTOVO PRO RC

- 53 automatických testovacích skupin a úplná regrese,
- save v12 s checksumem, rotační zálohou a migrací v11,
- export a import uložené pozice,
- automatické ukládání,
- profily kvality vykreslení,
- vysoký kontrast, větší text, reduced motion a volitelný kříž,
- focus trap a obnovení fokusu v modálních dialozích,
- PWA manifest, instalační ikony a offline service worker,
- GitHub Pages deployment workflow,
- audio preload mimo kritickou cestu menu,
- převod 22,1 MiB WAV banky na přibližně 3 MiB MP3,
- release dokumentace a QA checklist.

**Výstup:** release candidate 1.0.0-rc.1.

**Zbývá před 1.0 final:** lidské dohrání, fyzický iPhone/Safari, offline PWA test, balancing a opravy nalezené playtestem.
