/* empty css                                 */
import { e as createComponent, k as renderComponent, n as renderSlot, r as renderTemplate, h as createAstro, o as defineScriptVars, m as maybeRenderHead } from "../chunks/astro/server_CnGTL073.mjs";
import "piccolore";
import { a as $$InternalUIComponentRenderer, $ as $$Layout, b as $$SignedOut, c as $$SignedIn } from "../chunks/Layout_CrSXUi8e.mjs";
import "clsx";
import { renderers } from "../renderers.mjs";
const $$Astro$3 = createAstro();
const $$UserProfile = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$UserProfile;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "user-profile" })} ${renderSlot($$result, $$slots["default"])}`;
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/UserProfile/UserProfile.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro();
const $$CustomProfilePageRenderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CustomProfilePageRenderer;
  const { url, label, type, component, reorderItemsLabels = [] } = Astro2.props;
  let labelIcon = "";
  let content = "";
  if (Astro2.slots.has("label-icon")) {
    labelIcon = await Astro2.slots.render("label-icon");
  }
  if (Astro2.slots.has("default") && type === "page") {
    content = await Astro2.slots.render("default");
  }
  return renderTemplate(_a || (_a = __template(["<script>(function(){", "\n  // Get the component map from window that we set in the `<InternalUIComponentRenderer />`.\n  const clerkComponentMap = window.__astro_clerk_component_props.get(component);\n\n  const componentElement = document.querySelector(`[data-clerk-id^=\"clerk-${component}\"]`);\n\n  const safeId = componentElement.getAttribute('data-clerk-id');\n  const currentOptions = clerkComponentMap.get(safeId);\n\n  const isReorderItem = reorderItemsLabels.includes(label);\n\n  let newCustomPage = { label };\n\n  if (!isReorderItem) {\n    newCustomPage = {\n      ...newCustomPage,\n      url,\n      mountIcon: el => {\n        el.innerHTML = labelIcon;\n      },\n      unmountIcon: () => {\n        /* Implement cleanup if needed */\n      },\n    };\n\n    if (type === 'page') {\n      newCustomPage = {\n        ...newCustomPage,\n        mount: el => {\n          el.innerHTML = content;\n        },\n        unmount: () => {\n          /* Implement cleanup if needed */\n        },\n      };\n    }\n  }\n\n  // Custom <OrganizationProfile /> pages can be added inside\n  // the <OrganizationSwitcher /> component.\n  if (component === 'organization-switcher') {\n    clerkComponentMap.set(safeId, {\n      ...currentOptions,\n      organizationProfileProps: {\n        ...currentOptions.organizationProfileProps,\n        customPages: [...(currentOptions?.organizationProfileProps?.customPages ?? []), newCustomPage],\n      },\n    });\n  } else {\n    clerkComponentMap.set(safeId, {\n      ...currentOptions,\n      customPages: [...(currentOptions?.customPages ?? []), newCustomPage],\n    });\n  }\n})();<\/script>"], ["<script>(function(){", "\n  // Get the component map from window that we set in the \\`<InternalUIComponentRenderer />\\`.\n  const clerkComponentMap = window.__astro_clerk_component_props.get(component);\n\n  const componentElement = document.querySelector(\\`[data-clerk-id^=\"clerk-\\${component}\"]\\`);\n\n  const safeId = componentElement.getAttribute('data-clerk-id');\n  const currentOptions = clerkComponentMap.get(safeId);\n\n  const isReorderItem = reorderItemsLabels.includes(label);\n\n  let newCustomPage = { label };\n\n  if (!isReorderItem) {\n    newCustomPage = {\n      ...newCustomPage,\n      url,\n      mountIcon: el => {\n        el.innerHTML = labelIcon;\n      },\n      unmountIcon: () => {\n        /* Implement cleanup if needed */\n      },\n    };\n\n    if (type === 'page') {\n      newCustomPage = {\n        ...newCustomPage,\n        mount: el => {\n          el.innerHTML = content;\n        },\n        unmount: () => {\n          /* Implement cleanup if needed */\n        },\n      };\n    }\n  }\n\n  // Custom <OrganizationProfile /> pages can be added inside\n  // the <OrganizationSwitcher /> component.\n  if (component === 'organization-switcher') {\n    clerkComponentMap.set(safeId, {\n      ...currentOptions,\n      organizationProfileProps: {\n        ...currentOptions.organizationProfileProps,\n        customPages: [...(currentOptions?.organizationProfileProps?.customPages ?? []), newCustomPage],\n      },\n    });\n  } else {\n    clerkComponentMap.set(safeId, {\n      ...currentOptions,\n      customPages: [...(currentOptions?.customPages ?? []), newCustomPage],\n    });\n  }\n})();<\/script>"])), defineScriptVars({ url, label, content, labelIcon, type, component, reorderItemsLabels }));
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/CustomProfilePageRenderer.astro", void 0);
const $$Astro$1 = createAstro();
const $$UserProfileLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$UserProfileLink;
  const { url, label } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "CustomProfilePageRenderer", $$CustomProfilePageRenderer, { "label": label, "url": url, "type": "link", "component": "user-profile" }, { "label-icon": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["label-icon"])}` })}`;
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/UserProfile/UserProfileLink.astro", void 0);
const $$Astro = createAstro();
const $$UserProfilePage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UserProfilePage;
  const reorderItemsLabels = ["account", "security", "billing", "apiKeys"];
  const { url, label } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "CustomProfilePageRenderer", $$CustomProfilePageRenderer, { "label": label, "url": url, "type": "page", "component": "user-profile", "reorderItemsLabels": reorderItemsLabels }, { "default": ($$result2) => renderTemplate`  ${renderSlot($$result2, $$slots["default"])} `, "label-icon": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["label-icon"])}` })}`;
}, "/Users/gaba/Code/tutorijal/node_modules/@clerk/astro/components/interactive/UserProfile/UserProfilePage.astro", void 0);
const UserProfile = Object.assign($$UserProfile, {
  Page: $$UserProfilePage,
  Link: $$UserProfileLink
});
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Moj profil | tutorijal.hr" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4"> <div class="max-w-4xl mx-auto"> <!-- Breadcrumb --> <nav class="mb-6"> <a href="/" class="text-blue-600 hover:underline">← Natrag na početnu</a> </nav> <h1 class="text-3xl font-bold text-center mb-8">Moj profil 🎯</h1> ${renderComponent($$result2, "SignedOut", $$SignedOut, {}, { "default": ($$result3) => renderTemplate` <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 text-center"> <p class="text-lg mb-4">Morate se prijaviti da biste vidjeli profil.</p> <a href="/sign-in" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
Prijavi se
</a> </div> ` })} ${renderComponent($$result2, "SignedIn", $$SignedIn, {}, { "default": ($$result3) => renderTemplate` <div class="space-y-8"> <!-- Stats Section --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">📊 Tvoj napredak</h2> <div class="grid md:grid-cols-3 gap-4"> <div class="bg-green-50 rounded-lg p-4 text-center"> <div class="text-3xl mb-1">📚</div> <div class="text-2xl font-bold">0/5</div> <div class="text-sm text-gray-600">Lekcija</div> </div> <div class="bg-blue-50 rounded-lg p-4 text-center"> <div class="text-3xl mb-1">🎮</div> <div class="text-2xl font-bold">0</div> <div class="text-sm text-gray-600">Zadataka</div> </div> <div class="bg-purple-50 rounded-lg p-4 text-center"> <div class="text-3xl mb-1">🔥</div> <div class="text-2xl font-bold">0</div> <div class="text-sm text-gray-600">Dana u nizu</div> </div> </div> </div> <!-- Continue Learning --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">Nastavi učiti 🚀</h2> <div class="space-y-3"> <a href="/lekcija/1" class="flex items-center gap-4 p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition"> <span class="text-2xl">🚀</span> <div class="flex-1"> <div class="font-bold">Lekcija 1: Osnovni setup</div> <div class="text-sm text-gray-600">Pokreni svog prvog agenta</div> </div> <span class="text-purple-600">Započni →</span> </a> <a href="/modul/parking-1" class="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"> <span class="text-2xl">🚗</span> <div class="flex-1"> <div class="font-bold">Parking Hero</div> <div class="text-sm text-gray-600">Ljubazno zamoli susjeda</div> </div> <span class="text-blue-600">Isprobaj →</span> </a> </div> </div> <!-- Clerk User Profile --> <div class="bg-white rounded-xl p-6 shadow-sm"> <h2 class="text-xl font-bold mb-4">Postavke računa ⚙️</h2> ${renderComponent($$result3, "UserProfile", UserProfile, {})} </div> </div> ` })} </div> </main> ` })}`;
}, "/Users/gaba/Code/tutorijal/src/pages/profil/index.astro", void 0);
const $$file = "/Users/gaba/Code/tutorijal/src/pages/profil/index.astro";
const $$url = "/profil";
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
