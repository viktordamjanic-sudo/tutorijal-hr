'use client';

import type { Task, NewsItem } from '../types';
import { PREDEFINED_TASKS } from './constants';
import { fetchNewsFromScraper, generateId } from './utils';

/**
 * Fetches latest news and generates educational tasks
 */
export async function fetchAndGenerateTasks(): Promise<Task[]> {
  try {
    const recentNews = await fetchNewsFromScraper();
    const tasks: Task[] = [];
    
    for (const news of recentNews) {
      const task = await generateTaskFromNews(news);
      if (task) {
        tasks.push({
          ...task,
          sourceNews: news.title,
          generatedAt: new Date().toLocaleDateString('hr-HR'),
        });
      }
    }
    
    return tasks;
  } catch (error) {
    console.error('News Fetch Error:', error);
    return [];
  }
}

/**
 * Generates educational task from news using AI
 * In production, this would call Claude/OpenAI API
 */
async function generateTaskFromNews(newsItem: NewsItem): Promise<Task | null> {
  // Mock implementation - in production, this would call AI API
  const mockTasks: Record<string, Partial<Task>> = {
    'bicikala': {
      id: generateId(),
      title: '🚲 Mali planer: Rasporedi 45 bicikala',
      icon: '🚲',
      difficulty: 'intermediate',
      targetAudience: 'all',
      category: 'other',
      scenario: 'Grad Zagreb ima 45 novih bicikala i 16 lokacija. Kako ih najbolje rasporediti?',
      problem: 'Optimiziraj raspodjelu bicikala po gradskim uredima.',
      aiPrompt: 'Pomozi mi rasporediti 45 bicikala na 16 lokacija tako da svaka lokacija dobije razumnu količinu. Napravi plan.',
      expectedOutcome: 'AI generira raspored i objašnjava logiku.',
      learningPoint: 'AI je optimizator - pomaže pronaći najbolje rješenje za ograničene resurse.',
    },
    'uhićen': {
      id: generateId(),
      title: '🕵️ Detektiv: Analiziraj vijest',
      icon: '🕵️',
      difficulty: 'advanced',
      targetAudience: 'seniors',
      category: 'other',
      scenario: 'Pročitao si vijest o uhićenju. Kako razumjeti što se zapravo događa?',
      problem: 'Kritički proanaliziraj informacije iz medija.',
      aiPrompt: 'Pročitaj ovu vijest i objasni mi: tko je uhićen, zašto, što to znači za građane? Budi objektivan.',
      expectedOutcome: 'AI daje strukturiranu analizu događaja.',
      learningPoint: 'AI pomaže razumjeti složene vijesti, ali uvijek provjeri više izvora.',
    },
    'tržnice': {
      id: generateId(),
      title: '📊 Analitičar: Što se događa s tržnicama?',
      icon: '📊',
      difficulty: 'intermediate',
      targetAudience: 'all',
      category: 'other',
      scenario: 'Dolac je izgubio 92 prodavača. Investicije nisu realizirane. Zašto?',
      problem: 'Analiziraj razliku između planiranog i ostvarenog.',
      aiPrompt: 'Analiziraj ovu situaciju: planirano 2.7M€, realizirano 5.7%. Koje su mogući razlozi? Što možemo naučiti?',
      expectedOutcome: 'AI nudi moguće objašnjenja i pouke.',
      learningPoint: 'Veliki projekti često imaju kašnjenja - AI pomaže razumjeti zašto.',
    },
  };
  
  // Find matching mock task based on keywords
  for (const [keyword, task] of Object.entries(mockTasks)) {
    if (newsItem.title.toLowerCase().includes(keyword) || 
        newsItem.description.toLowerCase().includes(keyword)) {
      return task as Task;
    }
  }
  
  return null;
}

/**
 * Creates interactive exercise from task
 */
export function createInteractiveExercise(task: Task) {
  return {
    id: `exercise-${task.id}`,
    ...task,
    steps: [
      {
        type: 'scenario' as const,
        content: task.scenario,
      },
      {
        type: 'problem' as const,
        content: task.problem,
        hint: 'Razmisli kako bi formulirao pitanje prijatelju...',
      },
      {
        type: 'ai-prompt' as const,
        content: 'Pokušaj sam! Klikni i upiši svoj prompt:',
        example: task.aiPrompt,
      },
      {
        type: 'result' as const,
        content: task.expectedOutcome,
        learningPoint: task.learningPoint,
      },
    ],
  };
}

// Re-export predefined tasks
export { PREDEFINED_TASKS };
