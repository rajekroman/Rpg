# Předávací protokol — Milník 02

## Stav

**Dokončeno jako samostatně spustitelný příběhový vertical slice.**

## Implementovaný rozsah

- 3 questové definice,
- 7 celkových questových fází,
- 8 objektivů včetně počítaného sběru,
- 3 dialogové stromy,
- 25 dialogových uzlů,
- podmíněné vstupní uzly a volby,
- 13 entit v herní oblasti,
- 6 sbíratelných nebo příběhově interaktivních objektů,
- zlato, pověst a klíčové předměty,
- deník a HUD tracker,
- verzované ukládání kompletního stavu.

## Architektura

Nové moduly:

- `src/data/quests.js`
- `src/data/dialogues.js`
- `src/systems/ConditionEvaluator.js`
- `src/systems/QuestManager.js`
- `src/systems/DialogueManager.js`

Renderer neobsahuje žádnou questovou logiku. Questové a dialogové definice jsou oddělené od `Game.js`; svět poskytuje pouze operace nad stavem, předměty a událostmi.

## Automatická kontrola

Příkaz `npm test` ověřuje:

1. validitu a průchodnost mapy,
2. kolize a snapshot světa,
3. bezpečnost a neprázdnost zdrojových modulů,
4. odkazy mezi questy, fázemi a dialogovými uzly,
5. kompletní hlavní quest,
6. oba vedlejší questy,
7. výpočet odměn,
8. větvení dialogu,
9. uložení a obnovení příběhového stavu,
10. existenci všech HTML prvků požadovaných herním kontrolerem.

## Co nebylo označeno za hotové

- vizuální end-to-end test canvasu,
- soubojový systém,
- detailní obrazovka inventáře,
- postup postav,
- více lokací,
- finální grafické a zvukové assety.

## Další milník

**Milník 03 — družina, atributy, dovednosti a postup.**

Cílem bude nahradit statické hodnoty členů družiny skutečným datovým modelem postav, přidat zkušenosti, úrovně, dovednostní body, stavové efekty a obrazovku detailu postavy.
