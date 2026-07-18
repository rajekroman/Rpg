# Předávací protokol — Milník 08

## Stav

**Dokončeno jako samostatně spustitelný vývojový milník.**

Milník rozšiřuje verzi 0.7.0 o více oblastí, environmentální mechanismy, první dungeon a denní cyklus. Neoznačuje projekt za dokončenou profesionální hru ani za vizuálně finální produkt.

## Ověřený rozsah

- 3 oblasti,
- 57 mapových entit,
- 4 přechodové entity,
- 17 bojových setkání,
- 3 dveřní mechanismy,
- 1 klíčový zámek,
- 1 páka,
- 1 tajná stěna,
- 3 pasti,
- 4 questy,
- 34 předmětů,
- 35 JavaScriptových modulů,
- save formát verze 8.

## Nový obsah

### Průsmyk Stříbrné brány

- obousměrné napojení na Vrbové údolí,
- obousměrné napojení na kryptu,
- dvě skupiny protivníků a strážce schodiště,
- schránka průsmykové hlídky,
- klíč správce krypty,
- varovný kámen s příběhovým textem.

### Krypta zlomených ozvěn

- vstupní kamenné dveře,
- zamčené dveře správce,
- rezonanční brána,
- páka tichého zvonu,
- odhalitelný tajný průchod,
- pokladnice,
- oltář první ozvěny,
- tři různé pasti,
- dvě bojové skupiny a dvojice živých ozvěn.

### Quest

Nový hlavní quest `Pod Stříbrnou bránou` propojuje vstup do krypty, aktivaci páky a průzkum oltáře. Poskytuje zkušenosti, zlato, pověst a předmět Zrcadlové stříbro.

## Výsledky automatických testů

Příkaz `npm test` úspěšně dokončil všech 34 skupin:

- validace 3 map a jejich průchodnosti,
- simulace světa a kolizí,
- kontrola 35 JavaScriptových modulů,
- questy, dialogy, družina a postup,
- inventář, ekonomika a loot,
- boj, projektily a persistence,
- magie a stavové efekty,
- A* navigace, skupinová AI a boss fáze,
- přechody oblastí,
- dveře, klíč, páka a tajná stěna,
- pasti,
- denní cyklus,
- renderer smoke test všech tří oblastí.

Projekt byl také načten přes lokální HTTP server; `index.html` a `src/main.js` odpověděly HTTP 200.

## Vizuální ověření

Automatizovaný headless Chromium v dostupném kontejneru nedokončil vytvoření screenshotu. Proces blokovaly systémové chyby DBus, NETLINK a `inotify`. Tuto kontrolu proto neuvádíme jako úspěšnou.

Místo ní prošel izolovaný canvas renderer smoke test s falešným DOM/canvas kontextem. Ten potvrzuje, že všechny tři oblasti, sprite entity, noční překryv a dynamicky otevřená mapa lze vykreslit bez JavaScriptové výjimky. Nejde však o náhradu praktické kontroly vzhledu v Safari nebo Chrome.

## Známá omezení

- zástupné procedurální textury a sprity,
- bez finálních animací mechanismů a pastí,
- bez plnohodnotného počasí,
- bez nahrané hudby a zvukové banky,
- tři oblasti nejsou rozsahem plné kampaně,
- praktický test na fyzickém iPhonu není potvrzen,
- finální balancing dungeonových bojů a pastí bude vyžadovat manuální hraní.

## Kritéria přijetí

Milník je přijatelný jako technický základ Milníku 09, pokud:

1. projekt běží přes HTTP server,
2. všechny automatické testy projdou,
3. lze projít mezi třemi oblastmi,
4. stav oblastí zůstane zachován po návratu,
5. dungeonové mechanismy mění geometrii,
6. save/restore zachová čas, pasti a mechanismy,
7. další vývoj zachová datově definované rozhraní map.
