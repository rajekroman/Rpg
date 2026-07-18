# Technická specifikace magie — Milník 06

## Architektura

Magie je oddělena do datové a stavové vrstvy:

- `src/data/abilities.js` obsahuje definice schopností, stavů a výchozích hotbarů,
- `src/systems/MagicSystem.js` řeší odemykání, cílení, seslání, manu, cooldowny, efekty a persistence,
- `CombatSystem` poskytuje veřejné rozhraní pro poškození, projektily a výběr cílů,
- `World` propojuje magii s družinou, soubojem, ukládáním a UI,
- `Hud` vykresluje hotbar a stavové efekty.

## Datový model schopnosti

Každá schopnost definuje:

- třídu a druh (`spell` nebo `ability`),
- cílový režim,
- dosah a případný poloměr,
- cenu many,
- cooldown,
- minimální úroveň,
- požadovanou dovednost,
- jeden nebo více efektů.

Efekty mohou způsobit přímé, projektilové, plošné nebo řetězové poškození, léčit, oživovat, čistit nebo aplikovat stav.

## Cílové režimy

- `enemy` — zaměřený protivník,
- `enemyArea` — oblast kolem zaměřeného protivníka,
- `selfArea` — oblast kolem družiny,
- `ally` — živý člen družiny,
- `deadAlly` — mrtvý nebo bezvědomý člen,
- `self` — sesilatel,
- `party` — všichni živí členové.

Při rychlém léčení bez explicitního cíle je automaticky vybrán živý člen s nejnižším poměrem životů. Oživení vybírá prvního mrtvého nebo bezvědomého člena.

## Stavové efekty

Stav obsahuje zdroj, zbývající čas, sílu a časovač periodického ticku. Stejný efekt se nestohuje do nekontrolovaného počtu instancí; opakovaná aplikace obnoví dobu a použije vyšší sílu.

Podporované modifikátory:

- periodické poškození a léčení,
- násobitel rychlosti a útoku,
- bonus obrany, útoku, kritické šance a iniciativy,
- bonus elementárních odolností,
- násobitel recovery a přijatého poškození,
- zvýšené bleskové poškození.

## Projektily

Projektil nese vypočtené poškození, typ elementu, kritický příznak a seznam stavů. Stav se aplikuje pouze při skutečném zásahu cíle. Tím se zabrání efektu při minutí nebo nárazu do zdi.

## Persistence

Ukládá se:

- aktivní stav každého člena družiny,
- aktivní stav každého nepřítele,
- cooldown každé schopnosti,
- osm pozic hotbaru každého člena,
- pořadové číslo seslání pro deterministické kritické testy.

Při migraci Milníku 05 vzniknou prázdné efekty, nulové cooldowny a výchozí třídní hotbary.

## Omezení Milníku 06

- schopnosti nemají dobu sesílání,
- nepřátelé zatím nepoužívají stejný spellbook,
- chybí přerušení a proti-kouzla,
- výběr spojeneckého cíle z hotbaru je automatický,
- vizuální efekty jsou procedurální a nízkorozpočtové.
