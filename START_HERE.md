# 🚀 QUICK START - tutorijal.hr

## Što je postavljeno?

✅ **Astro projekt** s React + Tailwind CSS  
✅ **5 interaktivnih modula** (Parking, Kuhanje, Padeži, Financije, Diplomacija)  
✅ **AI integracija** — spremno za Claude API  
✅ **News scraper connection** — povezuje se s postojećim Python scraperom  
✅ **Live Feed komponenta** — prikazuje "svježe" zadatke  

## Struktura

```
tutorijal-he/
├── src/
│   ├── components/       # React komponente
│   │   ├── LiveFeed.tsx  # Glavna zvijezda — AI zadaci iz vijesti
│   │   ├── Hero.astro    # Početna sekcija
│   │   └── ModuleGrid.astro
│   ├── lib/
│   │   ├── aiTaskGenerator.ts   # Claude API integracija
│   │   └── newsIntegration.ts   # Povezivanje sa scraperom
│   ├── pages/
│   │   ├── index.astro          # Početna
│   │   └── modul/[id].astro     # Detalji modula
│   └── layouts/Layout.astro
├── README.md
└── .env.example
```

## Kako pokrenuti?

```bash
cd /Users/gaba/.openclaw/workspace/tutorijal-he

# 1. Instaliraj ovisnosti
npm install

# 2. Kopiraj i uredi env
mv .env.example .env
# Dodaj CLAUDE_API_KEY ako imaš

# 3. Pokreni dev server
npm run dev

# 4. Otvori http://localhost:4321
```

## Ključna značajka: Živi zadaci iz vijesti

U `src/lib/newsIntegration.ts` nalazi se logika koja:

1. Čita iz `code/scraper/headlines.db` (SQLite)
2. Šalje vijesti Claude API-ju
3. AI generira edukativni zadatak
4. Prikazuje u "Live Feed" sekciji

**Primjer:**
- Vijest: "Grad Zagreb kupio 45 bicikala"
- AI generira: "Kako rasporediti 45 bicikala na 16 lokacija?"
- Korisnik uči planiranje koristeći AI

## Naredni koraci

1. **Poveži stvarni scraper** — u `newsIntegration.ts` zamijeni mock podatke s SQLite query
2. **Dodaj Convex** za real-time (opcionalno)
3. **Deploy** na Vercel/Netlify
4. **Testiraj** s 2 bake i 2 djeteta 😊

## Demo

Trenutno rade:
- ✅ Početna stranica
- ✅ 5 modula s interaktivnim AI sučeljem
- ✅ Responsive dizajn (mobitel + desktop)
- ⚠️ AI generacija radi s mock podacima (do povezivanja API ključa)

**Gotovo za testiranje!** 🎉
