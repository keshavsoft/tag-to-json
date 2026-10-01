# @keshavsoft/tag-to-json

Zero-dependency native DOM element to declarative JSON specification extractor. 

`tag-to-json` is the direct reverse companion to [`@keshavsoft/json-to-tag`](https://www.npmjs.com/package/@keshavsoft/json-to-tag). While `json-to-tag` builds real DOM elements from JSON specifications, `tag-to-json` captures live rendered DOM nodes and converts them back into clean, canonical JSON specification trees.

[![npm version](https://img.shields.io/npm/v/@keshavsoft/tag-to-json.svg)](https://www.npmjs.com/package/@keshavsoft/tag-to-json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Features

- ⚡ **Zero Dependencies & Ultra Fast:** Lightweight pure JavaScript (~1 kB), no DOM libraries required.
- 🔁 **Full Round-Trip Fidelity:** Output specs can be passed directly into `json-to-tag`'s `buildSpecElement({ inSpec })`.
- 🏷️ **Clean Spec Generation:** Automatically captures `tagName`, all element `attributes` (classes, data attributes, inline styles), child hierarchies (`children`), and leaf `textContent`.
- 🛡️ **Strict Parameter Convention:** Built strictly following the `in`-prefixed parameter and `local`-prefixed variable convention.
- 🌐 **Browser Ready:** Auto-registers `window.tagToJson` and `window.ks['tag-to-json']` for effortless browser console testing and integration.

---

## Installation

```bash
npm install @keshavsoft/tag-to-json
```

---

## Usage

### 1. In Modern JavaScript (ES Modules)

```javascript
import { tagToJson } from "@keshavsoft/tag-to-json";

// Pass an element directly or an element ID string:
const spec = tagToJson({
  inElement: document.getElementById("myTable")
});

console.log(JSON.stringify(spec, null, 2));
```

### 2. Browser DevTools Console / Direct Script

When included via `<script type="module" src="...">`, it automatically mounts to `window`:

```javascript
// Inspect any element on a live page and extract its spec:
const spec = window.tagToJson({ inElement: $0 });

// Or pass an ID directly:
const tableSpec = window.tagToJson("stockItemsTable");
```

---

## Example: Round-Trip Workflow

```javascript
import { tagToJson } from "@keshavsoft/tag-to-json";
import { buildSpecElement } from "@keshavsoft/json-to-tag";

// 1. Capture existing HTML element as a JSON spec
const tableElement = document.querySelector("#my-table");
const spec = tagToJson({ inElement: tableElement });

// 2. Re-create the DOM node anywhere using json-to-tag
const recreatedElement = buildSpecElement({ inSpec: spec });
document.getElementById("container").appendChild(recreatedElement);
```

---

## API Reference

### `tagToJson({ inElement, inConfig })`

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `inElement` | `HTMLElement \| string` | *required* | The DOM element node or string ID of the target element. |
| `inConfig` | `Object` | `{}` | Optional extraction configuration. |
| `inConfig.includeScripts` | `boolean` | `false` | Whether to include `<script>` tags in output spec. |
| `inConfig.includeStyles` | `boolean` | `false` | Whether to include `<style>` tags in output spec. |

**Returns**: `Object|null` — The declarative JSON specification object ready for `json-to-tag`.

---

## Architecture

```
[ Live HTML Element ]
        │
        ▼ (tag-to-json / domToSpec)
  Reads: tagName, attributes, textContent, children
        │
        ▼
[ Declarative JSON Specification ]
        │
        ▼ (json-to-tag / buildSpecElement)
[ Reconstructed DOM Element ]
```

---

## License

[MIT](LICENSE) © [KeshavSoft](https://github.com/keshavsoft)
