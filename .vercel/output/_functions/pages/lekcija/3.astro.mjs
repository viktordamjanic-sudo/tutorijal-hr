/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { $ as $$Layout } from "../../chunks/Layout_CrSXUi8e.mjs";
import { renderers } from "../../renderers.mjs";
const $$3 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lekcija 3: Dva su bolja od tri | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4"> <div class="max-w-3xl mx-auto"> <nav class="mb-6"> <a href="/lekcija/2" class="text-blue-600 hover:underline">← Lekcija 2</a> </nav> <div class="bg-white rounded-2xl p-8 shadow-sm mb-6"> <div class="flex items-center gap-3 mb-4"> <span class="text-4xl">⚖️</span> <div class="text-sm text-orange-600 font-medium">Lekcija 3 od 5</div> </div> <h1 class="text-3xl font-bold text-gray-800 mb-4">Dva su bolja od tri</h1> <p class="text-lg text-gray-600">
Kada je previše agenata kontraproduktivno? Nauči prepoznati granicu 
          između efikasnosti i kaosa.
</p> </div> <div class="space-y-6"> <!-- The Problem --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">😵 Problem: Previše kuvara...</h2> <p class="text-gray-700 mb-4">
Zamisli kuhinju u restoranu. Svaki kuhar želi dodati svoj začin:
</p> <!-- Interactive Visualization --> <div class="bg-orange-50 rounded-xl p-4 mb-4"> <div id="too-many-agents-demo" class="space-y-3"> <div class="flex items-center gap-4"> <span class="text-sm font-medium w-24">Agenti:</span> <input type="range" min="1" max="5" value="2" id="agent-count" class="flex-1"> <span id="agent-count-display" class="font-bold text-2xl w-12 text-center">2</span> </div> <!-- Visual representation --> <div id="agents-visual" class="flex flex-wrap gap-2 justify-center py-4"> <span class="text-3xl">🤖</span> <span class="text-3xl">🤖</span> </div> <!-- Result --> <div id="agents-result" class="text-center font-medium text-green-600">
✅ Savršeno! Dva agenta su optimalna.
</div> </div> </div> <div class="space-y-3 text-gray-700"> <p> <strong>1 agent:</strong> Previše posla, spor. 😴
</p> <p> <strong>2 agenta:</strong> Savršeno podijeljeni zadaci. ✅
</p> <p> <strong>3 agenta:</strong> Počinje konfuzija — tko radi što? 🤔
</p> <p> <strong>4+ agenata:</strong> Kaos! Više vremena za koordinaciju nego za rad. 😵
</p> </div> </div> <!-- Real Example --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">📰 Stvarni primjer: Vijesti</h2> <p class="text-gray-700 mb-4">
Želiš pratiti vijesti. Kako organizirati agente?
</p> <!-- Comparison Table --> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="bg-gray-100"> <th class="p-3 text-left">Setup</th> <th class="p-3 text-left">Prednosti</th> <th class="p-3 text-left">Nedostaci</th> <th class="p-3 text-center">Ocjena</th> </tr> </thead> <tbody> <tr class="border-b"> <td class="p-3">1 agent (sve)</td> <td class="p-3">Jednostavno</td> <td class="p-3">Sporo, općenito</td> <td class="p-3 text-center text-yellow-500">⭐⭐⭐</td> </tr> <tr class="border-b bg-green-50"> <td class="p-3 font-bold">2 agenta (split)</td> <td class="p-3">Brzo, specijalizirano</td> <td class="p-3">—</td> <td class="p-3 text-center text-green-500">⭐⭐⭐⭐⭐</td> </tr> <tr class="border-b bg-red-50"> <td class="p-3">3+ agenata</td> <td class="p-3">—</td> <td class="p-3">Konfuzija, overhead</td> <td class="p-3 text-center text-red-500">⭐⭐</td> </tr> </tbody> </table> </div> </div> <!-- The Rule --> <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"> <h2 class="text-xl font-bold mb-3">🎯 Zlatno pravilo</h2> <div class="text-3xl font-bold text-center my-4">
2 agenata = IDEALNO
</div> <ul class="space-y-2"> <li>✅ Dovoljno za podjelu rada</li> <li>✅ Jednostavno za kontrolu</li> <li>✅ Lakša komunikacija</li> <li>✅ Manje grešaka</li> </ul> </div> <!-- When to add third? --> <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400"> <h2 class="text-xl font-bold mb-4">🤔 Kada dodati trećeg?</h2> <p class="text-gray-700 mb-4">
Treći agent je opravdan SAMO ako:
</p> <div class="space-y-3"> <div class="flex items-start gap-3"> <span class="text-2xl">⚡</span> <div> <strong>Zadatak je potpuno drugačiji</strong><br> <span class="text-gray-600">Npr. ne čitanje vijesti, nego upravljanje kalendarom</span> </div> </div> <div class="flex items-start gap-3"> <span class="text-2xl">📈</span> <div> <strong>Previše posla za dva</strong><br> <span class="text-gray-600">Agenti ne stižu završiti do roka</span> </div> </div> <div class="flex items-start gap-3"> <span class="text-2xl">🎯</span> <div> <strong>Treba specijalizirani expert</strong><br> <span class="text-gray-600">Npr. financijski analitičar uz općenitog pomoćnika</span> </div> </div> </div> </div> <!-- Navigation --> <div class="flex justify-between items-center pt-6"> <a href="/lekcija/2" class="text-gray-600 hover:text-blue-600 transition">
← Dva agenta
</a> <a href="/lekcija/4" class="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition">
Sljedeća: Što su skillsi? →
</a> </div> </div> </div> </main> ${renderScript($$result2, "/Users/gaba/Code/tutorijal/src/pages/lekcija/3.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/lekcija/3.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/lekcija/3.astro";
const $$url = "/lekcija/3";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$3,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
