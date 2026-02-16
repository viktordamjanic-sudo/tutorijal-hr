// Utility functions
import type { Task, NewsItem } from '../types';

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a date to Croatian locale
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Truncates text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Maps difficulty level to Croatian
 */
export function getDifficultyLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: 'Lagano',
    intermediate: 'Srednje',
    advanced: 'Teško',
  };
  return labels[level] || level;
}

/**
 * Maps target audience to Croatian
 */
export function getAudienceLabel(audience: string): string {
  const labels: Record<string, string> = {
    kids: 'Za djecu',
    seniors: 'Za starije',
    all: 'Za sve',
  };
  return labels[audience] || audience;
}

/**
 * Validates if task has all required fields
 */
export function validateTask(task: Partial<Task>): task is Task {
  const required = ['id', 'title', 'scenario', 'aiPrompt', 'difficulty', 'targetAudience'];
  return required.every(field => task[field as keyof Task] !== undefined);
}

/**
 * Mock function to fetch news from scraper database
 * In production, this would query the SQLite database
 */
export async function fetchNewsFromScraper(): Promise<NewsItem[]> {
  // This would be: sqlite3 headlines.db query
  // For now, return mock data
  return [
    {
      title: 'Grad Zagreb kupio 45 bicikala za zaposlenike',
      description: 'Službeni bicikli za kretanje između ureda. Iznos 24.187€.',
      category: 'Zagreb',
      publishedAt: new Date().toISOString(),
      url: '#',
    },
    {
      title: 'Velika akcija USKOK-a: Uhićen gradonačelnik',
      description: 'Policija i USKOK proveli uhićenja u Novoj Gradiškoj.',
      category: 'Hrvatska',
      publishedAt: new Date().toISOString(),
      url: '#',
    },
    {
      title: 'Tržnice u Zagrebu izgubile 92 prodavača',
      description: 'Dolac nakon rekonstrukcije prazan. Planirane investicije nisu realizirane.',
      category: 'Zagreb',
      publishedAt: new Date().toISOString(),
      url: '#',
    },
  ];
}
