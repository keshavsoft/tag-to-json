# The W3C nodeType & Mixed-Content Story

## 1. What is `nodeType` and Who Owns It?

`nodeType` is a native, read-only integer property defined on the global W3C/WHATWG DOM **`Node`** interface.
It is owned and implemented by every standards-compliant **browser engine** (Chromium Blink/V8, Mozilla Gecko/SpiderMonkey, WebKit).

- **Official W3C / WHATWG DOM Standard**: [https://dom.spec.whatwg.org/#dom-node-nodetype](https://dom.spec.whatwg.org/#dom-node-nodetype)
- **MDN Web Docs — Node.nodeType**: [https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)
- **MDN Web Docs — Node.childNodes**: [https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)

### W3C Standard Node Type Table

| Constant | Value | Semantic Meaning | Example in HTML |
| :--- | :---: | :--- | :--- |
| **`Node.ELEMENT_NODE`** | **`1`** | An HTML or SVG element tag with attributes and children | `<div class="...">`, `<a href="#">`, `<svg>` |
| `Node.ATTRIBUTE_NODE` | `2` | Attribute (historical) | `class="active"` |
| **`Node.TEXT_NODE`** | **`3`** | Actual text string contained between or inside elements | `#text " Dashboard "`, `#text "Orders"` |
| `Node.CDATA_SECTION_NODE` | `4` | CDATA Section (XML/SVG) | `<![CDATA[ ... ]]>` |
| `Node.COMMENT_NODE` | `8` | Comment block | `<!-- Navigation Section -->` |
| `Node.DOCUMENT_NODE` | `9` | Document root | `window.document` |
| `Node.DOCUMENT_TYPE_NODE` | `10` | Document Type declaration | `<!DOCTYPE html>` |
| `Node.DOCUMENT_FRAGMENT_NODE` | `11` | Lightweight fragment container | `document.createDocumentFragment()` |

---

## 2. Why `element.children` vs `element.childNodes` Matters

In JavaScript DOM programming:
- **`element.children`** returns an `HTMLCollection` containing **only** child elements (`nodeType === 1`). It completely ignores any text nodes or comments.
- **`element.childNodes`** returns a `NodeList` containing **all** child nodes in exact document order: elements (`nodeType === 1`), text nodes (`nodeType === 3`), and comments (`nodeType === 8`).

### The Real-World Mixed Content Case (Bootstrap 5)
In Bootstrap's sidebar navigation links:
```html
<a class="nav-link d-flex align-items-center gap-2" href="#">
    <svg class="bi" aria-hidden="true"><use xlink:href="#cart"></use></svg>
    Products
</a>
```
This is a **mixed-content node**:
- Child 0: `ELEMENT_NODE` (`<svg>`)
- Child 1: `TEXT_NODE` (`"Products"`)

If a parser uses `element.children`, it only sees `<svg>` and drops `"Products"`!
If a parser inspects `element.childNodes`:
1. It visits Child 0 (`nodeType === 1`) $\rightarrow$ generates `{ tagName: "svg", ... }`.
2. It visits Child 1 (`nodeType === 3`) $\rightarrow$ generates `"Products"`.
3. It stores both in `children: [ { tagName: "svg", ... }, "Products" ]`.

---

## 3. The tag-to-json v5 Narrative Architecture

Instead of over-fragmenting into dozens of single-line micro-files, `tag-to-json` v5 presents a coherent 5-chapter story:

1. **Chapter 1: Target Resolution & Type Guard**
   - Validates that the input is a valid DOM node (`nodeType === Node.ELEMENT_NODE`) or resolves string IDs.
2. **Chapter 2: Clean Gatekeeping & Noise Filtering**
   - Strips non-visual `<script>`, `<style>`, `<noscript>` and injected third-party extension tags (`GOOGLE_INPUT_CHEXT_FLAG`).
3. **Chapter 3: Attribute Dictionary Serialization**
   - Converts DOM attributes (`class`, `href`, `data-*`) into clean JSON object properties.
4. **Chapter 4: The Fork in the Road (Leaf vs Container)**
   - If an element has zero element children (pure text leaf like `<h1>Dashboard</h1>`), extracts clean `textContent`.
   - If an element has children, proceeds to the W3C Tree Walker.
5. **Chapter 5: The W3C Tree Walker**
   - Iterates `element.childNodes` in document order, using `Node.ELEMENT_NODE` and `Node.TEXT_NODE` constants to weave child element specifications and text strings into the `children` array.
