# Předávací protokol — Milník 12

**Verze:** 1.0.0-rc.1  
**Save formát:** 12  
**Stav:** release candidate, nikoli finální certifikované vydání

## Dokončený rozsah

- PWA manifest, ikony a service worker,
- cache-first načítání statických assetů a runtime cache audia,
- GitHub Pages workflow s testovací bránou,
- čtyři profily kvality vykreslení,
- nastavení kontrastu, velikosti textu, omezení pohybu, kříže a dotykové opacity,
- přístupnější viewport bez blokování zoomu,
- popis canvasu pro asistivní technologie,
- viditelný fokus a focus trap modálních dialogů,
- obnovení fokusu po zavření dialogu,
- automatické ukládání,
- rotační záloha save,
- checksum integrity,
- import a export save JSON,
- migrace save verze 11,
- asynchronní načítání audia bez blokování menu,
- převod 64 WAV souborů na MP3,
- reprodukovatelný audio integrity index,
- oprava duplicitní položky v mapování UI.

## Měřitelné výsledky

- 10 oblastí,
- 50 questů,
- 183 entit,
- 60 setkání,
- 48 JavaScriptových modulů,
- 53 testovacích skupin,
- 64 MP3 souborů,
- přibližně 3,0 MiB komprimovaného audia místo 22,1 MiB PCM.

## Ověření

Úspěšně proběhlo:

- úplná regrese Milníků 01–11,
- kontrola map, přechodů a dynamických mechanismů,
- simulace celé hlavní kampaně,
- všech devět epilogů,
- všechny čtyři fáze Mor-Kharra,
- renderer smoke test všech oblastí,
- kontrola PNG atlasů,
- kontrola MP3 banky včetně SHA-256 každého souboru,
- PWA manifest a service worker kontrakt,
- preference a persistence,
- poškozený save a recovery ze zálohy,
- import/export save,
- statická přístupnost,
- release velikostní rozpočty,
- čisté spuštění přes HTTP a dostupnost produkčních souborů.

## Neověřeno

- kompletní ruční dohrání kampaně,
- fyzický iPhone a Safari,
- Bluetooth audio, přerušení hovorem a dlouhodobé uspání PWA,
- subjektivní mastering,
- výkon na širokém vzorku zařízení,
- finální ekonomický a bojový balancing.

Pokus o browserový screenshot přes Chromium a virtuální displej byl technicky spuštěn, ale lokální URL i `file://` byly zablokovány organizační browserovou politikou. Výsledek proto není prezentován jako vizuální QA.
