# Changelog

## 1.0.0-rc.1 — Milník 12

### Přidáno

- PWA manifest, instalační ikony a service worker,
- automatizovaný GitHub Pages deployment,
- profily kvality vykreslení a nastavení přístupnosti,
- focus trap modálních dialogů a obnovení fokusu,
- autosave, checksum a rotační záloha uložené hry,
- export a import save JSON,
- pět nových release testovacích skupin.

### Změněno

- save formát zvýšen na verzi 12 s migrací verze 11,
- audio se načítá na pozadí a již neblokuje menu,
- 64 WAV souborů bylo převedeno na přibližně 3 MiB MP3,
- viewport již neblokuje uživatelské zvětšení,
- titulní obrazovka a dokumentace používají označení Release Candidate 1.0.

### Opraveno

- poškozený hlavní save se obnoví z předchozí zálohy,
- neplatný JSON save již nezablokuje fallback,
- odstraněna duplicitní položka mapování titulní obrazovky,
- modální dialogy nepouštějí klávesový fokus do pozadí.

### Ověření

- prochází 53 testovacích skupin,
- PWA, preference, save recovery, přístupnost a release budget mají vlastní testy,
- MP3 soubory jsou kontrolovány pomocí SHA-256 indexu.

### Známé omezení

RC nebyl kompletně ručně dohrán na fyzickém iPhonu. Chromium v pracovním prostředí blokovala organizační politika lokálních URL, takže browserový screenshot není považován za dokončené vizuální QA.

## 0.11.0 — Milník 11

### Přidáno

- sedm nových oblastí a rozšíření tří původních oblastí,
- obsahově uzavřená hlavní kampaň o 20 úkolech,
- 30 vedlejších questů a sedm zakázkových tabulí,
- tři frakce s oddělenou reputací,
- dvě zásadní příběhová rozhodnutí,
- devět variant epilogu,
- dvanáct nových předmětů,
- Mor-Kharr jako čtyřfázový závěrečný boss,
- ukládání kampaně, frakcí, epilogu a dynamických boss jednotek,
- šest nových testovacích skupin kampaně, boss fightu, epilogů a rendereru.

### Změněno

- svět nyní obsahuje 10 oblastí, 183 entit a 60 bojových setkání,
- questový registr obsahuje přesně 20 hlavních a 30 vedlejších questů,
- deník zobrazuje reputaci všech tří frakcí,
- titulní obrazovka spouští celou kampaň namísto označení prologu,
- audio scény obsluhují nové oblasti pomocí existujících hudebních a ambientních témat,
- formát uložené hry byl zvýšen na verzi 11 s migrací verze 10.

### Ověření

- prochází 48 testovacích skupin,
- automaticky prošla kompletní hlavní příběhová osa,
- ověřeno je všech devět kombinací epilogu,
- Mor-Kharr prošel čtyřmi fázemi a save/restore,
- všech deset oblastí bylo vykresleno v renderer smoke testu,
- úplná regrese Milníků 01–10 zůstala zelená.

### Známé omezení

Kampaň je obsahově dokončitelná, ale dosud neprošla lidským balancingem ani úplným ručním playtestem na fyzickém iPhonu. Nové oblasti převážně znovu používají stávající grafické a zvukové atlasy. Release připravenost je rozsahem Milníku 12.

## 0.10.0 — Milník 10

### Přidáno

- osm WAV hudebních témat pro menu, lokace, den/noc, boj a boss fight,
- tři dlouhé ambientní smyčky,
- 53 krátkých zvukových efektů,
- kroky na trávě, kameni a kryptové podlaze,
- samostatné zvuky čtyř zbraní a šesti nepřátelských archetypů,
- zvuky zásahů, magie, questů, pastí, dveří, páky a UI,
- Web Audio mixer pro master, hudbu, prostředí, efekty a UI,
- dynamics compressor, crossfade a scénické přepínání,
- titulní a pauzové nastavení hlasitosti,
- persistence audio nastavení,
- deterministický generátor `tools/generate_audio.py`,
- tři nové automatické audio testy.

