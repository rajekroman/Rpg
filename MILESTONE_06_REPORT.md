# Předávací protokol — Milník 06

## Stav

Milník 06 je funkčně uzavřen. Projekt navazuje na Milník 05 a zachovává příběh, questy, družinu, inventář, ekonomiku i soubojový systém.

## Rozsah

- 16 schopností,
- 9 stavových efektů,
- 4 třídní hotbary,
- 8 rychlých pozic na postavu,
- 5 elementárně odlišných profilů nepřátel,
- kniha kouzel,
- desktopové i dotykové ovládání,
- ukládání verze 6 a migrace verzí 5–2.

## Automatická kontrola

Úspěšně prošly všechny testovací skupiny:

1. mapy,
2. simulace světa,
3. syntax a moduly,
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
18. soubojová AI,
19. soubojová persistence,
20. data schopností,
21. průchod magie,
22. stavové efekty,
23. persistence magie.

Kontroly pokrývají mimo jiné manu, cooldown, projektilový zásah, periodické poškození, léčení, party buff, plošné kouzlo, vypršení stavů, očištění, regeneraci, hotbar a migraci uložené pozice Milníku 05.

## Vizuální smoke test

Systémový Chromium v dostupném kontejneru nedokončil headless screenshot. Proces skončil na omezeních DBus, NETLINK a `inotify`. Vizuální test proto není označen jako úspěšný. Syntax, datové kontrakty a logika prošly automatickou kontrolou.

## Známé technické riziko

Před zahájením Milníku 07 je vhodné provést praktický průchod v Safari na iPhonu a v desktopovém Chrome, zejména kvůli hustotě osmipozičního hotbaru, chování modální knihy kouzel a zvukové politice mobilních prohlížečů.

## Následující milník

Milník 07: pokročilá AI, navigace, skupinové chování, nepřátelské schopnosti a vícefázové boss souboje.
