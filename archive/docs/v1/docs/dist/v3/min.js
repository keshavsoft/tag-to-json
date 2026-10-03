const p = ({ inElement: o } = {}) => {
  const t = o;
  if (!t || !t.attributes || t.attributes.length === 0)
    return;
  const e = {};
  for (const n of t.attributes)
    n.name.startsWith("data-gr-") || n.name.startsWith("data-gramm") || n.name === "id" && n.value === "GOOGLE_INPUT_CHEXT_FLAG" || (e[n.name] = n.value);
  return Object.keys(e).length > 0 ? e : void 0;
}, h = ({ inElement: o } = {}) => {
  var n;
  const t = o;
  if (!t) return;
  const e = (n = t.textContent) == null ? void 0 : n.trim();
  if (!(!e || e.length === 0))
    return e;
}, m = ({ inElement: o, inConfig: t = {} } = {}) => {
  var a, f, d;
  const e = o, n = t;
  if (!e) return null;
  const i = typeof e == "string" && typeof document < "u" ? document.getElementById(e) : e;
  if (!i || i.nodeType !== 1)
    return null;
  const r = i.tagName.toLowerCase();
  if (!n.includeScripts && r === "script" || !n.includeStyles && r === "style" || r === "noscript" || !n.includeExtensionElements && (i.id === "GOOGLE_INPUT_CHEXT_FLAG" || (f = (a = i.getAttribute) == null ? void 0 : a.call(i, "style")) != null && f.includes("position: fixed") && i.children.length === 0 && !((d = i.textContent) != null && d.trim())))
    return null;
  const s = {
    tagName: r
  }, c = p({ inElement: i });
  c && (s.attributes = c);
  const u = Array.from(i.children || []);
  if (u.length > 0) {
    const l = u.map((g) => m({ inElement: g, inConfig: n })).filter(Boolean);
    l.length > 0 && (s.children = l);
  } else {
    const l = h({ inElement: i });
    l && (s.textContent = l);
  }
  return s;
}, E = {
  version: "v3",
  description: "JSON-to-DOM engine with centralized traversal and responsibility-focused construction"
}, b = (o) => {
  const t = o, e = typeof t == "function" ? t : t == null ? void 0 : t.inFuncDefinition;
  if (typeof globalThis > "u" || !e) return;
  const n = {
    meta: E,
    domToSpec: e
  };
  globalThis.ks ?? (globalThis.ks = {}), globalThis.ks.tagToJson = n;
}, T = (o = {}) => {
  const t = o, e = (t == null ? void 0 : t.inElement) ?? (t instanceof Node || typeof t == "string" ? t : void 0), n = (t == null ? void 0 : t.inConfig) ?? {};
  return m({
    inElement: e,
    inConfig: n
  });
};
b({ inFuncDefinition: T });
export {
  T as default,
  m as domToSpec,
  T as tagToJson
};
