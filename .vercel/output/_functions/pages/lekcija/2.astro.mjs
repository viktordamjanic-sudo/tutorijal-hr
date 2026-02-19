/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { $ as $$Layout } from "../../chunks/Layout_CrSXUi8e.mjs";
import { renderers } from "../../renderers.mjs";
const $$2 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lekcija 2: Dva agenta su bolja od jednog | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4"> <div class="max-w-3xl mx-auto"> <!-- Breadcrumb --> <nav class="mb-6"> <a href="/lekcija/1" class="text-blue-600 hover:underline">← Lekcija 1</a> </nav> <div class="bg-white rounded-2xl p-8 shadow-sm mb-6"> <div class="flex items-center gap-3 mb-4"> <span class="text-4xl">👥</span> <div class="text-sm text-green-600 font-medium">Lekcija 2 od 5</div> </div> <h1 class="text-3xl font-bold text-gray-800 mb-4">Dva agenta su bolja od jednog</h1> <p class="text-lg text-gray-600">
Kako podijeliti zadatke između više agenata da svaki bude stručnjak 
          za svoje područje.
</p> </div> <!-- Content --> <div class="space-y-6"> <!-- Analogy --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">🏢 Analognija: Tvrtka s odjelima</h2> <p class="text-gray-700 mb-4">
Zamisli veliku tvrtku. Ima li jedan čovjek raditi sve?
<strong>Ne!</strong> Ima odjele:
</p> <div class="grid md:grid-cols-3 gap-4 mb-4"> <div class="bg-blue-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">📰</div> <div class="font-bold">Marketing</div> <div class="text-sm text-gray-600">Vijesti i objave</div> </div> <div class="bg-green-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">📊</div> <div class="font-bold">Financije</div> <div class="text-sm text-gray-600">Praćenje troškova</div> </div> <div class="bg-purple-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">🔧</div> <div class="font-bold">Tehnički</div> <div class="text-sm text-gray-600">Održavanje</div> </div> </div> <div class="bg-yellow-50 rounded-lg p-4"> <p class="text-yellow-800"> <strong>Isto vrijedi za agente:</strong> Svaki neka radi ono što najbolje zna.
</p> </div> </div> <!-- Example: News + Weather Agents --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">🌤️ Primjer: Vremenski + Vijesti agent</h2> <p class="text-gray-700 mb-4">
Umjesto jednog agenta koji radi sve (i loše), napravimo dva specijalizirana:
</p> <!-- Interactive Comparison --> <div class="grid md:grid-cols-2 gap-4 mb-6"> <!-- Bad Example --> <div class="border-2 border-red-200 rounded-xl p-4 bg-red-50"> <h3 class="font-bold text-red-800 mb-2">❌ Jedan agent (slabo)</h3> <div class="bg-white rounded p-3 text-sm font-mono text-gray-600">
Agent: "Što ima novo?"<br>
Rezultat: 🌤️ Vrijeme je lijepo.
                📰 Neke vijesti. 
                🗓️ Imaš sastanak.
                🚗 Promet je gužva.
                ⏰ Rođendan mame je...
                (previše informacija, 
                ništa detaljno)
</div> </div> <!-- Good Example --> <div class="border-2 border-green-200 rounded-xl p-4 bg-green-50"> <h3 class="font-bold text-green-800 mb-2">✅ Dva agenta (odlično)</h3> <div class="space-y-2"> <div class="bg-white rounded p-2 text-sm font-mono text-blue-600"> <strong>Vremenski agent:</strong><br>
🌤️ Danas: 22°C, sunčano<br>
☔ Preporuka: Bez kišobrana
</div> <div class="bg-white rounded p-2 text-sm font-mono text-purple-600"> <strong>Vijesti agent:</strong><br>
📰 3 važne vijesti:<br>
1. Novi park otvoren<br>
2. Zatvorena ulica... 
                  (detaljnije)
