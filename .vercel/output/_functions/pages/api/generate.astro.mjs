import { renderers } from "../../renderers.mjs";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || void 0;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const POST = async ({ request }) => {
  console.log("API /generate called");
  console.log("API Key exists:", !!OPENROUTER_API_KEY);
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key not found");
    return new Response(
      JSON.stringify({ error: "OpenRouter API key not configured. Check Vercel env vars." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { prompt, context } = body;
    console.log("Received prompt:", prompt?.substring(0, 50));
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const systemMessage = `Ti si AI asistent u edukacijskoj platformi "AI Tutorijal" koja uči ljude kako koristiti AI asistente.

Kontekst zadatka:
${context || "Korisnik želi naučiti kako efikasno koristiti AI asistenta za rješavanje stvarnog problema."}

Upute:
- Budi pristupačan i koristan
- Daj konkretne, primjenjive odgovore
- Koristi formatiranje (emoji, bullet liste) za čitljivost
- Objasni zašto odgovor funkcionira (learning point)`;
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tutorijal-hr.vercel.app",
        "X-Title": "AI Tutorijal"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        max_tokens: 1e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to generate response from AI" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    console.log("OpenRouter response received, length:", aiResponse?.length);
    if (!aiResponse) {
      console.error("No content in OpenRouter response:", data);
      return new Response(
        JSON.stringify({ error: "Empty response from AI", details: data }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        model: data.model || "anthropic/claude-3-haiku"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
