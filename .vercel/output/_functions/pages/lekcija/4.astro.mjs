/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { $ as $$Layout } from "../../chunks/Layout_CrSXUi8e.mjs";
import { renderers } from "../../renderers.mjs";
const $$4 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lekcija 4: Što su skillsi? | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4"> <div class="max-w-3xl mx-auto"> <nav class="mb-6"> <a href="/lekcija/3" class="text-blue-600 hover:underline">← Lekcija 3</a> </nav> <div class="bg-white rounded-2xl p-8 shadow-sm mb-6"> <div class="flex items-center gap-3 mb-4"> <span class="text-4xl">🧰</span> <div class="text-sm text-purple-600 font-medium">Lekcija 4 od 5</div> </div> <h1 class="text-3xl font-bold text-gray-800 mb-4">Što su skillsi?</h1> <p class="text-lg text-gray-600">
Nauči kako proširiti mogućnosti svojih agenata dodavanjem novih vještina 
          (skills) — od čitanja vijesti do slanja poruka.
</p> </div> <div class="space-y-6"> <!-- Analogy --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">🎮 Analognija: Video igra</h2> <p class="text-gray-700 mb-4">
U igri počinješ s osnovnim likom. Ali možeš mu dodati sposobnosti:
</p> <div class="grid md:grid-cols-3 gap-4"> <div class="bg-yellow-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">⚔️</div> <div class="font-bold">Skill: Borba</div> <div class="text-sm text-gray-600">+10 jačine</div> </div> <div class="bg-blue-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">🏃</div> <div class="font-bold">Skill: Brzina</div> <div class="text-sm text-gray-600">+20% kretanja</div> </div> <div class="bg-green-50 p-4 rounded-lg text-center"> <div class="text-3xl mb-2">✨</div> <div class="font-bold">Skill: Magija</div> <div class="text-sm text-gray-600">Novi napadi</div> </div> </div> <div class="mt-4 bg-purple-50 rounded-lg p-4"> <p class="text-purple-800"> <strong>Agenti su isti:</strong> Počinju osnovno, ali dodavanjem 
              skillsa uče nove trikove!
</p> </div> </div> <!-- Skills Catalog --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">📚 Katalog popularnih skillsa</h2> <div class="space-y-4"> <!-- Skill 1 --> <div class="border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 transition cursor-pointer skill-card" data-skill="scraper"> <div class="flex items-start gap-4"> <span class="text-4xl">📰</span> <div class="flex-1"> <div class="flex items-center justify-between"> <h3 class="font-bold text-lg">Scraper Skill</h3> <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Popularno</span> </div> <p class="text-gray-600 text-sm mt-1">
Agent uči čitati vijesti s web stranica (Jutarnji, Večernji...)
</p> <div class="hidden mt-3 bg-blue-50 rounded-lg p-3 skill-details"> <pre class="text-xs bg-gray-800 text-green-400 p-2 rounded">skill: scraper
sources:
  - jutarnji.hr
  - vecernji.hr
