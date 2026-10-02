# Development Brain: tag-to-json v4 Upgrade

## Objective
Upgrade `tag-to-json` from `v3` to `v4` without touching `v3` (keeping previous versions intact).
Fix extraction of mixed content: preserve sibling text nodes when an element contains both child elements and text.

## Root Cause in v3
In `v3/domToSpec/index.js`:
```javascript
const childElements = Array.from(resolvedElement.children || []);
if (childElements.length > 0) {
    // Only processed element children!
} else {
    // Only extracted text if children.length === 0!
}
```
When elements had both child elements (such as `<svg>`) and text nodes (such as `"Dashboard"`, `"Products"`, `"This week"`), `v3` dropped the text nodes completely.

## Solution in v4
In `v4/domToSpec/index.js`:
- Check if `resolvedElement.children.length === 0`.
  - If leaf element (no element children): extract `textContent` directly as before via `extractText()`.
- If element has child elements:
  - Traverse `resolvedElement.childNodes` in DOM order.
  - For Element nodes (`nodeType === 1`): recursively extract element spec via `domToSpec`.
  - For Text nodes (`nodeType === 3`): extract trimmed text content. If non-empty, push the string directly into `children`.
- This ensures full mixed content support while maintaining 100% backward compatibility for leaf elements and whitespace-separated tag trees.

## Completed Tasks
- [x] Create brain documentation in `development/brain/v4/`
- [x] Copy `src/v3` to `src/v4` (keeping `src/v3` 100% intact)
- [x] Implement mixed content extraction in `src/v4/domToSpec/index.js`
- [x] Update `src/v4/meta.js`, `src/v4/registerGlobal.js`, and `src/v4/index.js`
- [x] Update `src/index.js` root export to point to `v4`
- [x] Add `./v3` and `./v4` to `package.json` `exports`
- [x] Build production bundle via `npm run build` (`docs/dist/v4/` and `docs/dist/min.js`)
- [x] Copy updated minified bundle to `extension/v3/src/tagToJson.min.js` and run `publish.js` to create `tag-to-json-extension-v3.0.0.zip`
- [x] Create and run automated test suite in `development/brain/v4/test_v4.js` (ALL TESTS PASSED)

## Results
1. Leaf elements serialize as `{ tagName, textContent }`.
2. Pure element trees serialize as `{ tagName, children: [specs...] }`.
3. Mixed content (`<a ...><svg ...></svg> Products</a>`) serializes as `{ tagName: "a", children: [{ tagName: "svg", ... }, "Products"] }`.
4. Buttons with icons and labels (`<button><svg></svg> This week</button>`) serialize as `{ tagName: "button", children: [{ tagName: "svg" }, "This week"] }`.
5. Full round-trip compatibility with `json-to-tag` `v9`.
6. Previous `v3` and earlier versions remain 100% untouched.