### Změněno

- původní procedurální oscilátorový `AudioManager` byl nahrazen souborovým WAV pipeline,
- hlavní bootstrap načítá grafiku a audio souběžně,
- bojové notifikace nesou konkrétní zvukové cue pro zásah, útok a smrt monstra,
- hudba reaguje na oblast, denní dobu, aktivní boj a boss fight,
- formát uložené hry byl zvýšen na verzi 10 s migrací verze 9.

### Ověření

- všech 42 testovacích skupin prochází,
- ověřeno je 64 RIFF/WAVE souborů v PCM 16 bit / 22 050 Hz,
- ověřeno je 22,1 MiB audio dat,
- testován je preload, dekódování, crossfade, samply, mixer a scénická volba hudby,
- HTTP server vrátil stav 200 pro HTML, audio manifest, hudbu, ambient a efekt.

### Známé omezení

Fyzický iPhone, Bluetooth výstup, přerušení hovorem a subjektivní mastering nebyly v pracovním prostředí ověřeny. Zvuky zatím nepoužívají úplný 3D vzdálenostní model a WAV distribuce bude před release vhodná k převodu do Opus.

## 0.9.0 — Milník 09

### Přidáno

- sedm externích PNG atlasů a čtyři samostatné portréty,
- 262 atlasových buněk: textury stěn a podlah, objekty, protivníci, zbraně, efekty a UI ikony,
- centralizovaný manifest `src/data/assets.js`,
- asynchronní `AssetManager` s výřezy atlasů a kontrolou chyb načítání,
- stavový automat animací nepřátel pro klid, pohyb, útok, zásah a smrt,
- animované zbraně aktivní postavy v pohledu první osoby,
- bitmapové portréty družiny a ikony předmětů i schopností,
- deterministický generátor `tools/generate_assets.py`,
- přehled grafické sady `ASSET_PREVIEW.png`,
- pět nových testovacích skupin grafického pipeline a save verze 9.

### Změněno

- renderer používá PNG textury jako hlavní vizuální zdroj,
- procedurální kresba zůstává pouze jako nouzový fallback,
- stěny používají texturované sloupce a podlahy scanline škálování,
- billboardy vybírají snímek podle skutečného stavu souboje a AI,
- projektily a kouzla používají efektový atlas,
- formulář inventáře, obchod, hotbar a HUD používají atlasové ikony,
- `main.js` čeká na preload assetů před vytvořením hry,
- formát uložené pozice byl zvýšen na verzi 9 s migrací verze 8.

### Opraveno

- smrt protivníka má krátký vizuální přechod před změnou na ostatky,
- cesty k assetům jsou odvozeny z `import.meta.url` a fungují v podadresáři GitHub Pages,
- nearest-neighbour škálování je vynuceno v canvasu i CSS,
- selhání jediného PNG souboru již nezpůsobí prázdnou herní obrazovku.

### Ověření

- všech 39 testovacích skupin prochází,
- validováno je 38 JavaScriptových modulů, 7 atlasů, 4 portréty a 262 buněk,
- renderer asset smoke test provedl 1 805 externích bitmapových vykreslení,
- lokální HTTP server vrátil stav 200 pro HTML, hlavní modul i nepřátelský atlas,
- save verze 9 i migrace verze 8 prošly automatickým scénářem.

### Známé omezení

Billboardy jsou zatím pouze čelní a nemají osm směrových pohledů. Prostředí používá omezenou sdílenou sadu textur a grafika není prezentována jako finální produkční art celé kampaně. Headless Chromium nedokončil screenshot kvůli DBus, NETLINK, EGL a `inotify`; fyzický iPhone a Safari nebyly automaticky ověřeny.

## 0.8.0 — Milník 08

### Přidáno

