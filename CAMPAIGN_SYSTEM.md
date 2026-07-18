# Kampaň a frakční systém — Milník 11

## Cíl

Milník 11 mění předchozí prolog na obsahově uzavřenou kampaň. Hráč může od prvního questu dojít až k závěrečnému bossovi, zvolit dvě klíčová rozhodnutí a zobrazit odpovídající epilog.

## Struktura hlavní kampaně

Hlavní osa má přesně 20 questů. Začíná vyšetřením zhaslého mezníku ve Vrbovém údolí a pokračuje přes Kryptu zlomených ozvěn do Stříbrného přístavu. Odtud družina:

1. vyslechne tři městské frakce,
2. zvolí vedení expedice,
3. projde Popelavým pochodem,
4. vstoupí do Zatopeného opatství,
5. rozhodne o relikviáři paměti,
6. projde Skleněným hvozdem,
7. získá v Obsidiánovém archivu pravé jméno Mor-Kharra,
8. zvolí konečnou alianci,
9. zničí tři kotvy lži v Korunní citadele,
10. porazí Mor-Kharra v Prázdném trůnu.

## Vedlejší obsah

Třicet vedlejších questů je rozděleno mezi původní osobní zakázky a sedm tabulí kontraktů. Kontrakty používají stejné questové události jako hlavní kampaň:

- `kill`,
- `collect`,
- `inspect`,
- `discover`,
- `mechanism`,
- `dialogue`,
- `enterZone`.

Jednotlivé zakázky se po přijetí skryjí z tabule a jejich stav se ukládá přes společný `QuestManager`.

## Frakce

### Stříbrná hlídka

Prosazuje obranu, zákon a obnovitelnou přísahu. V epilogu přetaví Korunu ozvěn v novou pečeť.

### Svobodné karavany

Prosazují otevřené cesty a rozdělenou moc. V epilogu promění bránu v neutrální místo setkání.

### Obsidiánový archiv

Prosazuje uchování celé pravdy, včetně nebezpečných částí. V epilogu uzavře Mor-Kharrovo pravé jméno do černého skla.

Reputace každé frakce se ukládá samostatně. Ovlivňuje text závěru a je zobrazena v deníku.

## Rozhodnutí a epilogy

Kampaň používá dvě osy rozhodnutí:

1. finální aliance: Hlídka, Karavany nebo Archiv,
2. osud relikviáře: zničit, zachovat nebo přijmout jeho paměť.

Jejich kombinací vzniká devět unikátních ID epilogu. Text navíc reaguje na reputaci vítězné frakce a součet vztahů se všemi třemi frakcemi.

## Závěrečný boss

Mor-Kharr má 720 životů a čtyři fáze:

1. projektilová a spirituální kontrola prostoru,
2. pod 75 % života přivolá dvě živé ozvěny,
3. pod 45 % života použije Vlnu zlomu a odhalí obranu družiny,
4. pod 18 % života použije Ničivý puls a přejde do poslední podoby.

Fáze, cooldowny, přivolané entity a aktivní stavy se ukládají.

## Persistence

Save verze 11 ukládá:

- současnou oblast a stav všech oblastí,
- questy a příběhové příznaky,
- reputaci tří frakcí,
- zvolenou alianci a osud relikviáře,
- výsledný epilog a informaci, zda byl zobrazen,
- boss fázi a dynamicky přivolané jednotky,
- všechny systémy předchozích milníků.

SaveManager načítá uložené pozice verzí 10 až 2 a při prvním úspěšném načtení je uloží pod klíčem verze 11.

## Omezení

Automatické testy dokazují konzistenci dat a průchod hlavní logikou. Nedokazují však, že jsou všechny questy zábavné, tempo vyvážené nebo že hráč bez znalosti mapy vždy snadno pochopí další krok. Tyto otázky musí řešit ruční playtest v Milníku 12.
