# Systém postav — technická specifikace Milníku 03

## Datová architektura

- `src/data/classes.js` — atributy, třídy, růst životů/many, třídní limity a odolnosti.
- `src/data/skills.js` — patnáct dovedností, kategorie, popisy, mistrovství a cena výcviku.
- `src/data/party.js` — čtyři původní hrdinové, biografie a počáteční profily.
- `src/systems/PartyManager.js` — zkušenosti, úrovně, přepočty, výcvik, stavy a serializace.

Renderer, questový engine a dialogy neobsahují logiku vývoje postav. Svět komunikuje s družinou přes `PartyManager`.

## Úrovně a zkušenosti

Celkové zkušenosti nutné pro úroveň `L`:

```text
floor(100 × (L - 1)^1.65)
```

První prahy:

- úroveň 1: 0 XP,
- úroveň 2: 100 XP,
- úroveň 3: 313 XP.

Každý postup poskytuje:

- 3 atributové body,
- 2 dovednostní body,
- třídní růst maximálních životů a many.

Questová zkušenost v Milníku 03 je přidělena v uvedené hodnotě každému živému členovi družiny, nikoli rozdělena čtyřmi.

## Atributy

- Síla
- Odolnost
- Intelekt
- Duch
- Přesnost
- Rychlost
- Štěstí

Atributy mají aktuální limit 40. Zvýšení atributu okamžitě přepočítá odvozené statistiky, přičemž procentuální stav současných životů a many zůstane zachován.

## Mistrovství dovedností

- 0 — Neznalý
- 1–3 — Novic
- 4–6 — Expert
- 7–9 — Mistr
- 10 — Velmistr

Cena další hodnosti:

- hodnosti 0–3: 1 bod,
- hodnosti 4–6: 2 body,
- hodnosti 7–9: 3 body.

Každá třída má vlastní maximální hodnost jednotlivých dovedností.

## Stavy

Implementované stavy:

- zdravý,
- zraněný — méně než 35 % maximálních životů,
- v bezvědomí — životy klesnou na nulu,
- mrtvý — jednorázové poškození překročí současné životy o alespoň další plnou hodnotu maximálních životů.

Běžné léčení může probudit postavu v bezvědomí, ale nemůže oživit mrtvou postavu. Odpočinek obnovuje živým členům životy i manu; mrtvé neoživuje.
