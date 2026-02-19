/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, r as renderTemplate, g as addAttribute, k as renderComponent } from "../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { $ as $$Layout } from "../chunks/Layout_CrSXUi8e.mjs";
import "clsx";
import { P as PREDEFINED_TASKS } from "../chunks/constants_B8BQnQKK.mjs";
import { renderers } from "../renderers.mjs";
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative py-20 px-4 overflow-hidden"> <!-- Background decoration --> <div class="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 opacity-50"></div> <div class="absolute top-20 right-10 text-6xl opacity-20 animate-bounce">🤖</div> <div class="absolute bottom-20 left-10 text-5xl opacity-20 animate-pulse">✨</div> <div class="relative max-w-4xl mx-auto text-center"> <div class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6"> <span class="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span> <span class="text-sm text-gray-600">Živo generirani zadaci iz današnjih vijesti</span> </div> <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
Nauči AI riješiti
<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
stvarne probleme
</span> </h1> <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
Od parkinga do padeža — otkrij kako AI može pomoći u svakodnevnom životu.
<span class="font-medium text-blue-600">Zabavno, praktično, za sve uzraste.</span> </p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="#moduli" class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
🚀 Započni učenje
</a> <a href="#kako-radi" class="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition">
🎮 Kako funkcionira?
</a> </div> <!-- Stats --> <div class="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"> ${[
    { number: "5+", label: "Interaktivnih modula" },
    { number: "∞", label: "Svježih zadataka" },
    { number: "0€", label: "Besplatno za uvijek" }
  ].map((stat) => renderTemplate`<div class="text-center"> <div class="text-3xl font-bold text-blue-600">${stat.number}</div> <div class="text-sm text-gray-500">${stat.label}</div> </div>`)} </div> </div> </section>`;
}, "/Users/gaba/Code/tutorijal/src/components/Hero.astro", void 0);
const $$ModuleGrid = createComponent(($$result, $$props, $$slots) => {
  const tasksWithPaths = PREDEFINED_TASKS.map((task) => ({
    ...task,
    path: `/modul/${task.id}`
  }));
  const audienceStyles = {
    kids: { bg: "bg-green-100", text: "text-green-700", label: "👶 Za djecu" },
    seniors: { bg: "bg-orange-100", text: "text-orange-700", label: "👴 Za starije" },
    all: { bg: "bg-blue-100", text: "text-blue-700", label: "👥 Za sve" }
  };
  return renderTemplate`${maybeRenderHead()}<div id="moduli" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${tasksWithPaths.map((task) => {
    const style = audienceStyles[task.targetAudience] || audienceStyles.all;
    return renderTemplate`<a${addAttribute(task.path, "href")} class="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-lg"> <div class="flex items-start justify-between mb-4"> <span class="text-5xl group-hover:scale-110 transition-transform"> ${task.icon} </span> <span${addAttribute(`text-xs px-3 py-1 rounded-full font-medium ${style.bg} ${style.text}`, "class")}> ${style.label} </span> </div> <h3 class="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition"> ${task.title} </h3> <p class="text-gray-600 text-sm mb-4 line-clamp-2"> ${task.scenario} </p> <div class="flex items-center justify-between"> <span class="text-xs text-gray-400">
💡 ${task.learningPoint?.substring(0, 40)}...
</span> <span class="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
Kreni →
</span> </div> </a>`;
  })} </div> <!-- Coming Soon Teaser --> <div class="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center"> <span class="text-4xl mb-4 block">🚀</span> <h3 class="font-bold text-xl mb-2">Novi moduli uskoro!</h3> <p class="text-gray-600 mb-4">
AI svakodnevno analizira vijesti i stvara nove zadatke.
<br>
Slijede: <strong>AI za učenje stranih jezika</strong>,
<strong>AI za financije</strong>,
<strong>AI za putovanja</strong>...
</p> <div class="flex flex-wrap gap-2 justify-center"> ${["🇬🇧 Jezici", "💰 Financije", "✈️ Putovanja", "🏥 Zdravlje", "🎨 Kreativnost"].map((tag) => renderTemplate`<span class="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow-sm"> ${tag} </span>`)} </div> </div>`;
}, "/Users/gaba/Code/tutorijal/src/components/ModuleGrid.astro", void 0);
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI Tutorijal - Nauči AI riješiti stvarne probleme" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white"> ${renderComponent($$result2, "Hero", $$Hero, {})} <!-- Live AI-Generated Tasks from News --> <section class="py-12 px-4"> <div class="max-w-6xl mx-auto"> <div class="flex items-center gap-3 mb-6"> <span class="animate-pulse w-3 h-3 bg-green-500 rounded-full"></span> <h2 class="text-2xl font-bold text-gray-800">🔄 Svježi zadaci iz baze (Convex)</h2> </div> <p class="text-gray-600 mb-6">
Zadaci se učitavaju u real-time iz Convex baze podataka.
<span class="text-blue-600 font-medium">Sinhronizacija između svih uređaja!</span> </p> ${renderComponent($$result2, "ConvexWrapper", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/gaba/Code/tutorijal/src/components/ConvexWrapper.tsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "LiveFeedConvex", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/gaba/Code/tutorijal/src/components/LiveFeedConvex.tsx", "client:component-export": "default" })} ` })} </div> </section> <!-- Core Learning Modules --> <section class="py-12 px-4 bg-white"> <div class="max-w-6xl mx-auto"> <h2 class="text-3xl font-bold text-center mb-4">📚 Izaberi svoju avanturu</h2> <p class="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
Svaki modul rješava jedan stvaran problem. Od parkinga do padeža — 
          nauči kako AI može pomoći u svakodnevnom životu.
