# Technická specifikace AI — Milník 07

## Architektura

Pokročilé chování protivníků je rozděleno do tří vrstev:

1. `Pathfinder` provádí omezené A* hledání cesty po dlaždicové mapě.
2. `EnemyAI` spravuje stavové automaty, skupiny, taktické role, cooldowny schopností, boss fáze a dynamické přivolávání jednotek.
3. `CombatSystem` zůstává autoritou pro poškození, projektily, smrt, zkušenosti a kořist.

Renderer ani HUD nerozhodují o chování protivníků. Čtou pouze aktuální stav.

## Stav AI jednotky

Každá entita protivníka má perzistentní `brain` obsahující:

- taktickou roli,
- skupinu,
- režim a aktuální záměr,
- čas dalšího rozhodování,
- vypočtenou cestu a aktuální waypoint,
- cooldowny nepřátelských schopností,
- dočasné buffy a ochranné aury,
- morálku,
- boss fázi,
- stav jednorázového přivolání posil,
- poslední známou pozici družiny.

## Navigace

A* pracuje s čtyřsměrnou mřížkou a kontrolou volného prostoru podle poloměru entity. Cesta se nepřepočítává každý snímek; jednotka ji obnovuje v intervalech a okamžitě při zablokování.

Navigace řeší:

- obcházení stěn,
- návrat na domovskou pozici,
- přibližování k družině,
- ústup střelců,
- flankovací body kolem hráče.

## Skupiny a poplach

Jednotky mohou mít `groupId`. Když jedna jednotka družinu uvidí nebo utrpí poškození, přenese poslední známou pozici členům stejné skupiny v dosahu volání.

Aktuální skupiny:

- `north-hunt` — smečka honičů a bahenní lezoun,
- `southern-raiders` — jižní nájezdníci,
- `warden-court` — Dozorce a jeho obrněná ochrana.

## Taktické role

- `assassin` — rychlé přiblížení a tlak zblízka,
- `bruiser` — přímé pronásledování a vysoká odolnost,
- `skirmisher` — udržování vzdálenosti, ústup a flankování,
- `support` — ochranné schopnosti pro spojence,
- `boss` — fáze, unikátní schopnosti a přivolávání jednotek.

## Nepřátelské schopnosti

1. Smečkový řev — zvýší útok a rychlost skupiny.
2. Jedový chrchel — projektil s periodickou otravou.
3. Potlačovací střela — projektil s debuffem obrany.
4. Ochranný puls — aura snižující poškození okolních spojenců.
5. Kopí ozvěny — spirituální projektil způsobující umlčení.
6. Vlna zlomu — plošné poškození a odhalená obrana.
7. Povolání ozvěn — dynamicky vytvoří dvě živé ozvěny.
8. Ničivý puls — plošný bleskový útok třetí boss fáze.

## Boss: Dozorce zlomené ozvěny

### Fáze 1 — Uzavřená schránka

- používá základní spirituální útok,
- sesílá Kopí ozvěny,
- drží si odstup.

### Fáze 2 — První zlomená pečeť

Spustí se pod 70 % života.

- okamžitě povolá dvě živé ozvěny,
- získá přístup k Vlně zlomu,
- jeho dvůr sdílí poplach a ochranné aury.

### Fáze 3 — Odkrytá ozvěna

Spustí se pod 35 % života.

- zvýší rychlost a poškození,
- okamžitě použije Ničivý puls,
- pokračuje bez původního obranného tempa.

## Persistence

Uložená pozice verze 7 obsahuje:

- mozky všech jednotek,
- skupinové stavy,
- boss fázi,
- nepřátelské cooldowny,
- náhodný deterministický stav AI,
- dynamicky přivolané entity,
- jejich soubojový stav.

Při načtení pozice verze 6 se AI mozky vytvoří z aktuálních dat bez ztráty ostatních systémů.
