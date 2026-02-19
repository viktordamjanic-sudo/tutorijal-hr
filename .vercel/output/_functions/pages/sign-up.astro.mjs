/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from "../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { a as $$InternalUIComponentRenderer, $ as $$Layout } from "../chunks/Layout_CrSXUi8e.mjs";
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro();
const $$SignUp = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignUp;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-up" })}`;
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/SignUp.astro", void 0);
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registracija | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4"> <div class="max-w-md mx-auto"> <!-- Breadcrumb --> <nav class="mb-6"> <a href="/" class="text-blue-600 hover:underline">← Natrag na početnu</a> </nav> <div class="bg-white rounded-2xl p-8 shadow-sm"> <h1 class="text-2xl font-bold text-center mb-2">Stvori račun 🚀</h1> <p class="text-gray-600 text-center mb-6">
Pridruži se i nauči k AI može riješiti stvarne probleme.
</p> ${renderComponent($$result2, "SignUp", $$SignUp, { "routing": "path", "path": "/sign-up", "redirectUrl": "/profil", "appearance": {
    elements: {
      formButtonPrimary: "bg-green-600 hover:bg-green-700",
      footerActionLink: "text-green-600 hover:text-green-700"
    }
  } })} </div> <p class="text-center text-sm text-gray-500 mt-6">
Već imaš račun?
<a href="/sign-in" class="text-green-600 hover:underline font-medium">Prijavi se</a> </p> </div> </main> ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/sign-up/index.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/sign-up/index.astro";
const $$url = "/sign-up";
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
