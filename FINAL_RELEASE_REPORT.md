# Final Release Report — Professional Visual Edition 2.0

## Stav

**Připraveno jako finální produkční balíček pro GitHub Pages.**

Edice 2.0 nahrazuje dětsky působící sprite pass a konfliktní mobilní HUD. Herní obsah, save formát a kampaň zůstávají kompatibilní.

## Dodané systémy

- nízkorozlišovací WebGL renderer s fallbackem,
- osm profesionálních materiálů prostředí,
- šest dospěle stylizovaných modelů nepřátel,
- detailní 3D zbraň v pohledu první osoby,
- čtyři finální portréty,
- 50 nových ikon předmětů a schopností,
- šest utility ikon,
- nová PWA vizuální identita,
- jednotný desktopový a landscape mobilní HUD,
- cache-busting a nová service-worker cache.

## Automatická validace

Celkem prošlo 53 testovacích skupin. Kontrolovány byly:

- 10 oblastí, 183 entit a 19 přechodů,
- 20 hlavních a 30 vedlejších úkolů,
- 9 zakončení,
- 7 nepřátelských typů a 60 setkání,
- čtyři fáze finálního bosse,
- inventář, obchodníci, loot, magie a stavy,
- AI, pathfinding a skupinové chování,
- save v12, migrace, checksum a záložní save,
- 64 MP3 souborů a audio mixer,
- PWA manifest, ikony, service worker a offline cache,
- přístupnost a preference,
- kontrakt profesionální vizuální edice.

## Kontrola kvality assetů

Finální web používá:

- kurátorované portréty místo procedurálních obličejů,
- věcné heraldické a výbavové ikony místo emoji či barevných koulí,
- materiály s řízenou texturou a tlumenou paletou,
- prostorové nepřátele s rozlišitelnou anatomií, výzbrojí a siluetou,
- jednu CSS vrstvu bez starých duplikovaných panelů.

## Distribuční omezení

Pracovní Chromium je administrátorskou politikou blokováno pro lokální, přesměrované i datové adresy. Nebyl proto vytvořen skutečný automatický browserový screenshot. Soubor `PROFESSIONAL_FINAL_PREVIEW.png` je výtvarná kompozice cílového rozhraní a nesmí být vydáván za snímek běžícího WebGL rendereru.

Před veřejným označením za stabilní build je vhodná poslední ruční kontrola na:

- iPhone landscape Safari,
- iPhone PWA spuštěná z plochy,
- desktopový Chromium/Safari/Firefox,
- zařízení s nižším výkonem a nastavením Low.
