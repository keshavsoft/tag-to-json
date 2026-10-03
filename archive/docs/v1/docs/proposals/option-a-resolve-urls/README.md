# Proposal A: Absolute URL Resolution for Stylesheets & Assets

> **Target Version**: `v4.0.0` (Option A)  
> **Status**: Proposed  
> **Related**: [`@keshavsoft/json-to-tag`](https://github.com/keshavsoft/json-to-tag)  
> **Visual Sandbox**: [json-to-tag Visual Renderer](https://keshavsoft.github.io/json-to-tag/jsonUpload/editor.html)

---

## 1. Problem Statement

When extracting a full HTML page or component from an external website (e.g. Bootstrap examples or documentation pages), relative resource URLs are captured as written in the DOM:
```html
<link rel="stylesheet" href="/docs/5.3/dist/css/bootstrap.min.css">
<img src="../assets/brand/bootstrap-logo.svg">
```

When this JSON is imported into the Visual Renderer (`https://keshavsoft.github.io/json-to-tag/jsonUpload/editor.html`), the browser resolves `/docs/5.3/...` against `keshavsoft.github.io`, leading to **404 Not Found** errors. As a result, typography, dark/light theme variables, and grid layouts fail to render.

---

## 2. Proposed Solution

During tag extraction, any attribute representing a resource URL (`href`, `src`, `action`, `poster`) must be converted into a fully-qualified absolute URL based on `document.baseURI` or `window.location.href`:

```
"/docs/5.3/dist/css/bootstrap.min.css"
  ==> "https://getbootstrap.com/docs/5.3/dist/css/bootstrap.min.css"
```

---

## 3. Strict Coding Conventions

All functions and methods must adhere to the single-object input and `in`/`local` variable pattern:
- Parameter is a single object: `{ inTag, inAttrName, inAttrValue, inBaseUri }`
- First lines unpack into `local`-prefixed variables:
  ```javascript
  const localTag = inTag;
  const localAttrName = inAttrName;
  const localAttrValue = inAttrValue;
  const localBaseUri = inBaseUri;
  ```
- No external npm runtime dependencies.

---

## 4. Implementation Specification

### Helper Function: `resolveAttributeUrl`
```javascript
export function resolveAttributeUrl({ inTag, inAttrName, inAttrValue, inBaseUri }) {
  const localTag = inTag?.toLowerCase();
  const localAttrName = inAttrName?.toLowerCase();
  const localAttrValue = inAttrValue;
  const localBaseUri = inBaseUri || (typeof document !== "undefined" ? document.baseURI : "");

  const urlCandidateMap = {
    link: ["href"],
    img: ["src", "srcset"],
    script: ["src"],
    a: ["href"],
    source: ["src", "srcset"],
    video: ["src", "poster"],
    audio: ["src"]
  };

  const allowedAttrs = urlCandidateMap[localTag];
  if (!allowedAttrs || !allowedAttrs.includes(localAttrName)) {
    return localAttrValue;
  }

  // Skip data, inline anchors, and javascript:
  if (!localAttrValue || 
      localAttrValue.startsWith("data:") || 
      localAttrValue.startsWith("javascript:") || 
      localAttrValue.startsWith("#")) {
    return localAttrValue;
  }

  try {
    return new URL(localAttrValue, localBaseUri).href;
  } catch (err) {
    return localAttrValue;
  }
}
```

### Integration:
- In `domToSpec/extractElementSpec.js` and extension `injectStart.js`:
  - When collecting attributes in the loop:
    ```javascript
    attrs[a.name] = resolveAttributeUrl({
      inTag: el.tagName,
      inAttrName: a.name,
      inAttrValue: a.value
    });
    ```

---

## 5. Verification
1. Run extension on `https://getbootstrap.com/docs/5.3/examples/headers/`.
2. Download `full-page-spec.json`.
3. Check `<link rel="stylesheet">` attributes—they must point to `https://getbootstrap.com/...`.
4. Upload to the Visual Renderer: the page should now immediately render styled identically to the original site.
