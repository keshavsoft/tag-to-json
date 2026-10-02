import extractAttributes from "./extractAttributes.js";
import extractText from "./extractText.js";

/**
 * domToSpec (v2) - Pure native DOM to json-to-tag compatible specification tree.
 * Follows the parameter convention: single config object with 'in'-prefix and 'local'-prefixed internal variables.
 *
 * @param {Object} inArgs
 * @param {HTMLElement|string} inArgs.inElement - DOM node or string element ID
 * @param {Object} [inArgs.inConfig] - Extraction settings
 * @param {boolean} [inArgs.inConfig.includeScripts=false] - Whether to capture <script> tags
 * @param {boolean} [inArgs.inConfig.includeStyles=false] - Whether to capture <style> tags
 * @param {boolean} [inArgs.inConfig.includeExtensionElements=false] - Whether to capture third-party extension tags
 * @returns {Object|null} json-to-tag compliant specification object
 */
const domToSpec = ({ inElement, inConfig = {} } = {}) => {
    const localElement = inElement;
    const localConfig = inConfig;

    if (!localElement) return null;

    // Support string ID lookup in browser environment
    const resolvedElement = (typeof localElement === "string" && typeof document !== "undefined")
        ? document.getElementById(localElement)
        : localElement;

    // Guard: Only process Element nodes (nodeType === 1)
    if (!resolvedElement || resolvedElement.nodeType !== 1) {
        return null;
    }

    const tagName = resolvedElement.tagName.toLowerCase();

    // 1. Filter system & non-visual tags
    if (!localConfig.includeScripts && tagName === "script") return null;
    if (!localConfig.includeStyles && tagName === "style") return null;
    if (tagName === "noscript") return null;

    // 2. Filter injected extension containers unless explicitly requested
    if (!localConfig.includeExtensionElements) {
        if (resolvedElement.id === "GOOGLE_INPUT_CHEXT_FLAG") return null;
        if (resolvedElement.getAttribute?.("style")?.includes("position: fixed") && resolvedElement.children.length === 0 && !resolvedElement.textContent?.trim()) {
            // Empty fixed extension container divs
            return null;
        }
    }

    const localSpec = {
        tagName
    };

    // 3. Extract Attributes
    const localAttributes = extractAttributes({ inElement: resolvedElement });
    if (localAttributes) {
        localSpec.attributes = localAttributes;
    }

    // 4. Extract Children Elements
    const childElements = Array.from(resolvedElement.children || []);
    if (childElements.length > 0) {
        const parsedChildren = childElements
            .map((child) => domToSpec({ inElement: child, inConfig: localConfig }))
            .filter(Boolean);

        if (parsedChildren.length > 0) {
            localSpec.children = parsedChildren;
        }
    } else {
        // 5. Leaf Element Text Content
        const localText = extractText({ inElement: resolvedElement });
        if (localText) {
            localSpec.textContent = localText;
        }
    }

    return localSpec;
};

export { domToSpec };
export default domToSpec;
