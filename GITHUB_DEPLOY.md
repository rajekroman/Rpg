# GitHub deployment

Cílový repozitář: `rajekroman/Rpg`

## Stav konektoru

Repozitář je zcela prázdný a nemá první commit ani existující větev `main`. GitHub konektor umí zapisovat pouze do existující větve; Contents API i Git Data API proto vrací `404 Link not found`.

## Jednorázová inicializace

1. Otevřete repozitář `rajekroman/Rpg` na GitHubu.
2. Zvolte vytvoření souboru `README.md` nebo tlačítko **Add a README**.
3. Potvrďte commit přímo do větve `main`.
4. Poté lze přes GitHub konektor zapsat projekt a otevřít pull request nebo commitovat přímo.

## Ruční git varianta

```bash
git clone https://github.com/rajekroman/Rpg.git
cd Rpg
unzip /cesta/Rpg-Milnik-12.zip
# zkopírujte obsah rozbalené složky do kořene repozitáře
git add .
git commit -m "Release candidate 1.0"
git push origin main
```

Po nahrání nastavte v **Settings → Pages → Build and deployment** zdroj **GitHub Actions**. Workflow `.github/workflows/pages.yml` provede testy a nasazení automaticky.
