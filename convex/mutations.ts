// Convex mutations for modifying data
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a new task (from AI generation)
export const createTask = mutation({
  args: {
    title: v.string(),
    icon: v.string(),
    scenario: v.string(),
    problem: v.string(),
    aiPrompt: v.string(),
    expectedOutcome: v.string(),
    learningPoint: v.string(),
    difficulty: v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    targetAudience: v.union(v.literal('kids'), v.literal('seniors'), v.literal('all')),
    category: v.string(),
    sourceNews: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tasks', {
      ...args,
      generatedAt: Date.now(),
      isActive: true,
    });
  },
});

// Create a new agent
export const createAgent = mutation({
  args: {
    name: v.string(),
    ownerId: v.string(),
    schedule: v.string(),
    skills: v.array(v.string()),
    config: v.object({
      city: v.optional(v.string()),
      sources: v.optional(v.array(v.string())),
      notifyPlatform: v.string(),
      notifyTarget: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('agents', {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Toggle agent active status
export const toggleAgent = mutation({
  args: { id: v.id('agents') },
  handler: async (ctx, { id }) => {
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error('Agent not found');
    
    await ctx.db.patch(id, { isActive: !agent.isActive });
    return !agent.isActive;
  },
});

// Delete agent
export const deleteAgent = mutation({
  args: { id: v.id('agents') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Update user progress
export const updateProgress = mutation({
  args: {
    userId: v.string(),
    lessonId: v.optional(v.number()),
    taskId: v.optional(v.id('tasks')),
    timeSpent: v.optional(v.number()), // minutes
  },
  handler: async (ctx, { userId, lessonId, taskId, timeSpent = 0 }) => {
    const existing = await ctx.db.query('userProgress')
      .withIndex('by_user')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();
    
    if (existing) {
      // Update existing
      const updates: any = {
        lastActive: Date.now(),
        totalTimeSpent: existing.totalTimeSpent + timeSpent,
      };
      
      if (lessonId && !existing.completedLessons.includes(lessonId)) {
        updates.completedLessons = [...existing.completedLessons, lessonId];
      }
      
      if (taskId && !existing.completedTasks.includes(taskId)) {
        updates.completedTasks = [...existing.completedTasks, taskId];
      }
      
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      // Create new
      return await ctx.db.insert('userProgress', {
        userId,
        completedLessons: lessonId ? [lessonId] : [],
        completedTasks: taskId ? [taskId] : [],
        favoriteTasks: [],
        totalTimeSpent: timeSpent,
        lastActive: Date.now(),
        streak: 1,
      });
    }
  },
});

// Add news item (from scraper)
export const addNewsItem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    source: v.string(),
    publishedAt: v.number(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('newsItems', {
      ...args,
      processed: false,
    });
  },
});

// Mark news as processed (after AI generates task)
export const markNewsProcessed = mutation({
  args: {
    newsId: v.id('newsItems'),
    taskId: v.id('tasks'),
  },
  handler: async (ctx, { newsId, taskId }) => {
    await ctx.db.patch(newsId, {
      processed: true,
      taskId,
    });
  },
});

// Log agent run
export const logAgentRun = mutation({
  args: {
    agentId: v.id('agents'),
    status: v.union(v.literal('running'), v.literal('completed'), v.literal('failed')),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { agentId, status, output, error }) => {
    const runId = await ctx.db.insert('agentRuns', {
      agentId,
      startedAt: Date.now(),
      status,
      output,
      error,
    });
    
    // Update agent last run
    await ctx.db.patch(agentId, {
      lastRunAt: Date.now(),
    });
    
    return runId;
  },
});

// Toggle favorite task
export const toggleFavorite = mutation({
  args: {
    userId: v.string(),
    taskId: v.id('tasks'),
  },
  handler: async (ctx, { userId, taskId }) => {
    const progress = await ctx.db.query('userProgress')
      .withIndex('by_user')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();
    
    if (!progress) {
      // Create new progress with this favorite
      return await ctx.db.insert('userProgress', {
        userId,
        completedLessons: [],
        completedTasks: [],
        favoriteTasks: [taskId],
        totalTimeSpent: 0,
        lastActive: Date.now(),
        streak: 0,
      });
    }
    
    const isFavorite = progress.favoriteTasks.includes(taskId);
    const favoriteTasks = isFavorite
      ? progress.favoriteTasks.filter((id) => id !== taskId)
      : [...progress.favoriteTasks, taskId];
    
    await ctx.db.patch(progress._id, { favoriteTasks });
    return !isFavorite;
  },
});

// Query for fetching user progress
export const getUserProgress = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const progress = await ctx.db.query('userProgress')
      .withIndex('by_user')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();
    
    return progress || {
      userId,
      completedLessons: [],
      completedTasks: [],
      favoriteTasks: [],
      totalTimeSpent: 0,
      lastActive: null,
      streak: 0,
    };
  },
});
