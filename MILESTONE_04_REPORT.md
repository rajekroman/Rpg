# Předávací protokol — Milník 04

## Stav

**Dokončeno jako samostatně spustitelná verze navazující na celý obsah Milníku 03.**

## Implementovaný rozsah

- 32 definovaných předmětů,
- 5 úrovní vzácnosti,
- 7 slotů vybavení pro každého ze 4 hrdinů,
- startovní výbava odpovídající třídám,
- třídní a dovednostní požadavky,
- dvoruční zbraně a blokace vedlejší ruky,
- bonusy útoku, obrany, iniciativy, kouzel, léčení, kritické šance, životů, many a odolností,
- sdílený batoh s nosností a typovými stohy,
- léčivé a manové spotřební předměty,
- cestovní dávky vyžadované pro odpočinek,
- 3 deterministické loot tabulky,
- 3 nové jednorázové schránky ve světě,
- 2 obchodníci s oddělenými zásobami,
- nákup a prodej,
- ceny podle diplomacie a pověsti,
- persistence inventáře, vybavení, obchodů a kořisti,
- migrace snapshotů Milníku 03 a 02.

## Architektura

Nové moduly:

- `src/data/items.js`
- `src/data/lootTables.js`
- `src/data/vendors.js`
- `src/systems/InventoryManager.js`
- `src/systems/LootManager.js`
- `src/systems/VendorManager.js`

Integrační změny:

- `World.js` zajišťuje transakce a migraci,
- `PartyManager.js` přijímá dočasné bonusy vybavení,
- `Game.js` vykresluje inventář, vybavení a obchod,
- `Hud.js` zobrazuje hmotnost a rozlišuje obchody a kořist na mapě,
- `Raycaster.js` vykresluje stánky, truhly a bedny,
- `SaveManager.js` používá verzi 4 a načítá verze 3 a 2.

## Automatická kontrola

Příkaz `npm test` spouští původní regresní testy a nové scénáře:

1. validita 32 definic předmětů,
2. správnost startovní výbavy,
3. integrita loot tabulek a obchodních zásob,
4. equip, unequip a vrácení předmětu do batohu,
5. dvoruční zbraň a vedlejší ruka,
6. přepočet statistik po změně výbavy,
7. použití léčivého lektvaru,
8. spotřeba cestovní dávky při odpočinku,
9. nákup a odečtení zásob,
10. prodej a připsání zlata,
11. vliv diplomacie a pověsti na cenu,
12. determinismus kořisti,
13. nemožnost vybrat truhlu dvakrát,
14. persistence vybrané truhly,
15. migrace starého inventáře a zachování nových entit.

## Nalezená a opravená chyba

Během nových testů byla nalezena chyba, kdy nebylo možné sundat druhý identický kus nestohovatelné výbavy, protože batoh reprezentoval každý typ pouze jedním stohovým klíčem. Výbava nyní podporuje více identických kusů v typovém stohu. Test equip/unequip tuto regresi pokrývá.

## Vizuální ověření

Chromium v kontejneru opět nedokončil headless běh kvůli omezením DBus, síťového namespace a file watcherů. Automaticky jsou ověřeny syntax, moduly, data, HTML kontrakt, herní logika, questy, postavy, inventář, obchod, loot a migrace. Praktické vizuální ověření je potřeba provést v Safari nebo běžném Chrome.

## Přesunutý rozsah

Původně plánované procedurální affixy, identifikace a opravy nejsou v této verzi falešně označeny jako dokončené. Budou implementovány spolu se souboji a unikátními instancemi předmětů, protože teprve tehdy existuje opotřebení a nepřátelský drop.

## Další milník

**Milník 05 — soubojový systém v reálném čase.**
