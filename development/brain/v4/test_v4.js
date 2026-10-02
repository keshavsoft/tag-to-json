// Mock DOM for tag-to-json v4 testing without external packages

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

import domToSpec from "../../../src/v4/domToSpec/index.js";

// Test 1: Leaf Element (textContent)
const span = new MockElement("span");
span.setAttribute("class", "badge");
span.appendChild(new MockTextNode("Active"));

const spanSpec = domToSpec({ inElement: span });
console.log("Test 1 (Leaf text):", JSON.stringify(spanSpec));
if (spanSpec.textContent !== "Active" || spanSpec.children !== undefined) {
    throw new Error("Test 1 failed: Leaf element should have textContent, not children");
}

// Test 2: Pure element children
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
    throw new Error("Test 2 failed: Pure element children mismatch");
}

// Test 3: Mixed Content (<svg> + "Products")
const a = new MockElement("a");
a.setAttribute("class", "nav-link d-flex align-items-center gap-2");
const svg = new MockElement("svg");
svg.setAttribute("class", "bi");
const use = new MockElement("use");
use.setAttribute("xlink:href", "#cart");
svg.appendChild(use);

// Whitespace before svg
a.appendChild(new MockTextNode("\n  "));
// SVG element
a.appendChild(svg);
// Text node after svg
a.appendChild(new MockTextNode("\n  Products\n"));

const aSpec = domToSpec({ inElement: a });
console.log("Test 3 (Mixed Content):", JSON.stringify(aSpec, null, 2));

if (!Array.isArray(aSpec.children) || aSpec.children.length !== 2) {
    throw new Error(`Test 3 failed: Expected 2 children in mixed content, got ${aSpec.children?.length}`);
}
if (aSpec.children[0].tagName !== "svg") {
    throw new Error("Test 3 failed: First child should be svg spec");
}
if (aSpec.children[1] !== "Products") {
    throw new Error(`Test 3 failed: Second child should be 'Products', got '${aSpec.children[1]}'`);
}

// Test 4: Button (<svg> + "This week")
const btn = new MockElement("button");
btn.setAttribute("class", "btn btn-sm");
const calSvg = new MockElement("svg");
btn.appendChild(calSvg);
btn.appendChild(new MockTextNode(" This week "));

const btnSpec = domToSpec({ inElement: btn });
console.log("Test 4 (Button mixed content):", JSON.stringify(btnSpec, null, 2));
if (btnSpec.children[1] !== "This week") {
    throw new Error("Test 4 failed: Button text content mismatch");
}

console.log("\nALL TAG-TO-JSON V4 TESTS PASSED SUCCESSFULLY!");
