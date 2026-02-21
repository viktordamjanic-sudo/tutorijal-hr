import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

// @ts-ignore
const CONVEX_URL = process.env.PUBLIC_CONVEX_URL || import.meta.env.PUBLIC_CONVEX_URL || 'https://efficient-antelope-653.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);

export const GET: APIRoute = async ({ request, locals }) => {
  // @ts-ignore - Clerk locals might not be fully typed
  const userId = locals.auth?.()?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Query user progress from Convex
    const progress = await convex.query(api.mutations.getUserProgress, { userId });

    return new Response(JSON.stringify({ success: true, progress }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch progress' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  // @ts-ignore
  const userId = locals.auth?.()?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();

    await convex.mutation(api.mutations.updateProgress, {
      userId,
      lessonId: data.lessonId,
      taskId: data.taskId,
      timeSpent: data.timeSpent || undefined,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error saving progress:', error);
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
};