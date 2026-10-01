/**
 * extractAttributes - Extracts all attributes from an element into a clean key-value dictionary.
 * Follows the parameter convention: single config object with 'in'-prefix and 'local'-prefixed internal variables.
 *
 * @param {Object} inArgs
 * @param {HTMLElement} inArgs.inElement - Target DOM element
 * @returns {Object|undefined} Key-value attribute map, or undefined if empty
 */
const extractAttributes = ({ inElement } = {}) => {
    const localElement = inElement;

    if (!localElement || !localElement.attributes || localElement.attributes.length === 0) {
        return undefined;
    }

    const localAttributes = {};
    for (const attr of localElement.attributes) {
        // Skip browser extension injection artifacts if any
        if (attr.name.startsWith("data-gr-") || attr.name.startsWith("data-gramm")) {
            continue;
        }
        localAttributes[attr.name] = attr.value;
    }

    return Object.keys(localAttributes).length > 0 ? localAttributes : undefined;
};

export { extractAttributes };
export default extractAttributes;
