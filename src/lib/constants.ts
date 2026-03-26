// Static data constants
import type { Task, Lesson } from '../types';

export const PREDEFINED_TASKS: Task[] = [
  {
    id: 'parking-1',
    title: '🚗 Parking Hero: Susjed na tvom mjestu',
    icon: '🚗',
    difficulty: 'beginner',
    targetAudience: 'seniors',
    category: 'parking',
    scenario: 'Susjed Marko ti već treći dan parkira na tvom rezerviranom mjestu. Ljuti se, ali ne želiš svađu — ipak živite u istoj zgradi. Želiš mu poslati poruku na WhatsApp, ali ne znaš kako to napisati da bude pristojno a jasno.',
    problem: 'Tvoj zadatak: napiši uputu (prompt) za AI koja će mu pomoći da ti sastavi savršenu poruku za Marka. Razmisli — što AI treba znati da napiše dobru poruku?',
    aiPrompt: 'Pomozi mi napisati WhatsApp poruku susjedu Marku koji mi parkira na rezerviranom mjestu. Želim biti pristojan ali jasan da me to smeta. Ton: susjedski, nimalo agresivno. Na kraju ponudi rješenje da se dogovorimo.',
    expectedOutcome: `📊 Ocjena prompta: ⭐⭐⭐

Odličan prompt! Evo poruke za Marka:

"Bok Marko! 😊 Htio sam te samo zamoliti u vezi parkinga — ono mjesto ispred ulaza (br. 12) je moje rezervirano, pa mi treba slobodno kad dođem. Pretpostavljam da možda nisi znao!

Ako ti je ikad teško naći mjesto, ja znam par slobodnih u okolici — mogu ti pokazati. Dogovorimo se, susjedi smo! 👋"

💡 Zašto je tvoj prompt bio odličan:
• Rekao si AI-ju TKO je Marko (susjed, ista zgrada)
• Zadao si TON poruke (pristojan, ne agresivan)
• Tražio si i RJEŠENJE (ponuda dogovora)
• Rezultat: poruka koju možeš odmah poslati!

Odličan prompt! 🌟`,
    learningPoint: 'AI ne zna ništa o tvojoj situaciji dok mu ne objasniš. Što mu više kažeš (tko, što, kako, kakav ton), to bolji odgovor dobiješ!',
  },
  {
    id: 'cooking-1',
    title: '🍲 Juhomat: Što skuhati od ostataka?',
    icon: '🍲',
    difficulty: 'beginner',
    targetAudience: 'all',
    category: 'cooking',
    scenario: 'U frižideru imaš: 2 krumpira, pola mrkve, jučerašnji pohani kotlet. Ne želiš bacati hranu.',
    problem: 'Kako iskoristiti ostatke i napraviti ukusan obrok?',
    aiPrompt: 'Imam: 2 krumpira, pola mrkve, jučerašnji pohani kotlet. Što mogu skuhati za brzu večeru? Recept za početnike.',
    expectedOutcome: `Jednostavni recept:

🥘 **Krumpir s kotletom u umaku**

**Sastojci:**
• 2 krumpira (narežite na kocke)
• Pohani kotlet (narežite na trakice)
• Pola mrkve (naribajte)
• 1 žlica ulja
• Sol, papar, malo brašna

**Priprema (15 minuta):**
1. Krumpire stavite kuhati u slanu vodu (10 min)
2. Na zagrijanom ulju propržite mrkvu (2 min)
3. Dodajte kotlet i podlijte malo vode od krumpira
4. Naspite žlicu brašna i miješajte dok ne zgusne
5. Ocijedite krumpire i pomiješajte s umakom

🍽️ Gotovo! Ukusan obrok bez bacanja hrane.`,
    learningPoint: 'AI je kuhar koji ne vidi u tvoj frižider - moraš mu reći što imaš!',
  },
  {
    id: 'language-1',
    title: '📚 Padež Hunter: Spasi vikinsko selo!',
    icon: '📚',
    difficulty: 'intermediate',
    targetAudience: 'kids',
    category: 'language',
    scenario: 'Zmaj napada vikinsko selo! Jedini način da ga zaustaviš je ispravno odgovoriti na padežna pitanja.',
    problem: 'Napiši prompt za AI koji će stvoriti vikinšku igru s padežnim pitanjima. Razmisli — koji padeži postoje i kakva pitanja AI treba smisliti da bude zabavno?',
    aiPrompt: 'Stvori igru: Vikinško selo napada zmaj. Daj mi 3 pitanja o padežima (genitiv, dativ, akuzativ) da ga porazim.',
    expectedOutcome: `🎮 **Vikinška avantura - Padeži!**

Zmaj šikne vatru! 🐉 Morate odgovoriti točno da zaštitite selo.

**Pitanje 1 (Genitiv):** Koga napada zmaj?
• Seljana → SELJANA (od koga? genitiv)
• Konja → KONJA (od koga? genitiv)
• Vikinško selo → VIKINŠKOG SELA (od čega? genitiv)

**Pitanje 2 (Dativ):** Kome treba pomoć?
• Seljani → SELJANIMA (kome? dativ množine)
• Vikinzima → VIKINZIMA (kome? dativ)

**Pitanje 3 (Akuzativ):** Koga spašavamo?
• Djecu → DJECU (koga? akuzativ)
• Seljane → SELJANE (koga? akuzativ)

🏆 Točno! Zmaj je poražen! Seljani slave hrabre vikinze!`,
    learningPoint: 'Padeži nisu dosadni - pomažu nam razumjeti tko radi što kome!',
  },
  {
    id: 'finance-1',
    title: '💰 Mali bankar: Planiraj tjedni proračun',
    icon: '💰',
    difficulty: 'intermediate',
    targetAudience: 'kids',
    category: 'finance',
    scenario: 'Dobiš 50 kuna tjednice. Želiš kupiti sladoled (8kn), spremiti dio, i kupiti poklon mami.',
    problem: 'Kako najbolje raspodijeliti novac?',
    aiPrompt: 'Imam 50 kuna. Želim sladoled (8kn), uštedjeti dio, i kupiti poklon. Pomozi mi napraviti plan.',
    expectedOutcome: `💰 **Tvoj tjedni proračun**

Raspoloživo: **50 kn**

| Stavka | Iznos | Preostalo |
|--------|-------|-----------|
| 🍦 Sladoled | 8 kn | 42 kn |
| 🎁 Poklon mami | 20 kn | 22 kn |
| 💾 Ušteda | 15 kn | 7 kn |
| 🆓 Slobodno | 7 kn | 0 |

**Savjet:** Možeš uštediti 15kn tjedno → 60kn mjesečno!

💡 **Alternativa:** Ako poklon košta 15kn, ostaje 12kn za uštedu.

🎯 Odluka je tvoja - AI ti daje opcije, ti biraš!`,
    learningPoint: 'AI je financijski savjetnik - pomaže planirati, ali ti donosiš odluke.',
  },
  {
    id: 'diplomacy-1',
    title: '🤝 Mali diplomat: Ljubazno odbij poziv',
    icon: '🤝',
    difficulty: 'advanced',
    targetAudience: 'all',
    category: 'diplomacy',
    scenario: 'Baka te zove na ručak, ali već imaš planove. Ne želiš je uvrijediti.',
    problem: 'Kako odbiti bez povrijediti osjećaje?',
    aiPrompt: 'Baka me zove na ručak u subotu, ali imam planove. Napiši ljubazan odgovor koji joj govori da je volim, ali ne mogu doći.',
    expectedOutcome: `💌 **Primjer odgovora baki:**

"Draga bako! ❤️ Hvala ti puno na pozivu, baš mi je drago što si mislila na mene! Teta mi je već najavila da dolazi u subotu pa smo se dogovorili da provedemo dan zajedno.

Ali evo - idući vikend sam slobodan/slobodna! Možemo li onda mi doći? Rado bih te vidio/vidjela i pomogao/pomogla s pripremama ako treba. Volim tvoje ručke! 😊

Pusa, [ime]"

✅ **Zašto ovo funkcionira:**
• Zahvaljujuće (ne odbija odmah)
• Daje razlog (teta dolazi)
• Nudi alternativu (idući vikend)
• Pokazuje ljubav (volim ručke)`,
    learningPoint: 'AI pomaže pronaći prave riječi za teške razgovore.',
  },
];

