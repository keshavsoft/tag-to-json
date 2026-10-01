const d = ({ inElement: o } = {}) => {
  const t = o;
  if (!t || !t.attributes || t.attributes.length === 0)
    return;
  const n = {};
  for (const e of t.attributes)
    e.name.startsWith("data-gr-") || e.name.startsWith("data-gramm") || (n[e.name] = e.value);
  return Object.keys(n).length > 0 ? n : void 0;
}, m = ({ inElement: o } = {}) => {
  var e;
  const t = o;
  if (!t) return;
  const n = (e = t.textContent) == null ? void 0 : e.trim();
  if (!(!n || n.length === 0))
    return n;
}, u = ({ inElement: o, inConfig: t = {} } = {}) => {
  const n = o, e = t;
  if (!n) return null;
  const i = typeof n == "string" && typeof document < "u" ? document.getElementById(n) : n;
  if (!i || i.nodeType !== 1)
    return null;
  const s = i.tagName.toLowerCase();
  if (!e.includeScripts && s === "script" || !e.includeStyles && s === "style" || s === "noscript") return null;
  const r = {
    tagName: s
  }, c = d({ inElement: i });
  c && (r.attributes = c);
  const a = Array.from(i.children || []);
  if (a.length > 0) {
    const l = a.map((f) => u({ inElement: f, inConfig: e })).filter(Boolean);
    l.length > 0 && (r.children = l);
  } else {
    const l = m({ inElement: i });
    l && (r.textContent = l);
  }
  return r;
}, g = (o) => {
  const t = o, n = typeof t == "function" ? t : t == null ? void 0 : t.inFuncDefinition;
  typeof globalThis > "u" || !n || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["tag-to-json"] = {
    domToSpec: n,
    tagToJson: n
  }, globalThis.ks.tagToJson = {
    domToSpec: n,
    tagToJson: n
  }, globalThis.domToSpec = n, globalThis.tagToJson = n);
}, T = (o = {}) => {
  const t = o, n = (t == null ? void 0 : t.inElement) ?? (t instanceof Node || typeof t == "string" ? t : void 0), e = (t == null ? void 0 : t.inConfig) ?? {};
  return u({
    inElement: n,
    inConfig: e
  });
};
g({ inFuncDefinition: T });
export {
  T as default,
  u as domToSpec,
  T as tagToJson
};
