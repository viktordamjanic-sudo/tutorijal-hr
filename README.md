# 🎓 tutorijal.hr

**AI za svakodnevne heroje** — Edukativna platforma koja uči djecu i starije kako koristiti AI asistente za rješavanje stvarnih problema.

## 🎯 Koncept

- **Parking Hero** 🚗 — Kako ljubazno zamoliti susjeda da pomakne auto
- **Juhomat** 🍲 — Što skuhati od ostataka u frižideru
- **Padež Hunter** 📚 — Učenje hrvatskih padeža kroz igre
- **Mali bankar** 💰 — Planiranje proračuna za djecu
- **Mali diplomat** 🤝 — Ljubazna komunikacija u teškim situacijama

## 🚀 Quick Start

```bash
# 1. Clone i uđi u direktorij
cd tutorijal-he

# 2. Instaliraj ovisnosti
npm install

# 3. Postavi environment variables
cp .env.example .env
# Uredi .env i dodaj svoje API ključeve

# 4. Pokreni development server
npm run dev

# 5. Otvori http://localhost:4321
```

## 🏗️ Tehnologija

| Komponenta | Tehnologija |
|------------|-------------|
| **Framework** | [Astro](https://astro.build) — brz, SEO-friendly |
| **Frontend** | React + Tailwind CSS |
| **Backend** | Convex (predloženo) ili SQLite lokalno |
| **AI** | Claude API (Anthropic) ili OpenAI |
| **Scraper** | Python SQLite baza (postojeći projekt) |

## 🔌 Integracija sa Scraperom

Platforma se povezuje s postojećim `code/scraper` projektom:

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Jutarnji.hr    │────▶│   Scraper    │────▶│   SQLite DB     │
│  (vijesti)      │     │   (Python)   │     │  (headlines.db) │
└─────────────────┘     └──────────────┘     └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   tutorijal.hr  │◀────│  AI Generator│◀────│   News Fetcher  │
│   (Astro + AI)  │     │  (Claude API)│     │   (TypeScript)  │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

### Automatsko generiranje zadataka

1. Scraper pokupi vijesti iz Jutarnjeg/Večernjeg
2. AI analizira vijest i stvara edukativni zadatak
3. Zadatak se pojavi u "Svježi zadaci" sekciji
4. Korisnik uči na aktualnim, stvarnim primjerima

## 📁 Struktura projekta

```
tutorijal-he/
├── src/
│   ├── components/      # React komponente (LiveFeed, itd.)
│   ├── layouts/         # Astro layouti
│   ├── lib/            # Utility funkcije
│   │   ├── aiTaskGenerator.ts    # Claude API integracija
│   │   └── newsIntegration.ts    # Scraper connection
│   └── pages/          # Astro stranice
│       ├── index.astro         # Početna
│       └── modul/
│           └── [id].astro      # Detalji modula
├── public/             # Static assets
└── package.json
```

## 🎮 Kako funkcionira?

### Za korisnike:
1. **Zabavno** — Pogleda simpatičan video/sliku s problemom
2. **Shvati** — Vidi kako AI razmišlja o rješenju
3. **Isprobaj** — Upiše svoj prompt i vidi rezultat
4. **Podijeli** — Spasi rješenje za kasnije

### Za developere:
```typescript
// AI generira zadatak iz vijesti
const task = await generateTaskFromNews({
  title: "Grad Zagreb kupio 45 bicikala",
  description: "Službeni bicikli za zaposlenike...",
  category: "Zagreb"
});

// Rezultat:
{
  title: "🚲 Mali planer: Kako rasporediti 45 bicikala",
  scenario: "Grad ima 45 bicikala i 16 lokacija...",
  aiPrompt: "Pomozi mi rasporediti 45 bicikala na 16 lokacija...",
  // ...
}
```

## 🔧 Environment Variables

```env
# AI API
CLAUDE_API_KEY=sk-ant-api03-xxx
OPENAI_API_KEY=sk-xxx

# Database (SQLite path to existing scraper)
SCRAPER_DB_PATH=/Users/gaba/code/scraper/headlines.db

# Convex (optional - for real-time features)
PUBLIC_CONVEX_URL=https://xxx.convex.cloud
```

## 📝 Todo

- [ ] Povezivanje sa stvarnim scraperom (SQLite)
- [ ] Convex backend za real-time zadatke
- [ ] Voice input (speech-to-text) za starije
- [ ] Gamification (bodovi, bedževi, rang liste)
- [ ] Mobilna aplikacija (PWA)
- [ ] Višejezičnost (hr, en)

## 🤝 Contributing

Ovo je edukativni projekt otvorenog koda. Svi prijedlozi dobrodošli!

## 📜 Licenca

MIT © 2026 tutorijal.hr

---

**Napomena:** Platforma je u aktivnom razvoju. Demo sadrži mock podatke dok se ne poveže sa stvarnim scraperom.
