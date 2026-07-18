# Soubojový systém — technická specifikace Milníku 05

## Cíl

Milník 05 přidává do existujícího RPG samostatnou bojovou vrstvu. Souboj není zadrátovaný do rendereru: data protivníků, simulace boje, svět, vykreslení, vstup a zvuk zůstávají oddělené.

## Moduly

- `src/data/enemies.js` — archetypy protivníků a jejich vyvážení,
- `src/systems/CombatSystem.js` — cílení, cooldowny, AI, projektily, zásahy, smrt a persistence,
- `src/world/World.js` — integrační rozhraní pro boj, kolize, zkušenosti a loot,
- `src/render/Raycaster.js` — bojové billboardy, projektily, životy cíle a feedback zásahů,
- `src/ui/Hud.js` — cílový panel, bojový stav, recovery a taktická pauza,
- `src/core/InputManager.js` a `src/core/Game.js` — ovládání desktopu a dotyku,
- `src/core/AudioManager.js` — syntetické zbraně, zásahy a taktické signály.

## Útok družiny

Aktivní člen družiny útočí klávesou `R`, `Enter`, levým tlačítkem myši po uzamčení kurzoru nebo dotykovým tlačítkem **Útok**.

Typ základního útoku určuje zbraň v hlavní ruce:

- meč a palcát — okamžitý útok zblízka,
- luk — rychlý fyzický projektil,
- hůl — pomalejší spirituální projektil,
- beze zbraně — krátký fyzický útok.

Výpočet používá atributy, hodnost příslušné dovednosti, odvozený útok nebo sílu kouzel, iniciativu, kritickou šanci, zbroj cíle a malý deterministický rozptyl.

## Recovery

Každý člen má vlastní dobu zotavení. Vyšší iniciativa a zbraňová dovednost ji zkracují. Přepnutí aktivní postavy proto umožňuje střídat připravené členy družiny namísto čekání na jediný globální cooldown.

## Cílení

Automatický cíl musí být:

- živý a viditelný,
- v dostřelu použité zbraně,
- blízko středu obrazovky,
- v přímé viditelnosti bez zdi.

Klávesa `Tab` nebo tlačítko **Další cíl** cyklicky přepíná dostupné protivníky. Zamčený cíl se zobrazuje samostatným panelem a pruhem života.

## Protivníci

Milník obsahuje pět archetypů:

1. Ozvěnový honič — rychlý lehký útočník,
2. Bahenní lezoun — pomalý obrněný protivník s jedovým poškozením,
3. Popelavý nájezdník — střelec,
4. Dutý strážce — těžký spirituální bojovník,
5. Dozorce zlomené ozvěny — odolný střelecký boss.

Na mapě je šest samostatných bojových setkání.

## Základní AI

Současná AI podporuje:

- aggro podle vzdálenosti a line-of-sight,
- přechod z klidu do pronásledování,
- jednoduchý lokální pohyb s kolizemi,
- útok podle dosahu a cooldownu,
- projektilové útoky,
- omezený leash od domovské pozice,
- výběr člena družiny jako cíle.

Pokročilé patrolování, navigační pole, skupinové role, ústup a boss fáze zůstávají součástí Milníku 07.

## Poškození a obrana

Fyzické poškození snižuje odvozená obrana postavy nebo armor protivníka. Elementární a spirituální poškození používá odpovídající odolnost. Výsledné poškození má vždy minimum jeden bod.

Systém respektuje stavy:

- zdravý,
- zraněný,
- v bezvědomí,
- mrtvý.

Po vyřazení posledního schopného člena se zobrazí obrazovka porážky.

## Smrt a kořist

Poražený protivník:

- přestane mít kolizi,
- změní sprite na ostatky,
- přidělí zkušenosti celé přeživší družině,
- odešle questovou událost `kill`,
- vytvoří jednorázovou loot interakci.

Obsah ostatků je deterministický, takže opakované načtení nemění hod.

## Taktická pauza

Klávesa `T` nebo dotykové tlačítko **Taktika** zastaví:

- pohyb družiny,
- pohyb a útoky protivníků,
- projektily,
- cooldowny.

Během pauzy lze změnit aktivního člena, cíl, vybavení nebo použít spotřební předmět. Aktivní útok je povolen až po opětovném spuštění času.

## Persistence

Uložená pozice verze 5 obsahuje:

- životy, aggro, cooldown a smrt každého protivníka,
- cooldowny členů družiny,
- vybraný cíl,
- stav taktické pauzy,
- stav deterministického generátoru boje.

Pozice Milníků 04, 03 a 02 lze načíst. Chybějící bojová data se vytvoří bezpečně z aktuální mapy.
