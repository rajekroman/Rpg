# Systém světa — Milník 08

## Účel

Milník 08 převádí původní jedinou mapu na datově definovaný svět s více oblastmi. Každá oblast má vlastní mapu, spawn body, entity, pasti, prostředí a hudební sekvenci. `World` přepíná aktivní oblast, zatímco `EnvironmentSystem` spravuje změny geometrie a čas.

## Oblastní model

Každá oblast obsahuje:

- stabilní `id` a zobrazovaný název,
- číselnou mřížku mapy,
- rozměry a spawn body,
- seznam statických a dynamických entit,
- volitelný seznam pastí,
- typ prostředí `outdoor` nebo `dungeon`,
- denní a volitelnou noční hudební sekvenci.

Aktuálně existují tři oblasti:

| ID | Název | Prostředí | Úloha |
|---|---|---|---|
| `willowVale` | Vrbové údolí | exteriér | prolog, služby, questy a boss |
| `silverPass` | Průsmyk Stříbrné brány | exteriér | spojovací bojová oblast a klíč ke kryptě |
| `echoCrypt` | Krypta zlomených ozvěn | dungeon | první mechanismový dungeon |

## Přechody

Přechodová entita definuje cílovou oblast a cílový spawn. Při přechodu systém:

1. uloží stav entit právě opouštěné oblasti,
2. změní `zoneId`, mapu a spawn hráče,
3. obnoví dříve uložený stav cílové oblasti,
4. doplní chybějící základní nebo dynamické entity,
5. vyšle questovou událost `enterZone`,
6. zobrazí název oblasti a přepne hudební motiv.

Čtyři přechody tvoří dvě obousměrné vazby:

- Vrbové údolí ↔ Průsmyk Stříbrné brány,
- Průsmyk Stříbrné brány ↔ Krypta zlomených ozvěn.

## Dynamické dlaždice

Dveře, páky a tajné stěny nemění zdrojovou mapu. `EnvironmentSystem` udržuje vrstvu `tileOverrides`, která přepisuje konkrétní dlaždice pouze ve stavu uložené hry.

Výhody:

- původní mapa zůstává neměnná,
- každá oblast má vlastní sadu změn,
- otevřené průchody přežijí přechod mezi oblastmi,
- uloženou hru lze bezpečně obnovit,
- testy mohou porovnat výchozí a změněnou geometrii.

## Dveře

Dungeon obsahuje tři typy dveří:

1. běžné kamenné dveře,
2. dveře správce vyžadující `crypt-warden-key`,
3. rezonanční bránu vyžadující příznak z páky.

Dveře nelze zavřít, pokud ve dveřní dlaždici stojí hráč nebo viditelná entita. Klíč se po otevření nespotřebuje.

## Páka

Páka tichého zvonu je jednosměrný mechanismus. Aktivace:

- nastaví příznak `mechanism:crypt-lever`,
- otevře cílovou dlaždici rezonanční brány,
- odešle questovou událost,
- zůstane zachovaná v uložené hře.

## Tajná stěna

Tajná stěna je nejprve skrytá. Vnímání družiny ji může odhalit při přiblížení. Po interakci:

- se dlaždice stěny změní na průchozí,
- entita mechanismu se skryje,
- družina získá 35 zkušeností,
- stav se uloží a průchod zůstane otevřený.

## Pasti

Krypta obsahuje tři pasti:

| Past | Detekce | Zneškodnění | Účinek |
|---|---:|---:|---|
| Šipková past | 1 | 2 | 16 fyzického poškození jednomu cíli, reset 30 minut |
| Runa bolesti | 2 | 3 | 13 spirituálního poškození celé družině a Otřesení |
| Stropní zával | 3 | 4 | 26 fyzického poškození celé družině |

Detekce i zneškodnění používají nejlepší hodnotu Vnímání v družině. Neúspěšný pokus past okamžitě aktivuje. Stav `detected`, `disarmed`, `triggered` a čas poslední aktivace se ukládá.

## Denní cyklus

Hra začíná první den ve 20:15. Výchozí rychlost je 2,5 herní minuty za jednu reálnou sekundu.

Fáze dne:

- noc: 21:00–04:59,
- svítání: 05:00–07:59,
- den: 08:00–17:59,
- soumrak: 18:00–20:59.

Exteriér používá plynule vypočtené světlo. Dungeon má konstantní nízkou hladinu světla 0,18. Osmihodinový odpočinek posune herní čas o 480 minut.

Milník nepřidává plnohodnotné počasí. To je přesunuto do pozdějšího obsahového a vizuálního průchodu.

## Persistence a migrace

Formát uložené hry má verzi 8 a ukládá:

- aktivní oblast a hráčovu polohu,
- stav entit ve všech navštívených oblastech,
- dynamicky přivolané jednotky,
- mapové přepisy dlaždic,
- stav dveří, pák a tajných stěn,
- stav pastí,
- celkový herní čas a rychlost času,
- všechny dřívější systémy družiny, questů, inventáře, magie, souboje a AI.

Starší pozice z Milníků 02–07 se načtou do Vrbového údolí a nové environmentální struktury získají bezpečné výchozí hodnoty.

## Testovací pokrytí

Nové testy ověřují:

- přechody mezi všemi třemi oblastmi,
- zachování změněného stavu oblasti po návratu,
- běžné a zamčené dveře,
- klíč a páku,
- tajnou stěnu,
- detekci, zneškodnění a aktivaci pastí,
- poškození a stavové efekty pastí,
- denní fáze, odpočinek a podzemní světlo,
- snapshot a obnovení environmentálního systému,
- vykreslení všech oblastí a otevřené dynamické dlaždice bez runtime výjimky.