</div> </div> </div> </div> <!-- Interactive Setup --> <div class="border-2 border-green-200 rounded-xl p-4 bg-green-50"> <h3 class="font-bold text-green-800 mb-3">🎮 Isprobaj: Postavi dva agenta</h3> <div id="two-agents-demo" class="space-y-4"> <div class="grid md:grid-cols-2 gap-4"> <!-- Agent 1 --> <div class="bg-white rounded-lg p-4 border-2 border-blue-200"> <div class="flex items-center gap-2 mb-3"> <span class="text-2xl">🌤️</span> <input type="text" value="Vremenski agent" class="font-bold text-gray-800 bg-transparent border-b border-dashed w-full" id="agent1-name"> </div> <select id="agent1-task" class="w-full p-2 border rounded-lg text-sm"> <option value="weather">🌤️ Provjeri vrijeme</option> <option value="news">📰 Čitaj vijesti</option> <option value="calendar">📅 Provjeri kalendar</option> <option value="traffic">🚗 Prati promet</option> </select> <div class="mt-3 text-xs text-gray-500">
⏰ Svaki dan u:
<input type="time" value="07:00" class="border rounded px-2 py-1" id="agent1-time"> </div> </div> <!-- Agent 2 --> <div class="bg-white rounded-lg p-4 border-2 border-purple-200"> <div class="flex items-center gap-2 mb-3"> <span class="text-2xl">📰</span> <input type="text" value="Vijesti agent" class="font-bold text-gray-800 bg-transparent border-b border-dashed w-full" id="agent2-name"> </div> <select id="agent2-task" class="w-full p-2 border rounded-lg text-sm"> <option value="news" selected>📰 Čitaj vijesti</option> <option value="weather">🌤️ Provjeri vrijeme</option> <option value="calendar">📅 Provjeri kalendar</option> <option value="traffic">🚗 Prati promet</option> </select> <div class="mt-3 text-xs text-gray-500">
⏰ Svaki dan u:
<input type="time" value="07:30" class="border rounded px-2 py-1" id="agent2-time"> </div> </div> </div> <button id="create-two-agents" class="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
🚀 Stvori moja dva agenta
</button> <div id="two-agents-result" class="hidden bg-white rounded-lg p-4 border border-green-300"> <h4 class="font-bold text-green-800 mb-2">📋 Konfiguracija spremljena!</h4> <pre id="two-agents-config" class="bg-gray-800 text-green-400 p-3 rounded-lg text-xs overflow-x-auto"></pre> </div> </div> </div> </div> <!-- Communication between agents --> <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400"> <h2 class="text-xl font-bold mb-4">💬 Kako agenti razgovaraju?</h2> <p class="text-gray-700 mb-4">
Agenti mogu međusobno dijeliti informacije. Primjer:
</p> <div class="bg-white rounded-lg p-4 font-mono text-sm"> <div class="mb-2"> <span class="text-blue-600 font-bold">🌤️ Vremenski agent → Vijesti agent:</span><br> <span class="text-gray-600">"Obavještavam: Danas kiša. Možda odgoditi planirani prosvjed?"</span> </div> <div class="ml-8"> <span class="text-purple-600 font-bold">📰 Vijesti agent → Vremenski agent:</span><br> <span class="text-gray-600">"Hvala! U vijestima dodajem: 'Prosvjed odgođen zbog kiše'"</span> </div> </div> </div> <!-- Key Takeaway --> <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white"> <h2 class="text-xl font-bold mb-3">🎯 Ključna lekcija</h2> <p class="text-lg"> <strong>Specijalizacija = Kvaliteta</strong><br>
Dva agenta koja rade po jednu stvar odlično su bolja od jednog koji radi sve slabo.
</p> </div> <!-- Navigation --> <div class="flex justify-between items-center pt-6"> <a href="/lekcija/1" class="text-gray-600 hover:text-blue-600 transition">
← Lekcija 1: Prvi agent
</a> <a href="/lekcija/3" class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
Sljedeća: Lošija od tri →
</a> </div> </div> </div> </main> ${renderScript($$result2, "/Users/gaba/Code/tutorijal/src/pages/lekcija/2.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/lekcija/2.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/lekcija/2.astro";
const $$url = "/lekcija/2";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$2,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
