# Development Brain: tag-to-json v5 Upgrade — The Story-First W3C Mixed-Content Architecture

## Location
All brain files, architecture notes, and test suites for this repository are strictly located here:
`tag-to-json/development/brain/v5/`

## Objective
Upgrade `tag-to-json` from `v4` to `v5` without modifying `v4` or any previous versions (zero-touch).
Transform the extraction architecture into a "story-delivered" design grounded in official W3C DOM specifications (`Node.ELEMENT_NODE === 1`, `Node.TEXT_NODE === 3`).
Create `extension/v5/` mirroring this architecture and update documentation.

## Core Architectural Principles
1. **Story-First Modularity**: Structure files and folders by clear narrative responsibilities (Gatekeeper, Fork in the road, W3C Tree Walker, Attribute Serializer) instead of mechanical one-function-per-file fragmentation.
2. **W3C Standards Grounding**: Explicitly tie node identification to the WHATWG/W3C DOM Level 4 Standard (`https://dom.spec.whatwg.org/#dom-node-nodetype`) and MDN Web Docs.
3. **Parameter Convention**: Enforce `{ inParam }` destructured single-object parameter and `const localParam = inParam;` internal assignment.
4. **Zero-Touch on v4**: Keep `src/v4/` and `extension/v4/` completely intact.

## Tasks
- [x] Create `development/brain/v5/` documentation and tracking
- [x] Create `development/brain/v5/w3c_nodetype_story.md`
- [x] Create `src/v5/` by copying `src/v4/`
- [x] Refactor `src/v5/domToSpec/` with story-first narrative, W3C constants, and educational commentary
- [x] Create `src/v5/README.md` and `src/v5/domToSpec/README.md` detailing the DOM mixed-content story
- [x] Update `src/v5/meta.js`, `src/v5/registerGlobal.js`, and `src/v5/index.js`
- [x] Update `src/index.js` root export to point to `v5`
- [x] Add `./v5` to `package.json` exports
- [x] Build production bundles via `npm run build` (`docs/dist/v5/min.js` and `docs/dist/min.js`)
- [x] Create `extension/v5/` with `5.0.0` manifest, updated popup, modular content script, and publish script
- [x] Package `tag-to-json-extension-v5.0.0.zip`
- [x] Create automated test suite in `development/brain/v5/test_v5.js` and verify (ALL TESTS PASSED)
- [x] Update repository `README.md`
