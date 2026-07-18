# Technická specifikace předmětového systému

## Datové vrstvy

- `src/data/items.js` — definice předmětů, slotů, vzácností a startovní výbavy,
- `src/data/lootTables.js` — vážené deterministické loot tabulky,
- `src/data/vendors.js` — obchodníci, marže, výkupní sazby a počáteční zásoby.

## Systémové vrstvy

- `InventoryManager` — batoh, hmotnost, sloty, vybavení, spotřební předměty a snapshot,
- `VendorManager` — ceny, zásoby, nákup, prodej a persistence,
- `LootManager` — deterministický PRNG a vyhodnocení loot tabulek,
- `PartyManager` — přijetí bonusů vybavení a přepočet statistik,
- `World` — transakční integrační rozhraní pro UI, questy a ukládání.

## Vybavení

Každý člen družiny má sloty:

1. hlavní ruka,
2. vedlejší ruka,
3. zbroj,
4. přilba,
5. boty,
6. prsten,
7. amulet.

Vybavení je uloženo mimo samotný profil postavy. `World` po každé změně sestaví součet bonusů a předá jej `PartyManager.syncEquipmentBonuses()`. Díky tomu je inventář jediným zdrojem pravdy a postavy nezískají trvalé bonusy po sundání předmětu.

## Nosnost

Kapacita batohu je:

```text
42 + 1,45 × součet Síly + 1,8 × součet Atletiky
```

Hmotnost vybavení se zobrazuje zvlášť. Batoh má současně maximálně 36 různých typových stohů. Identické kusy výbavy lze ukládat v jednom stohu, protože unikátní instance a stav opotřebení budou zavedeny až v soubojovém milníku.

## Ceny

Nákupní cena vychází z hodnoty předmětu a marže obchodníka. Sleva je odvozena z nejlepší Diplomacie v družině a pověsti, maximálně však 28 %.

Výkupní cena používá základní výkupní sazbu obchodníka a bonus diplomacie/pověsti, maximálně 20 % nad základní sazbu.

Úkolové předměty a předměty s nulovou hodnotou nelze prodat.

## Deterministická kořist

`LootManager` používá hash řetězce `oblast:entity` a malý deterministický generátor náhodných čísel. Stejná schránka proto poskytne stejný obsah bez ohledu na počet načtení uložené hry. Stav `looted:<entityId>` zaručuje jednorázové otevření.

## Migrace

Při načtení starší pozice bez `inventoryState` systém:

1. vytvoří startovní výbavu Milníku 04,
2. načte starý slovníkový inventář,
3. převede známé předměty do nových stohů,
4. zachová staré questy, příznaky, postavy a polohu,
5. sloučí stav starých entit s aktuální mapou, aby nové truhly a stánky nezmizely.
