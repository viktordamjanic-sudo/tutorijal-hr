import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { PREDEFINED_TASKS } from '../../lib/constants';

// Use process.env for Vercel serverless environment
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CONVEX_URL = process.env.PUBLIC_CONVEX_URL || import.meta.env.PUBLIC_CONVEX_URL || 'https://efficient-antelope-653.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);

// Basic in-memory rate limiterrr
// Note: In a serverless environment like Vercel, this state is lost on cold starts
// and isn't shared across multiple lambdas. However, it's highly effective at
// preventing simple "spam clicking" bursts from a single user within an active instance at 0 cost.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  let userRecord = rateLimitMap.get(userId);

  if (!userRecord || now - userRecord.windowStart > RATE_LIMIT_WINDOW_MS) {
    // Start a new window
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  // Increment within current window
  userRecord.count++;
  rateLimitMap.set(userId, userRecord);
  return true;
}

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  console.log('API /generate called');

  // 1. Authentication Check via Astro Locals
  // @ts-ignore - Clerk locals might not be fully typed in the user's env.d.ts
  const userId = locals.auth?.()?.userId;
  if (!userId) {
    console.warn('Unauthorized attempt to access /api/generate');
    return new Response(
      JSON.stringify({ error: 'Morate biti prijavljeni za korištenje AI asistenta.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Rate Limiting Check
  if (!checkRateLimit(userId)) {
    console.warn(`Rate limit exceeded for user ${userId}`);
    return new Response(
      JSON.stringify({ error: 'Zbog zaštite, dozvoljeno je 5 poruka po minuti. Molimo pričekajte malo.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Setup Check
  console.log('API Key exists:', !!OPENROUTER_API_KEY);
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenRouter API key not configured. Check Vercel env vars.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, context: taskContext, taskId } = body;
    console.log(`Received prompt from ${userId}:`, prompt?.substring(0, 50));

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --- ZERO-COST CACHING LOGIC ---
    // Check if the exact prompt matches any of our predefined "Idea" prompts.
    // If it does, we return the cached expectedOutcome without ever calling OpenRouter.
    const cachedTask = PREDEFINED_TASKS.find(t => t.aiPrompt.trim() === prompt.trim());
    if (cachedTask && cachedTask.expectedOutcome) {
      console.log(`[CACHE HIT] Intercepted predefined prompt for task: ${cachedTask.id}`);

      // Still save progress since they successfully "completed" it
      if (taskId || cachedTask.id) {
        try {
          await convex.mutation(api.mutations.updateProgress, {
            userId,
            taskId: taskId || cachedTask.id,
            timeSpent: 2 // Faster completion time since it's cached
          });
        } catch (err) {
          console.error('Failed to save progress to Convex:', err);
        }
      }

      // Add a slight artificial delay to make it feel like the AI is "typing"
      await new Promise(resolve => setTimeout(resolve, 600));

      return new Response(
        JSON.stringify({
          success: true,
          response: cachedTask.expectedOutcome,
          model: 'cached-response (0 ms)'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ---------------------------------

    // Build system message with prompt-coaching behavior
    const systemMessage = `Ti si AI PROMPT TRENER u edukacijskoj platformi "AI Tutorijal" za učenike od 14 godina.

Tvoja GLAVNA zadaća je NAUČITI učenika pisati dobre prompte — NE samo odgovarati na pitanja.

## Kontekst zadatka:
${taskContext || 'Korisnik želi naučiti kako efikasno koristiti AI asistenta za rješavanje stvarnog problema.'}

## Kako reagiraš na učenikov prompt:

### 1. Prvo OCIJENI kvalitetu prompta (uvijek prikaži ocjenu):

⭐ SLAB prompt (nejasan, prekratak, bez konteksta):
→ NE daj odgovor na zadatak
→ Objasni ZAŠTO je prompt slab (prijateljski, ne kritično)  
→ Daj 1-2 konkretna savjeta kako ga poboljšati
→ Pokaži primjer boljeg prompta za ovaj zadatak
→ Završi s: "Pokušaj ponovo! 💪"

⭐⭐ OSREDNJI prompt (ima ideju ali nedostaje detalj):
→ Daj DJELOMIČAN odgovor (50%)
→ Objasni što je dobro u promptu
→ Objasni što nedostaje za bolji odgovor
→ Završi s: "Dopuni prompt pa ćeš dobiti još bolji odgovor! ✨"

⭐⭐⭐ DOBAR prompt (jasan, s kontekstom, specificira ton/format):
→ Daj PUNI, kvalitetni odgovor
→ Pohvali što je prompt odlično napisan
→ Objasni ZAŠTO je ovaj prompt funkcionirao (koji elementi su pomogli)
→ Završi s: "Odličan prompt! 🌟"

### 2. Format odgovora:
- Uvijek započni s ocjenom: "📊 Ocjena prompta: ⭐/⭐⭐/⭐⭐⭐"
- Koristi emoji i formatiranje za čitljivost
- Piši na hrvatskom, prilagođeno 14-godišnjacima
- Budi prijateljski i ohrabrujući, nikad sarkastičan
- Ako učenik napiše nešto potpuno nevezano za zadatak (npr. "bok", "test", "asdf"), ljubazno ga usmjeri na zadatak i objasni što se od njega očekuje`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tutorijal-hr.vercel.app',
        'X-Title': 'AI Tutorijal'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from AI' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log('OpenRouter response received, length:', aiResponse?.length);

    if (!aiResponse) {
      console.error('No content in OpenRouter response:', data);
      return new Response(
        JSON.stringify({ error: 'Empty response from AI', details: data }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save progress to Convex if a taskId was provided
    if (taskId) {
      try {
        await convex.mutation(api.mutations.updateProgress, {
          userId,
          taskId: taskId,
          timeSpent: 5 // Default estimated time spent per task
        });
        console.log(`Progress saved for user ${userId} on task ${taskId}`);
      } catch (err) {
        console.error('Failed to save progress to Convex:', err);
        // We don't fail the whole request if just analytics/progress fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        model: data.model || 'anthropic/claude-3-haiku'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};