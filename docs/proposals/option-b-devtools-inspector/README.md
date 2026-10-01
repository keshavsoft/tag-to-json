# Proposal B: DevTools-Style Interactive Hover & Click Inspector

> **Target Version**: `v4.0.0` (Option B)  
> **Status**: Proposed  
> **Related**: [`@keshavsoft/json-to-tag`](https://github.com/keshavsoft/json-to-tag)  
> **Visual Sandbox**: [json-to-tag Visual Renderer](https://keshavsoft.github.io/json-to-tag/jsonUpload/editor.html)

---

## 1. Problem Statement

In v2 and v3, users can only pick an element to extract by selecting an ID from a dropdown list:
- Modern component-driven sites often use utility classes without assigning `id` attributes to every card, button, header, or table.
- Users must search or filter through dozens of IDs.
- There is no visual feedback on the live page showing what element is selected prior to extraction.

---

## 2. Proposed Solution

Introduce an **Interactive Inspection Mode** directly into the browser tab:
1. User clicks **"🎯 Inspect Live Element"** in the popup.
2. The popup closes, and an invisible overlay activates on the webpage.
3. As the mouse moves, a blue highlight bounding box follows the hovered element, displaying its tag name and CSS classes (e.g. `<header.p-3.bg-dark>`).
4. Pressing **Escape** exits inspection mode cleanly.
5. **Clicking** the hovered element:
   - Extracts its JSON specification via `tagToJson({ inElement: target })`.
   - Triggers an instant download of `<tagname>-spec.json`.
   - Displays a brief confirmation toast on screen.

---

## 3. Strict Coding Conventions

All functions and methods must adhere to the single-object input and `in`/`local` variable pattern:
- Parameter is a single object: `{ inElement, inConfig }`
- First lines unpack into `local`-prefixed variables:
  ```javascript
  const localElement = inElement;
  const localConfig = inConfig;
  ```
- No external npm runtime dependencies.

---

## 4. Implementation Specification

### Inspector Module: `src/inspectorOverlay.js`
```javascript
export function startInspectionMode({ onElementSelected, onCanceled }) {
  const localOnSelected = onElementSelected;
  const localOnCanceled = onCanceled;

  // Single non-intrusive highlight box overlay
  const highlightBox = document.createElement("div");
  highlightBox.id = "__tag_to_json_highlight__";
  Object.assign(highlightBox.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "2147483647",
    border: "2px solid #3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: "3px",
    display: "none"
  });
  document.body.appendChild(highlightBox);

  function onMouseMove(event) {
    const target = event.target;
    if (target === highlightBox || target.id?.startsWith("__tag_to_json")) return;

    const rect = target.getBoundingClientRect();
    highlightBox.style.display = "block";
    highlightBox.style.top = `${rect.top}px`;
    highlightBox.style.left = `${rect.left}px`;
    highlightBox.style.width = `${rect.width}px`;
    highlightBox.style.height = `${rect.height}px`;
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    cleanup();

    if (typeof localOnSelected === "function") {
      localOnSelected({ inSelectedElement: event.target });
    }
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      cleanup();
      if (typeof localOnCanceled === "function") {
        localOnCanceled();
      }
    }
  }

  function cleanup() {
    window.removeEventListener("mousemove", onMouseMove, true);
    window.removeEventListener("click", onClick, true);
    window.removeEventListener("keydown", onKeyDown, true);
    highlightBox.remove();
  }

  window.addEventListener("mousemove", onMouseMove, true);
  window.addEventListener("click", onClick, true);
  window.addEventListener("keydown", onKeyDown, true);
}
```

### Content Script Handler (`injectStart.js`):
- Listens for `{ action: "START_INSPECTOR" }`.
- Calls `startInspectionMode`.
- In `onElementSelected({ inSelectedElement })`:
  - Runs `tagToJson({ inElement: inSelectedElement })`.
  - Downloads `<tagname>-spec.json`.
  - Injects a small self-dismissing toast notification into the page.

---

## 5. Verification
1. Open any website without explicit element IDs.
2. Open extension popup and click **"🎯 Inspect Live Element"**.
3. Move cursor over elements: blue box cleanly traces cards, buttons, and sections.
4. Click a card: `<div-spec.json>` downloads immediately without navigating away.
