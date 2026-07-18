# Předávací protokol — Milník 07

## Stav

Milník 07 je funkčně uzavřen. Projekt navazuje na Milník 06 a zachovává motor, příběh, questy, družinu, inventář, ekonomiku, souboje i magii.

## Dokončený rozsah

- samostatný modul `EnemyAI`,
- samostatný A* `Pathfinder`,
- šest archetypů protivníků,
- osm mapových bojových jednotek před dynamickými summon jednotkami,
- pět taktických rolí,
- tři skupiny se sdíleným poplachem,
- osm nepřátelských schopností,
- čtyři nové negativní stavové efekty,
- podpůrná ochranná aura,
- ústup a flankování střelců,
- návrat jednotek na domovskou pozici,
- třífázový boss Dozorce zlomené ozvěny,
- dynamické přivolání dvou živých ozvěn,
- zobrazení boss fáze a ochranného štítu v HUD,
- ukládání AI, boss fáze a dynamických jednotek,
- migrace uložených pozic verze 6.

## Automatická kontrola

Úspěšně prošlo 29 testovacích skupin:

1. mapy,
2. simulace světa,
3. zdrojové moduly,
4. příběhová data,
5. data postav,
6. postup družiny,
7. questový průchod,
8. questové zkušenosti,
9. dialogy,
10. HTML kontrakt,
11. data předmětů,
12. inventář,
13. ekonomika,
14. loot,
15. migrace inventáře,
16. data nepřátel,
17. soubojový průchod,
18. základní soubojová AI,
19. soubojová persistence,
20. data schopností,
21. průchod magie,
22. stavové efekty,
23. persistence magie,
24. data pokročilé AI,
25. A* navigace,
26. skupinový poplach a smečka,
27. nepřátelské schopnosti,
28. boss fáze,
29. persistence AI a summon jednotek.

## Opravené problémy během vývoje

- Dynamicky přivolané jednotky původně nebyly při obnovení světa připojeny k základním entitám mapy. Obnovení nyní slučuje mapové a dynamické entity.
- Boss schopnosti byly omezeny minimální fází, aby Ničivý puls nebyl dostupný před třetí fází.
- Přechod fáze nyní vynutí okamžitou přechodovou schopnost místo náhodné jiné akce.
- Negativní periodický efekt na družině nyní skutečně způsobuje poškození; původní tickovací logika podporovala u družiny pouze léčení.

## Známá omezení

- Navigace je dlaždicová a neobsahuje navmesh ani lokální steering davu.
- Jednotky se vyhýbají pevným entitám přes kolizní kontrolu, ale neplánují více tras současně kolem pohyblivého davu.
- Telegraphing boss schopností je textový a efektový; finální animované telegraphy patří do Milníku 09.
- Aktuální projekt stále obsahuje pouze jednu oblast.
- Grafika a audio jsou převážně procedurální zástupné zdroje.

## Vizuální smoke test

V dostupném pracovním kontejneru nebyl headless Chromium považován za spolehlivý kvůli dříve ověřeným omezením DBus, NETLINK a `inotify`. Vizuální průchod proto není označen jako automaticky potvrzený. Syntax, data, logika, mapa, persistence a herní scénáře prošly testy.

## Následující milník

Milník 08: více oblastí, přechody, dveře, páky, pasti, tajné stěny, dungeon a základní denní doba.
