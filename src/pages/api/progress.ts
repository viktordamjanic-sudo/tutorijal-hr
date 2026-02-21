import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const CONVEX_URL = process.env.PUBLIC_CONVEX_URL || import.meta.env.PUBLIC_CONVEX_URL || 'https://efficient-antelope-653.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);

export const GET: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth();

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