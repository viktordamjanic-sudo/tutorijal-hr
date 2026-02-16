import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Seed script to populate tasks from news
export const seedFromNews = mutation({
  args: {},
  handler: async (ctx) => {
    // Predefined tasks that match our news
    const tasks = [
      {
        title: "🚲 Mali planer: Rasporedi 45 bicikala",
        icon: "🚲",
        scenario: "Grad Zagreb kupio je 45 bicikala za zaposlenike. Treba ih rasporediti na 16 lokacija.",
        problem: "Kako optimizirati raspodjelu 45 bicikala na 16 gradskih ureda?",
        aiPrompt: "Pomozi mi rasporediti 45 bicikala na 16 lokacija tako da svaka dobije razumnu količinu. Uzmi u obzir udaljenost i broj zaposlenih.",
        expectedOutcome: "AI generira raspored s objašnjenjem logike.",
        learningPoint: "AI je optimizator - pomaže pronaći najbolje rješenje za ograničene resurse.",
        difficulty: "intermediate" as const,
        targetAudience: "all" as const,
        category: "other",
        sourceNews: "Grad Zagreb kupio 45 bicikala",
        isActive: true,
      },
      {
        title: "🕵️ Detektiv: Analiziraj vijest o uhićenju",
        icon: "🕵️",
        scenario: "Pročitao si vijest o velikoj akciji USKOK-a i uhićenju gradonačelnika. Kako razumjeti što se događa?",
        problem: "Kritički proanaliziraj informacije iz medija i razumijeri kontekst.",
        aiPrompt: "Pročitaj ovu vijest o uhićenju i objasni mi: tko je uhićen, zašto, što to znači za građane? Budi objektivan i istakni što je činjenica, a što spekulacija.",
        expectedOutcome: "AI daje strukturiranu analizu događaja bez senzacionalizma.",
        learningPoint: "AI pomaže razumjeti složene vijesti, ali uvijek provjeri više izvora.",
        difficulty: "advanced" as const,
        targetAudience: "seniors" as const,
        category: "other",
        sourceNews: "Akcija USKOK-a, uhićen gradonačelnik",
        isActive: true,
      },
      {
        title: "📊 Analitičar: Što se događa s tržnicama?",
        icon: "📊",
        scenario: "Dolac je izgubio 92 prodavača nakon rekonstrukcije. Planirane investicije od 2.7M€ realizirane su tek 5.7%.",
        problem: "Analiziraj razliku između planiranog i ostvarenog. Zašto veliki projekti često kasne?",
        aiPrompt: "Analiziraj ovu situaciju: planirano 2.7M€, realizirano 5.7%. Koji su mogući razlozi? Što možemo naučiti o planiranju javnih projekata?",
        expectedOutcome: "AI nudi moguće objašnjenje probleme s implementacijom.",
        learningPoint: "Veliki projekti često imaju kašnjenja - AI pomaže razumjeti zašto.",
        difficulty: "intermediate" as const,
        targetAudience: "all" as const,
        category: "other",
        sourceNews: "Tržnice izgubile prodavače, slaba realizacija",
        isActive: true,
      },
      {
        title: "🌤️ Jutarnji pregled: Vrijeme i vijesti",
        icon: "🌤️",
        scenario: "Svako jutro želiš dobiti sažetak: vrijeme, top vijesti, promet. Kako automatizirati?",
        problem: "Kreiraj vlastitog agenta koji će ti svako jutro slati personalizirani pregled.",
        aiPrompt: "Pomozi mi napraviti raspored za jutarnjeg agenta: što treba provjeriti, gdje pronaći informacije, kako ih sažeti?",
        expectedOutcome: "AI daje plan za automatizaciju jutarnjeg pregleda.",
        learningPoint: "AI može pomoći dizajnirati automatizaciju, ne samo izvršavati zadatke.",
        difficulty: "beginner" as const,
        targetAudience: "all" as const,
        category: "other",
        sourceNews: "Jutarnje rutine i automatizacija",
        isActive: true,
      },
    ];

    const results = [];
    for (const task of tasks) {
      const id = await ctx.db.insert('tasks', {
        ...task,
        generatedAt: Date.now(),
      });
      results.push(id);
    }

    return { inserted: results.length, ids: results };
  },
});

// Clear all tasks (for testing)
export const clearTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query('tasks').collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    return { deleted: tasks.length };
  },
});
