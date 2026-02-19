import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';
import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL = process.env.PUBLIC_CONVEX_URL || import.meta.env.PUBLIC_CONVEX_URL || 'https://efficient-antelope-653.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);

export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { lessonId, taskId, timeSpent } = body;

    // Call Convex mutation
    const result = await convex.mutation('updateProgress', {
      userId,
      lessonId,
      taskId,
      timeSpent: timeSpent || 0,
    });

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update progress' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
