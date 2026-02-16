'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Task } from '../types';

/**
 * Hook to fetch latest tasks from Convex
 */
export function useTasks() {
  const tasks = useQuery(api.tasks.getTasks);
  return { tasks: tasks as Task[] | undefined, isLoading: tasks === undefined };
}

/**
 * Hook to fetch tasks by category
 */
export function useTasksByCategory(category: string) {
  const tasks = useQuery(api.tasks.getTasksByCategory, { category });
  return { tasks: tasks as Task[] | undefined, isLoading: tasks === undefined };
}

/**
 * Hook to fetch single task by ID
 */
export function useTask(id: string) {
  const task = useQuery(api.tasks.getTask, { id: id as any });
  return { task: task as Task | undefined | null, isLoading: task === undefined };
}

/**
 * Hook to fetch user's agents
 */
export function useUserAgents(userId: string) {
  const agents = useQuery(api.tasks.getUserAgents, { userId });
  return { agents, isLoading: agents === undefined };
}

/**
 * Hook to fetch user progress
 */
export function useUserProgress(userId: string) {
  const progress = useQuery(api.tasks.getUserProgress, { userId });
  return { progress, isLoading: progress === undefined };
}