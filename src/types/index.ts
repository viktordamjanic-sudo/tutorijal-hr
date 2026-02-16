// Centralized TypeScript types for tutorijal.hr

export interface Task {
  id: string;
  title: string;
  icon: string;
  scenario: string;
  problem: string;
  aiPrompt: string;
  expectedOutcome: string;
  learningPoint: string;
  difficulty: DifficultyLevel;
  targetAudience: TargetAudience;
  category: TaskCategory;
  generatedAt?: string;
  sourceNews?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type TargetAudience = 'kids' | 'seniors' | 'all';
export type TaskCategory = 'parking' | 'cooking' | 'language' | 'finance' | 'diplomacy' | 'other';

export interface Agent {
  id: string;
  name: string;
  schedule: string; // cron format
  skills: SkillType[];
  tasks: AgentTask[];
  notify: NotificationConfig;
  isActive: boolean;
}

export type SkillType = 'scraper' | 'messaging' | 'weather' | 'calendar' | 'traffic' | 'quote';

export interface AgentTask {
  name: string;
  skill: SkillType;
  config?: Record<string, unknown>;
}

export interface NotificationConfig {
  platform: 'telegram' | 'whatsapp' | 'email';
  chatId?: string;
  message?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

export interface NewsItem {
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  url: string;
}

export interface UserProgress {
  userId: string;
  completedLessons: number[];
  favoriteTasks: string[];
  totalTimeSpent: number; // minutes
  lastActive: string;
}
