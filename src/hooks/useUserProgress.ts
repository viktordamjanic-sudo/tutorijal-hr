'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/astro/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api.js';

export function useUserProgress() {
  const { userId, isSignedIn } = useAuth();
  
  const progress = useQuery(
    api.tasks.getUserProgress,
    userId ? { userId } : 'skip'
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const updateProgress = async (data: { 
    lessonId?: number; 
    taskId?: string; 
    timeSpent?: number;
  }) => {
    if (!userId) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update');
      return await response.json();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleFavorite = async (taskId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      
      if (!response.ok) throw new Error('Failed to toggle');
      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return {
    progress,
    isLoading: progress === undefined,
    isUpdating,
    isSignedIn,
    userId,
    updateProgress,
    toggleFavorite,
  };
}
