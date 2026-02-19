/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, l as renderScript } from "../../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { $ as $$Layout } from "../../chunks/Layout_CrSXUi8e.mjs";
import { P as PREDEFINED_TASKS } from "../../chunks/constants_B8BQnQKK.mjs";
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const task = PREDEFINED_TASKS.find((t) => t.id === id);
  if (!task) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${task.title} | tutorijal.hr` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4"> <div class="max-w-3xl mx-auto"> <!-- Breadcrumb --> <nav class="mb-6"> <a href="/" class="text-blue-600 hover:underline">← Natrag na početnu</a> </nav> <!-- Header --> <div class="bg-white rounded-2xl p-8 shadow-sm mb-6"> <div class="flex items-center gap-4 mb-4"> <span class="text-6xl">${task.icon}</span> <div> <span${addAttribute(`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${task.difficulty === "beginner" ? "bg-green-100 text-green-700" : task.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`, "class")}> ${task.difficulty === "beginner" ? "⭐ Lagano" : task.difficulty === "intermediate" ? "⭐⭐ Srednje" : "⭐⭐⭐ Teško"} </span> <span${addAttribute(`inline-block px-3 py-1 rounded-full text-sm font-medium ml-2 ${task.targetAudience === "kids" ? "bg-green-100 text-green-700" : task.targetAudience === "seniors" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`, "class")}> ${task.targetAudience === "kids" ? "👶 Za djecu" : task.targetAudience === "seniors" ? "👴 Za starije" : "👥 Za sve"} </span> </div> </div> <h1 class="text-3xl font-bold text-gray-800 mb-4">${task.title}</h1> <p class="text-lg text-gray-600">${task.scenario}</p> </div> <!-- Problem --> <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-6 mb-6"> <h2 class="font-bold text-lg mb-2">🎯 Problem</h2> <p class="text-gray-700">${task.problem}</p> </div> <!-- Interactive AI Section --> <div class="bg-white rounded-2xl p-8 shadow-sm mb-6"> <h2 class="font-bold text-xl mb-4">🤖 Isprobaj s AI-jem</h2> <div class="bg-gray-50 rounded-xl p-4 mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">
Primjer prompta (možeš ga promijeniti!):
</label> <textarea id="ai-prompt" class="w-full p-4 border rounded-lg font-mono text-sm"${addAttribute(4, "rows")}>${task.aiPrompt}</textarea> </div> <button id="send-to-ai" class="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"${addAttribute(task.title, "data-task-title")}${addAttribute(task.scenario, "data-task-scenario")}${addAttribute(task.problem, "data-task-problem")}>
🚀 Pošalji AI-ju i vidi rješenje
</button> <!-- AI Response Area (hidden by default) --> <div id="ai-response" class="hidden mt-6 bg-green-50 rounded-xl p-4 border border-green-200"> <h3 class="font-semibold text-green-800 mb-2">✨ AI predlaže:</h3> <div id="response-content" class="text-gray-700 whitespace-pre-wrap"></div> </div> </div> <!-- Learning Point --> <div class="bg-blue-50 rounded-2xl p-6 mb-6"> <h2 class="font-bold text-lg mb-2">💡 Što smo naučili?</h2> <p class="text-gray-700">${task.learningPoint}</p> </div> <!-- Navigation --> <div class="flex justify-between"> <a href="/" class="text-gray-600 hover:text-blue-600 transition">
← Svi moduli
</a> <button class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition" onclick="alert('💾 Spremljeno u favorites! (Demo)')">
💾 Spremi
</button> </div> </div> </main> ${renderScript($$result2, "/Users/gaba/Code/tutorijal/src/pages/modul/[id].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/modul/[id].astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/modul/[id].astro";
const $$url = "/modul/[id]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
