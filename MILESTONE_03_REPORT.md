# Předávací protokol — Milník 03

## Stav

**Dokončeno jako samostatně spustitelná verze navazující na celý obsah Milníku 02.**

## Implementovaný rozsah

- 4 samostatní členové družiny,
- 4 třídy s rozdílným růstem a limity,
- 7 atributů,
- 6 odolností,
- 15 dovedností v pěti kategoriích,
- 4 úrovně mistrovství a stav Neznalý,
- zkušenostní křivka do úrovně 50,
- atributové a dovednostní body,
- 7 odvozených statistik,
- zdraví, zranění, bezvědomí a smrt,
- odpočinek bez automatického oživování,
- aktivní člen družiny a rychlá volba 1–4,
- interaktivní obrazovka postavy,
- questové zkušenostní odměny,
- verzované ukládání Milníku 03,
- migrace uložené pozice Milníku 02 do nového modelu.

## Herní výsledek

Kompletní průchod prologem udělí každému členovi:

- hlavní quest: 180 XP,
- Kupecká brašna: 75 XP,
- Listy pod bledým měsícem: 80 XP,
- celkem: 335 XP.

To dostačuje k postupu celé družiny na úroveň 3 a poskytne každému 6 atributových a 4 dovednostní body.

## Architektura

Nové moduly:

- `src/data/classes.js`
- `src/data/skills.js`
- `src/data/party.js`
- `src/systems/PartyManager.js`

Upravené integrační vrstvy:

- `World.js` poskytuje questovým odměnám a UI jednotné rozhraní družiny,
- `Hud.js` dynamicky vykresluje životy, manu, úroveň, stav a aktivní postavu,
- `Game.js` vytváří obrazovku postav a obsluhuje přidělování bodů,
- `SaveManager.js` používá verzi 3 a umí načíst starší snapshot Milníku 02.

## Automatická kontrola

Příkaz `npm test` ověřuje:

1. validitu a průchodnost mapy,
2. kolize, interakce a snapshot světa,
3. syntaktickou a strukturální kontrolu zdrojových modulů,
4. questová a dialogová data,
5. úplnost čtyř hrdinů, čtyř tříd, atributů, odolností a dovedností,
6. postup úrovně 1 → 2 → 3,
7. udělení bodů při postupu,
8. zvýšení atributu a přepočet životů,
9. výcvik dovednosti a přepočet útoku,
10. bezvědomí, probuzení léčením a smrt,
11. nemožnost běžným léčením oživit mrtvou postavu,
12. kompletní hlavní a vedlejší questové průchody,
13. zkušenostní odměny a dosažení úrovně 3,
14. bezeztrátový snapshot družiny,
15. HTML kontrakt mezi `Game.js` a `index.html`.

## Vizuální ověření

Pokus o automatický běh Chromium v dostupném kontejneru opět selhal před načtením stránky kvůli omezenému systémovému prostředí Chromium/DBus. Výsledný canvas a interaktivní modal proto nebyly automaticky vizuálně potvrzeny. Logika, syntax, datové vazby, ukládání a HTML kontrakt prošly testy.

## Co nebylo označeno za hotové

- souboje a nepřátelská AI,
- vybavení a inventářová obrazovka,
- aktivní kouzla a schopnosti,
- oživování a léčba stavů pomocí předmětů či magie,
- finální grafické a zvukové assety.

## Další milník

**Milník 04 — inventář, vybavení, předměty, loot a ekonomika.**