export const LESSONS: Lesson[] = [
  { id: 1, title: 'Osnovni setup', description: 'Pokreni svog prvog agenta', icon: '🚀', color: 'blue', path: '/lekcija/1' },
  { id: 2, title: 'Dva agenta', description: 'Bolji od jednog', icon: '👥', color: 'green', path: '/lekcija/2' },
  { id: 3, title: 'Lošija od tri', description: 'Kada je previše?', icon: '⚖️', color: 'orange', path: '/lekcija/3' },
  { id: 4, title: 'Što su skillsi?', description: 'Proširi mogućnosti', icon: '🧰', color: 'purple', path: '/lekcija/4' },
  { id: 5, title: 'Prva automatizacija', description: 'Jutarnji pregled', icon: '🎉', color: 'green', path: '/lekcija/5' },
  { id: 6, title: 'Dodaj pravi skill', description: 'last30days primjer', icon: '🔌', color: 'indigo', path: '/lekcija/6' },
];

export const SKILL_DEFINITIONS = {
  scraper: {
    name: 'Scraper Skill',
    icon: '📰',
    description: 'Čitanje vijesti s web stranica',
    config: { sources: ['jutarnji.hr'], interval: '1h' },
  },
  messaging: {
    name: 'Messaging Skill',
    icon: '💬',
    description: 'Slanje poruka na razne platforme',
    config: { platform: 'telegram' },
  },
  weather: {
    name: 'Weather Skill',
    icon: '🌤️',
    description: 'Dohvaćanje vremenske prognoze',
    config: { city: 'Zagreb', units: 'metric' },
  },
  calendar: {
    name: 'Calendar Skill',
    icon: '📅',
    description: 'Upravljanje kalendarom i podsjetnicima',
    config: { reminders: ['1h', '1d'] },
  },
  traffic: {
    name: 'Traffic Skill',
    icon: '🚗',
    description: 'Praćenje prometnih informacija',
    config: { city: 'Zagreb' },
  },
  quote: {
    name: 'Quote Skill',
    icon: '💭',
    description: 'Generiranje inspirativnih citata',
    config: { category: 'inspirational' },
  },
};
