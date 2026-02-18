import type { APIRoute } from 'astro';

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Simple in-memory cache (resets on redeploy, but saves API calls)
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(prompt: string, context: string): string {
  // Simple hash for caching
  const str = prompt + '|' + context;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export const POST: APIRoute = async ({ request }) => {
  if (!OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenRouter API key not configured' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { prompt, context } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = getCacheKey(prompt, context || '');
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('Cache hit for prompt');
      return new Response(
        JSON.stringify({ 
          success: true, 
          response: cached.response,
          model: 'anthropic/claude-3-haiku',
          cached: true
        }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build system message with context
    const systemMessage = `Ti si AI asistent u edukacijskoj platformi "AI Tutorijal" koja uči ljude kako koristiti AI asistente.
    
Kontekst zadatka:
${context || 'Korisnik želi naučiti kako efikasno koristiti AI asistenta za rješavanje stvarnog problema.'}

Upute:
- Budi pristupačan i koristan
- Daj konkretne, primjenjive odgovore
- Koristi formatiranje (emoji, bullet liste) za čitljivost
- Objasni zašto odgovor funkcionira (learning point)`;

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

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: 'Empty response from AI' }), 
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Store in cache
    cache.set(cacheKey, { response: aiResponse, timestamp: Date.now() });

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        model: data.model || 'anthropic/claude-3-haiku',
        cached: false
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