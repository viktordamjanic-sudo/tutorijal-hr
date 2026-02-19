import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_Bs_N8l7f.mjs";
import { manifest } from "./manifest_Bp28O9yQ.mjs";
const serverIslandMap = /* @__PURE__ */ new Map();
;
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/api/favorite.astro.mjs");
const _page2 = () => import("./pages/api/generate.astro.mjs");
const _page3 = () => import("./pages/api/progress.astro.mjs");
const _page4 = () => import("./pages/lekcija/1.astro.mjs");
const _page5 = () => import("./pages/lekcija/2.astro.mjs");
const _page6 = () => import("./pages/lekcija/3.astro.mjs");
const _page7 = () => import("./pages/lekcija/4.astro.mjs");
const _page8 = () => import("./pages/lekcija/5.astro.mjs");
const _page9 = () => import("./pages/modul/_id_.astro.mjs");
const _page10 = () => import("./pages/profil.astro.mjs");
const _page11 = () => import("./pages/sign-in.astro.mjs");
const _page12 = () => import("./pages/sign-up.astro.mjs");
const _page13 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/api/favorite.ts", _page1],
  ["src/pages/api/generate.ts", _page2],
  ["src/pages/api/progress.ts", _page3],
  ["src/pages/lekcija/1.astro", _page4],
  ["src/pages/lekcija/2.astro", _page5],
  ["src/pages/lekcija/3.astro", _page6],
  ["src/pages/lekcija/4.astro", _page7],
  ["src/pages/lekcija/5.astro", _page8],
  ["src/pages/modul/[id].astro", _page9],
  ["src/pages/profil/index.astro", _page10],
  ["src/pages/sign-in/index.astro", _page11],
  ["src/pages/sign-up/index.astro", _page12],
  ["src/pages/index.astro", _page13]
]);
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: () => import("./noop-entrypoint.mjs"),
  middleware: () => import("./_astro-internal_middleware.mjs")
});
const _args = {
  "middlewareSecret": "83d9458a-d87a-46f5-b13d-76a6d6b7d387",
  "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