- datově definovaný registr tří oblastí,
- Průsmyk Stříbrné brány a Krypta zlomených ozvěn,
- čtyři obousměrné přechody a cílové spawn body,
- systém uchování stavu entit v každé oblasti,
- `EnvironmentSystem` pro čas, mechanismy, pasti a dynamické dlaždice,
- tři dveřní mechanismy včetně klíčového a pákového zámku,
- páka tichého zvonu,
- odhalitelná tajná stěna,
- tři pasti s detekcí, zneškodněním, resetem a poškozením,
- denní cyklus se čtyřmi fázemi a podzemním osvětlením,
- přepínání hudební sekvence podle oblasti a světla,
- hlavní quest Pod Stříbrnou bránou,
- předměty Klíč správce krypty a Zrcadlové stříbro,
- pět nových testovacích skupin včetně renderer smoke testu.

### Změněno

- formát uložené pozice byl zvýšen na verzi 8,
- lze migrovat pozice verzí 2 až 7,
- `World` ukládá všechny oblasti, nikoli pouze aktuální mapu,
- renderer čte dynamickou dlaždici přes `world.getTile`,
- exteriér reaguje na denní světlo a dungeon používá trvale nízkou hladinu světla,
- minimapa rozlišuje přechody, pasti a mechanismy,
- osmihodinový odpočinek posouvá herní kalendář.

### Opraveno

- dynamické změny dveří a tajných stěn se po návratu do oblasti neztratí,
- přivolané jednotky z Milníku 07 zůstávají součástí per-zone persistence,
- dveře nelze zavřít přes hráče nebo viditelnou entitu,
- jednorázové pasti se po obnovení hry znovu neaktivují.

### Ověření

- všech 34 testovacích skupin prochází,
- validovány jsou 3 oblasti, 57 entit a 4 přechody,
- renderer smoke test vykreslí všechny oblasti a dynamickou geometrii bez runtime výjimky,
- lokální HTTP server vrací hlavní soubory se stavem 200,
- headless Chromium screenshot není kvůli systémovým omezením označen jako úspěšný.

### Známé omezení

Grafika a audio zůstávají převážně procedurální. Plnohodnotné počasí, finální textury, sprite animace, nahraná hudba a rozsah kompletní kampaně nejsou součástí tohoto milníku.

## 0.7.0 — Milník 07

### Přidáno

- samostatný modul `EnemyAI`,
- A* navigace v modulu `Pathfinder`,
- pět taktických rolí protivníků,
- skupinový poplach a sdílená poslední známá pozice družiny,
- osm nepřátelských schopností,
- čtyři negativní efekty: otrava, odhalená obrana, umlčení a otřesení,
- smečkový buff, podpůrná ochranná aura a ranged flankování,
- dvě další mapové bojové jednotky,
- dynamický archetyp Živá ozvěna,
- třífázový boss Dozorce zlomené ozvěny,
- přivolání dvou dynamických posil ve druhé fázi,
- zobrazení boss fáze a ochranného štítu v HUD,
- šest nových testovacích skupin AI.

### Změněno

- formát uložené pozice byl zvýšen na verzi 7,
- lze načíst uložené pozice verzí 6 až 2,
- svět při obnovení slučuje mapové a dynamicky vytvořené entity,
- nepřátelský pohyb již není pouze přímý; používá periodicky přepočítávanou cestu,
- střelci udržují odstup, ustupují a hledají flankovací pozici,
- poškození protivníků respektuje ochranné aury AI,
- nepřátelské projektily mohou aplikovat stavové efekty,
- periodické negativní efekty družiny nyní způsobují poškození,
- umlčení blokuje pouze kouzla, nikoli fyzické schopnosti.

### Opraveno

- dynamicky přivolané jednotky již po načtení uložené hry nezmizí,
- boss schopnosti jsou omezeny minimální fází,
- přechodová schopnost boss fáze se provede okamžitě,
- AI stav se bezpečně vytvoří při migraci pozice Milníku 06.

### Ověření

- všech 29 testovacích skupin prochází,
- A* našel průchozí trasu přes celou prologovou oblast,
- automatické scénáře ověřují skupinový poplach, nepřátelské schopnosti, všechny boss fáze a save/restore summon jednotek,
- vizuální headless test není kvůli omezením systémového Chromium označen jako úspěšný.

