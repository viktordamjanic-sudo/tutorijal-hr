import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);

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
    const { taskId } = body;

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'taskId is required' }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation('toggleFavorite', {
      userId,
      taskId,
    });

    return new Response(
      JSON.stringify({ success: true, isFavorite: result }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to toggle favorite' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
