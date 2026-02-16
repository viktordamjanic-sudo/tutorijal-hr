// Convex schema for tutorijal.hr
// Run: npx convex dev

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Tasks generated from news
  tasks: defineTable({
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
    generatedAt: v.number(), // timestamp
    isActive: v.boolean(),
  })
    .index('by_category', ['category'])
    .index('by_difficulty', ['difficulty'])
    .index('by_generated_at', ['generatedAt']),

  // User agents
  agents: defineTable({
    name: v.string(),
    ownerId: v.string(), // user identifier
    schedule: v.string(), // cron expression
    skills: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    lastRunAt: v.optional(v.number()),
    config: v.object({
      city: v.optional(v.string()),
      sources: v.optional(v.array(v.string())),
      notifyPlatform: v.string(),
      notifyTarget: v.string(),
    }),
  })
    .index('by_owner', ['ownerId'])
    .index('by_active', ['isActive']),

  // User progress tracking
  userProgress: defineTable({
    userId: v.string(),
    completedLessons: v.array(v.number()),
    completedTasks: v.array(v.id('tasks')),
    favoriteTasks: v.array(v.id('tasks')),
    totalTimeSpent: v.number(), // minutes
    lastActive: v.number(),
    streak: v.number(), // consecutive days
  })
    .index('by_user', ['userId']),

  // Agent runs/logs
  agentRuns: defineTable({
    agentId: v.id('agents'),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(v.literal('running'), v.literal('completed'), v.literal('failed')),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  })
    .index('by_agent', ['agentId'])
    .index('by_status', ['status']),

  // News items from scraper
  newsItems: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    source: v.string(),
    publishedAt: v.number(),
    url: v.string(),
    processed: v.boolean(), // whether AI has generated task from this
    taskId: v.optional(v.id('tasks')),
  })
    .index('by_processed', ['processed'])
    .index('by_published_at', ['publishedAt'])
    .index('by_category', ['category']),
});
