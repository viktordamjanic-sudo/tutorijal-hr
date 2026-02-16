// Convex queries for fetching data
import { query } from './_generated/server';

// Get all active tasks
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks')
      .withIndex('by_generated_at')
      .order('desc')
      .take(10);
  },
});

// Get tasks by category
export const getTasksByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    return await ctx.db.query('tasks')
      .withIndex('by_category')
      .filter((q) => q.eq(q.field('category'), category))
      .take(10);
  },
});

// Get single task by ID
export const getTask = query({
  args: { id: v.id('tasks') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Get user's agents
export const getUserAgents = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query('agents')
      .withIndex('by_owner')
      .filter((q) => q.eq(q.field('ownerId'), userId))
      .collect();
  },
});

// Get user progress
export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const progress = await ctx.db.query('userProgress')
      .withIndex('by_user')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();
    
    if (!progress) {
      // Return default progress
      return {
        userId,
        completedLessons: [],
        completedTasks: [],
        favoriteTasks: [],
        totalTimeSpent: 0,
        lastActive: Date.now(),
        streak: 0,
      };
    }
    
    return progress;
  },
});

// Get unprocessed news (for AI task generation)
export const getUnprocessedNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 5 }) => {
    return await ctx.db.query('newsItems')
      .withIndex('by_processed')
      .filter((q) => q.eq(q.field('processed'), false))
      .take(limit);
  },
});

// Get recent agent runs
export const getAgentRuns = query({
  args: { agentId: v.id('agents'), limit: v.optional(v.number()) },
  handler: async (ctx, { agentId, limit = 10 }) => {
    return await ctx.db.query('agentRuns')
      .withIndex('by_agent')
      .filter((q) => q.eq(q.field('agentId'), agentId))
      .order('desc')
      .take(limit);
  },
});

import { v } from 'convex/values';
