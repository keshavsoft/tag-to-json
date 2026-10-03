// Test Suite for tag-to-json v5 (Story-Delivered W3C Mixed-Content Architecture)
// Located in: development/brain/v5/test_v5.js

class MockNode {
    constructor(nodeType, tagName) {
        this.nodeType = nodeType;
        this.tagName = tagName ? tagName.toUpperCase() : "";
        this.childNodes = [];
        this.attributes = [];
    }
    get children() {
        return this.childNodes.filter(n => n.nodeType === 1);
    }
    get textContent() {
        return this.childNodes.map(n => n.textContent || "").join("");
    }
    appendChild(child) {
        this.childNodes.push(child);
        return child;
    }
    getAttribute(name) {
        const found = this.attributes.find(a => a.name === name);
        return found ? found.value : null;
    }
}

class MockTextNode extends MockNode {
    constructor(text) {
        super(3, "#text");
        this._text = text;
    }
    get textContent() {
        return this._text;
    }
}

class MockCommentNode extends MockNode {
    constructor(comment) {
        super(8, "#comment");
        this._comment = comment;
    }
}

class MockElement extends MockNode {
    constructor(tagName) {
        super(1, tagName);
    }
    setAttribute(name, value) {
        const existing = this.attributes.find(a => a.name === name);
        if (existing) {
            existing.value = String(value);
        } else {
            this.attributes.push({ name, value: String(value) });
        }
    }
}

// Global W3C Node interface definition
globalThis.Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8
};

import domToSpec from "../../../src/v5/domToSpec/index.js";
import { tagToJson } from "../../../src/v5/index.js";

console.log("==========================================");
console.log("RUNNING TAG-TO-JSON V5 VERIFICATION TESTS");
console.log("==========================================");

// Test 1: Chapter 4 Path A - Leaf Text Element
const h1 = new MockElement("h1");
h1.setAttribute("class", "h2");
h1.appendChild(new MockTextNode("Dashboard"));

const h1Spec = domToSpec({ inElement: h1 });
console.log("Test 1 (Leaf text):", JSON.stringify(h1Spec));
if (h1Spec.tagName !== "h1" || h1Spec.textContent !== "Dashboard" || h1Spec.children !== undefined) {
    throw new Error("Test 1 failed: Leaf element should have textContent, not children");
}

// Test 2: Chapter 4 Path B - Pure Element Container
const ul = new MockElement("ul");
const li1 = new MockElement("li");
li1.appendChild(new MockTextNode("Item 1"));
const li2 = new MockElement("li");
li2.appendChild(new MockTextNode("Item 2"));
ul.appendChild(li1);
ul.appendChild(li2);

const ulSpec = domToSpec({ inElement: ul });
console.log("Test 2 (Element children):", JSON.stringify(ulSpec));
if (ulSpec.children?.length !== 2 || ulSpec.children[0].textContent !== "Item 1") {
    throw new Error("Test 2 failed: Element container mismatch");
}

// Test 3: Chapter 5 - The W3C Tree Walker (Mixed Content: <svg> + "Products")
const a = new MockElement("a");
a.setAttribute("class", "nav-link d-flex align-items-center gap-2");
a.setAttribute("href", "#");

const svg = new MockElement("svg");
svg.setAttribute("class", "bi");
const use = new MockElement("use");
use.setAttribute("xlink:href", "#cart");
svg.appendChild(use);

// Whitespace text node (should be trimmed and ignored if whitespace-only)
a.appendChild(new MockTextNode("\n  "));
// Element node (<svg>)
a.appendChild(svg);
// Comment node (should be skipped)
a.appendChild(new MockCommentNode("Navigation label follows"));
// Meaningful sibling text node ("Products")
a.appendChild(new MockTextNode("\n  Products\n"));

const aSpec = domToSpec({ inElement: a });
console.log("Test 3 (Mixed Content Tree Walker):", JSON.stringify(aSpec, null, 2));

if (!Array.isArray(aSpec.children) || aSpec.children.length !== 2) {
    throw new Error(`Test 3 failed: Expected exactly 2 children (svg + string), got ${aSpec.children?.length}`);
}
if (aSpec.children[0].tagName !== "svg") {
    throw new Error(`Test 3 failed: First child should be svg, got ${aSpec.children[0].tagName}`);
}
if (aSpec.children[1] !== "Products") {
    throw new Error(`Test 3 failed: Second child should be 'Products', got ${aSpec.children[1]}`);
}

// Test 4: Default tagToJson export wrapper with single object param
const wrappedSpec = tagToJson({ inElement: a });
if (!wrappedSpec || wrappedSpec.children?.[1] !== "Products") {
    throw new Error("Test 4 failed: tagToJson wrapper output mismatch");
}

console.log("==========================================");
console.log("ALL V5 ARCHITECTURE TESTS PASSED!");
console.log("==========================================");
