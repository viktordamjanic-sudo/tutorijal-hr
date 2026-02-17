import type { APIRoute } from 'astro';
import { getAuth } from '@clerk/astro/server';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = getAuth(locals);
  
  if (!auth?.userId) {
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
      userId: auth.userId,
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
