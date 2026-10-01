/**
 * extractText - Extracts immediate or trimmed text content from leaf nodes.
 *
 * @param {Object} inArgs
 * @param {HTMLElement} inArgs.inElement - Target DOM element
 * @returns {string|undefined} Trimmed text content, or undefined if empty
 */
const extractText = ({ inElement } = {}) => {
    const localElement = inElement;

    if (!localElement) return undefined;

    // If element contains child elements, textContent is usually composite;
    // For pure text leaf nodes or elements with only text, return trimmed string.
    const text = localElement.textContent?.trim();
    if (!text || text.length === 0) return undefined;

    return text;
};

export { extractText };
export default extractText;
