# Milník 01 — předávací protokol

## Co bylo dokončeno

Technická kostra byla vytvořena nově jako modulární projekt. Původní monolitický prototyp nebyl použit jako základ architektury.

### Funkční oblasti

1. **Herní smyčka**
   - pevný simulační krok 1/60 sekundy,
   - oddělené aktualizace a vykreslování,
   - ochrana proti velkým časovým skokům po návratu do okna.

2. **Renderer**
   - vlastní raycasting přes DDA,
   - 60° zorné pole,
   - procedurální textury kamene, dřeva a živého plotu,
   - depth buffer pro správné překrývání billboardů,
   - mlha podle vzdálenosti a retro pixelové vykreslování.

3. **Svět**
   - datově definovaná mapa 24 × 24 polí,
   - kolizní rádius hráče,
   - kolize s pevnými entitami,
   - interakce podle vzdálenosti, směru pohledu a přímé viditelnosti,
   - serializovatelný stav světa.

4. **Ovládání**
   - klávesnice,
   - pointer lock a pohyb myši,
   - virtuální joystick,
   - dotykové otáčení na pravé části obrazu,
   - dotyková tlačítka pro interakci a menu.

5. **Uživatelské rozhraní**
   - titulní obrazovka,
   - čtyřčlenný panel družiny,
   - minimapa a režim celé mapy,
   - log událostí,
   - kontextová nápověda interakcí,
   - pauza, ovládání a technický overlay.

6. **Perzistence a zvukový prototyp**
   - verzovaný formát uložené pozice,
   - pokračování z hlavního menu,
   - syntetické kroky, UI zvuky a jednoduchá ambientní sekvence.

7. **Kvalita**
   - validátor struktury a průchodnosti map,
   - test dosažitelnosti entit,
   - simulační test pohybu, kolizí, interakce a obnovení snapshotu,
   - syntax check všech modulů,
   - GitHub Actions workflow.

## Co záměrně není součástí milníku 01

- příběhové questy,
- větvené dialogy,
- boj a nepřátelská AI,
- inventář a vybavení,
- zkušenosti a rozvoj postav,
- skutečné grafické assety,
- hotový soundtrack a zvuková banka,
- více lokací.

Tyto části mají vlastní milníky, aby nebyly promíchány s technickým jádrem.

## Přijímací kritéria

- [x] projekt se obejde bez externích runtime knihoven,
- [x] každý JavaScript soubor projde kontrolou syntaxe,
- [x] mapa je uzavřená a start je na průchozím poli,
- [x] všechny entity jsou dosažitelné,
- [x] hráč neprojde stěnou mapy,
- [x] interakce respektuje vzdálenost a směr pohledu,
- [x] stav lze serializovat a obnovit,
- [x] rozhraní obsahuje dotykové ovládání.

## Známé omezení testovacího prostředí

Automatické testy logiky a syntaxe proběhly úspěšně. Headless Chromium v tomto kontejneru nedokázal vytvořit grafický kontext, proto nebyl pořízen automatický screenshot canvas rendereru. Vykreslování je nutné při nasazení ověřit ještě v reálném Safari/Chrome.