### Známé omezení

Projekt stále obsahuje jednu oblast a procedurální zástupnou grafiku a audio. Dveře, pasti, tajné stěny, více zón a první dungeon jsou rozsahem Milníku 08.

## 0.6.0 — Milník 06

### Přidáno

- samostatný `MagicSystem`,
- 16 třídních kouzel a aktivních schopností,
- devět stavových efektů,
- mana, cooldowny, úrovňové a dovednostní požadavky,
- osmipoziční rychlá lišta pro každého člena družiny,
- kniha kouzel s přidělováním schopností do hotbaru,
- magické a schopnostní projektily,
- plošné útoky a řetězový blesk,
- léčení, regenerace, party buffy, očištění a oživení,
- zpomalení, omráčení, hoření a blesková zranitelnost,
- elementární odolnosti všech pěti archetypů protivníků,
- zobrazení stavů družiny i zaměřeného nepřítele,
- nové procedurální zvukové odezvy magie,
- čtyři nové testovací skupiny magie a stavů.

### Změněno

- formát uložené pozice byl zvýšen na verzi 6,
- lze načíst uložené pozice verzí 5, 4, 3 a 2,
- klávesy `1–8` nyní používají hotbar,
- volba člena družiny se přesunula na `F1–F4`,
- obrana, kritická šance, recovery a elementární poškození reagují na aktivní efekty,
- nepřátelská AI respektuje zpomalení a omráčení,
- renderer rozlišuje ohnivé, mrazivé a schopnostní projektily.

### Opraveno

- metoda oživení nyní může při explicitním kouzle navrátit i mrtvou postavu,
- stav aplikovaný projektilovým kouzlem se přenáší až při skutečném zásahu,
- odpočinek čistí dočasné efekty a cooldowny.

### Ověření

- všechny regresní testy Milníků 01–05 procházejí,
- všechny nové testy schopností, magie, stavů a persistence procházejí,
- systémový Chromium v kontejneru opět nedokončil screenshot kvůli DBus, NETLINK a inotify omezením; vizuální kontrola není uváděna jako úspěšná.

### Známé omezení

Nepřátelské sesílání kouzel, přerušování, pokročilé skupinové reakce a vícefázové boss souboje budou řešeny v Milníku 07. Grafika i audio jsou nadále převážně procedurální a zástupné.

## 0.5.0 — Milník 05

### Přidáno

- samostatný `CombatSystem`,
- pět archetypů nepřátel a šest setkání,
- boss Dozorce zlomené ozvěny,
- útoky zblízka, lukem a holí,
- fyzické a spirituální projektily,
- automatické cílení a přepínání cíle,
- individuální recovery každého člena družiny,
- hit chance, evasion, armor, odolnosti a kritické zásahy,
- základní aggro, pronásledování, ranged AI a leash,
- taktická pauza,
- cílový panel, životy nepřítele a combat feedback,
- smrt protivníka, zkušenosti a prohledávatelné ostatky,
- pět nových nepřátelských loot tabulek,
- obrazovka porážky družiny,
- desktopové a dotykové bojové ovládání,
- procedurální zvuky útoku a taktického režimu,
- testy nepřátelských dat, melee, projektilů, AI, pauzy a save/restore.

### Změněno

- formát uložené pozice byl zvýšen na verzi 5,
- lze načíst pozice verzí 4, 3 a 2,
- renderer zobrazuje nepřátele, ostatky, projektily a čísla poškození,
- minimapa rozlišuje živé protivníky a ostatky,
- svět poskytuje obecné line-of-sight a kolizní rozhraní pro pohyblivé entity,
- severní část prologové mapy nyní obsahuje bojová setkání,
- Popelavý nájezdník byl umístěn mimo počáteční aggro vzdálenost nové hry.

### Ověření

- všechny regresní testy Milníků 01–04 procházejí,
- všechny nové bojové testy procházejí,
- systémový Chromium v kontejneru nedokončil screenshot kvůli DBus, NETLINK a file-watcher omezením; tato kontrola není uváděna jako úspěšná.

