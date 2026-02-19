/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from "../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { a as $$InternalUIComponentRenderer, $ as $$Layout } from "../chunks/Layout_CrSXUi8e.mjs";
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro();
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignIn;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-in" })}`;
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/SignIn.astro", void 0);
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Prijava | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4"> <div class="max-w-md mx-auto"> <!-- Breadcrumb --> <nav class="mb-6"> <a href="/" class="text-blue-600 hover:underline">← Natrag na početnu</a> </nav> <div class="bg-white rounded-2xl p-8 shadow-sm"> <h1 class="text-2xl font-bold text-center mb-2">Dobrodošli natrag! 👋</h1> <p class="text-gray-600 text-center mb-6">
Prijavi se da nastaviš s lekcijama i spremiš napredak.
</p> ${renderComponent($$result2, "SignIn", $$SignIn, { "routing": "path", "path": "/sign-in", "redirectUrl": "/profil", "appearance": {
    elements: {
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
      footerActionLink: "text-blue-600 hover:text-blue-700"
    }
  } })} </div> <p class="text-center text-sm text-gray-500 mt-6">
Još nemaš račun?
<a href="/sign-up" class="text-blue-600 hover:underline font-medium">Registriraj se</a> </p> </div> </main> ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/sign-in/index.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/sign-in/index.astro";
const $$url = "/sign-in";
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