interval: "1h"</pre> <button class="mt-2 text-blue-600 text-sm font-medium add-skill-btn">
➕ Dodaj svom agentu
</button> </div> </div> </div> </div> <!-- Skill 2 --> <div class="border-2 border-green-200 rounded-xl p-4 hover:border-green-400 transition cursor-pointer skill-card" data-skill="messaging"> <div class="flex items-start gap-4"> <span class="text-4xl">💬</span> <div class="flex-1"> <div class="flex items-center justify-between"> <h3 class="font-bold text-lg">Messaging Skill</h3> <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Osnovno</span> </div> <p class="text-gray-600 text-sm mt-1">
Agent uči slati poruke na Telegram, WhatsApp, Signal...
</p> <div class="hidden mt-3 bg-green-50 rounded-lg p-3 skill-details"> <pre class="text-xs bg-gray-800 text-green-400 p-2 rounded">skill: messaging
platform: telegram
channel: "@moj_kanal"
format: "markdown"</pre> <button class="mt-2 text-green-600 text-sm font-medium add-skill-btn">
➕ Dodaj svom agentu
</button> </div> </div> </div> </div> <!-- Skill 3 --> <div class="border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 transition cursor-pointer skill-card" data-skill="weather"> <div class="flex items-start gap-4"> <span class="text-4xl">🌤️</span> <div class="flex-1"> <div class="flex items-center justify-between"> <h3 class="font-bold text-lg">Weather Skill</h3> <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Korisno</span> </div> <p class="text-gray-600 text-sm mt-1">
Agent uči dohvaćati vremensku prognozu za bilo koji grad
</p> <div class="hidden mt-3 bg-purple-50 rounded-lg p-3 skill-details"> <pre class="text-xs bg-gray-800 text-green-400 p-2 rounded">skill: weather
city: "Zagreb"
units: "metric"
alerts: true</pre> <button class="mt-2 text-purple-600 text-sm font-medium add-skill-btn">
➕ Dodaj svom agentu
</button> </div> </div> </div> </div> <!-- Skill 4 --> <div class="border-2 border-orange-200 rounded-xl p-4 hover:border-orange-400 transition cursor-pointer skill-card" data-skill="calendar"> <div class="flex items-start gap-4"> <span class="text-4xl">📅</span> <div class="flex-1"> <div class="flex items-center justify-between"> <h3 class="font-bold text-lg">Calendar Skill</h3> <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Pro</span> </div> <p class="text-gray-600 text-sm mt-1">
Agent uči čitati kalendar i slati podsjetnike
</p> <div class="hidden mt-3 bg-orange-50 rounded-lg p-3 skill-details"> <pre class="text-xs bg-gray-800 text-green-400 p-2 rounded">skill: calendar
source: google
reminders: ["1h", "1d"]
sync: true</pre> <button class="mt-2 text-orange-600 text-sm font-medium add-skill-btn">
➕ Dodaj svom agentu
</button> </div> </div> </div> </div> </div> </div> <!-- How to add skills --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">🛠️ Kako dodati skill?</h2> <div class="space-y-3"> <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"> <span class="text-2xl font-bold text-purple-600">1</span> <div> <strong>Odaberi skill</strong> s popisa iznad
</div> </div> <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"> <span class="text-2xl font-bold text-purple-600">2</span> <div> <strong>Klikni "Dodaj svom agentu"</strong> za kopirati kod
</div> </div> <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"> <span class="text-2xl font-bold text-purple-600">3</span> <div> <strong>Zalijepi u svoju agent konfiguraciju</strong> (YAML datoteku)
</div> </div> <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"> <span class="text-2xl font-bold text-purple-600">4</span> <div> <strong>Restartiraj agenta</strong> — spreman je s novim vještinama!
</div> </div> </div> </div> <!-- Your Agent with Skills --> <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"> <h2 class="text-xl font-bold mb-4">🎯 Tvoj super-agent</h2> <div id="agent-preview" class="bg-white/10 rounded-lg p-4"> <div class="flex items-center gap-3 mb-3"> <span class="text-3xl">🤖</span> <div> <div class="font-bold">Moj Agent</div> <div class="text-sm opacity-75">Skills: <span id="skills-count">0</span></div> </div> </div> <div id="skills-list" class="flex flex-wrap gap-2"> <span class="text-sm opacity-75">Klikni na skillove iznad da ih dodaš...⬆️</span> </div> </div> </div> <!-- Navigation --> <div class="flex justify-between items-center pt-6"> <a href="/lekcija/3" class="text-gray-600 hover:text-blue-600 transition">
← Dva su bolja od tri
</a> <a href="/lekcija/5" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
Sljedeća: Prva automatizacija →
</a> </div> </div> </div> </main> ${renderScript($$result2, "/Users/gaba/Code/tutorijal/src/pages/lekcija/4.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/lekcija/4.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/lekcija/4.astro";
const $$url = "/lekcija/4";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$4,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
