import { ConvexHttpClient } from "convex/browser";
import { renderers } from "../../renderers.mjs";
const CONVEX_URL = process.env.PUBLIC_CONVEX_URL || "" || "https://efficient-antelope-653.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);
const POST = async ({ request, locals }) => {
  const { userId } = locals.auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { lessonId, taskId, timeSpent } = body;
    const result = await convex.mutation("updateProgress", {
      userId,
      lessonId,
      taskId,
      timeSpent: timeSpent || 0
    });
    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update progress" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
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