</p> ${renderComponent($$result2, "ModuleGrid", $$ModuleGrid, {})} </div> </section> <!-- NEW: Course Section --> <section class="py-12 px-4 bg-gradient-to-b from-purple-50 to-white"> <div class="max-w-6xl mx-auto"> <h2 class="text-3xl font-bold text-center mb-4">🎓 Drugi dio: Automatiziraj život</h2> <p class="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
Nauči kako stvoriti vlastite AI agente koji će ti štediti vrijeme. 
          Od prvog agenta do kompletne automatizacije.
</p> <div class="grid md:grid-cols-5 gap-4"> ${[
    { num: 1, title: "Osnovni setup", icon: "🚀", color: "blue" },
    { num: 2, title: "Dva agenta", icon: "👥", color: "green" },
    { num: 3, title: "Lošija od tri", icon: "⚖️", color: "orange" },
    { num: 4, title: "Što su skillsi?", icon: "🧰", color: "purple" },
    { num: 5, title: "Prva automatizacija", icon: "🎉", color: "green" }
  ].map((lesson) => renderTemplate`<a${addAttribute(`/lekcija/${lesson.num}`, "href")}${addAttribute(`bg-white p-4 rounded-xl border-2 hover:border-${lesson.color}-400 transition group`, "class")}> <div class="text-2xl mb-2">${lesson.icon}</div> <div class="text-xs text-gray-500 mb-1">Lekcija ${lesson.num}</div> <div class="font-bold text-sm group-hover:text-blue-600 transition"> ${lesson.title} </div> </a>`)} </div> <div class="text-center mt-8"> <a href="/lekcija/1" class="inline-block bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition">
🚀 Započni kurs
</a> </div> </div> </section> <!-- How It Works --> <section class="py-16 px-4 bg-gradient-to-r from-purple-50 to-blue-50"> <div class="max-w-4xl mx-auto text-center"> <h2 class="text-3xl font-bold mb-8">🎮 Kako funkcionira?</h2> <div class="grid md:grid-cols-4 gap-6"> ${[
    { emoji: "🎯", title: "Zabavno", desc: "Pogledaj simpatičan video s problemom" },
    { emoji: "🧠", title: "Shvati", desc: "Vidi kako AI razmišlja o rješenju" },
    { emoji: "🚀", title: "Isprobaj", desc: "Pitaj AI svoju situaciju" },
    { emoji: "💾", title: "Podijeli", desc: "Spasi rješenje za kasnije" }
  ].map((step) => renderTemplate`<div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"> <div class="text-4xl mb-3">${step.emoji}</div> <h3 class="font-bold text-lg mb-2">${step.title}</h3> <p class="text-sm text-gray-600">${step.desc}</p> </div>`)} </div> </div> </section> <!-- For Everyone --> <section class="py-12 px-4"> <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8"> <div class="bg-orange-50 p-8 rounded-2xl"> <h3 class="text-2xl font-bold mb-4">👴 Za starije</h3> <ul class="space-y-2 text-gray-700"> <li>✅ Veliki fontovi i jasni gumbi</li> <li>✅ Glasovna pomoć za čitanje</li> <li>✅ Bez tehničkog žargona</li> <li>✅ Rješavanje stvarnih problema (parking, dom...)</li> </ul> </div> <div class="bg-green-50 p-8 rounded-2xl"> <h3 class="text-2xl font-bold mb-4">👶 Za djecu</h3> <ul class="space-y-2 text-gray-700"> <li>🎨 Igre i ilustracije</li> <li>🏆 Bodovi i bedževi</li> <li>🎮 Kratki zadaci (2-3 minute)</li> <li>📖 Učenje kroz avanture (padeži, pisma...)</li> </ul> </div> </div> </section> </main> ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/index.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