### Známé omezení

Aktivní magie, stavové a plošné efekty budou řešeny v Milníku 06. Pokročilá navigace, skupinová AI a vícefázové boss souboje patří do Milníku 07. Procedurální affixy a opotřebení vybavení zůstávají odloženy do doby, kdy bude stabilní magie a finální drop model.

## 0.4.0 — Milník 04

### Přidáno

- 32 předmětů v pěti úrovních vzácnosti,
- sedm slotů vybavení pro každého člena družiny,
- sdílený batoh, 36 typových slotů a nosnost,
- startovní výbava všech čtyř tříd,
- třídní a dovednostní požadavky předmětů,
- dvoruční zbraně a automatická správa vedlejší ruky,
- bonusy statistik a odolností z vybavení,
- léčivé a manové spotřební předměty,
- cestovní dávky spotřebovávané při odpočinku,
- tři deterministické loot tabulky a tři schránky,
- dva obchodníci s vlastními zásobami,
- nákup, prodej a cenový model diplomacie/pověsti,
- inventářová a obchodní obrazovka pro desktop i dotyk,
- nové sprite zástupné modely truhel, beden a stánků,
- testy předmětů, inventáře, ekonomiky, kořisti a migrace.

### Změněno

- odvozené statistiky postav zahrnují aktuální vybavení,
- HUD zobrazuje hmotnost batohu a nosnost,
- formát uložené pozice byl zvýšen na verzi 4,
- starší uložené pozice verzí 3 a 2 lze načíst,
- staré entity se při migraci slučují s aktuální mapou,
- odpočinek vyžaduje cestovní dávku,
- mapa rozlišuje NPC, sběrné předměty, obchody a kořist.

### Opraveno

- sundání druhého identického kusu vybavení již neblokuje limit jednoho typového stohu,
- neúspěšný sběr kvůli plnému batohu nyní zobrazí upozornění,
- lektvar se nespotřebuje, pokud nemůže obnovit žádné životy nebo manu.

### Známé omezení

Unikátní instance, procedurální affixy, identifikace, opotřebení a opravy se přesouvají k Milníku 05, kde budou propojeny se souboji a dropy nepřátel. Headless Chromium nelze v dostupném kontejneru spolehlivě spustit kvůli systémovým omezením DBus a namespace.

## 0.3.0 — Milník 03

### Přidáno

- čtyři samostatní hrdinové s původními biografiemi,
- čtyři herní třídy s rozdílným růstem životů, many a třídními limity,
- sedm atributů a šest odolností,
- patnáct dovedností a mistrovství Neznalý, Novic, Expert, Mistr a Velmistr,
- zkušenostní křivka, úrovně a body rozvoje,
- odvozené statistiky útoku, obrany, iniciativy, kouzel, léčení, kritické šance a velení,
- stavy zdravý, zraněný, v bezvědomí a mrtvý,
- odpočinek družiny,
- obrazovka postav s přidělováním bodů,
- volba aktivní postavy přes portréty a klávesy 1–4,
- zkušenostní odměny všech tří questů,
- testy dat postav, postupu, stavů a questových zkušeností.

### Změněno

- HUD družiny se aktualizuje podle skutečného stavu postav,
- formát uložené pozice byl zvýšen na verzi 3,
- starší uložené pozice Milníku 02 lze migrovat při načtení,
- dokončení dostupného prologu přivede družinu na úroveň 3,
- pauza a titulní obrazovka popisují aktuální systém družiny.

### Známé omezení

Automatický vizuální test Chromium se v kontejneru nepodařilo spustit kvůli systémovému grafickému/DBus prostředí. Automatická kontrola pokrývá logiku, data, mapy, syntax, questové průchody, postup postav a HTML kontrakt.

## 0.2.0 — Milník 02

- questový a dialogový engine,
- hratelný prolog se třemi questy,
- deník, questové předměty, zlato a pověst.

## 0.1.0 — Milník 01

- raycastingový renderer,
- ovládání, mapa, kolize, interakce, HUD a ukládání.
