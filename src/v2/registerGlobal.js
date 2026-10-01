/**
 * registerGlobal (v2) - Registers the public API onto globalThis in browser / extension environments.
 * Follows the parameter convention: single config object with 'in'-prefix and 'local'-prefixed internal variables.
 */
export const registerGlobal = (inArgs) => {
    const localArgs = inArgs;
    const localFuncDefinition = typeof localArgs === "function" ? localArgs : localArgs?.inFuncDefinition;

    if (typeof globalThis === "undefined" || !localFuncDefinition) return;

    globalThis.ks ??= {};
    globalThis.ks["tag-to-json"] = {
        domToSpec: localFuncDefinition,
        tagToJson: localFuncDefinition
    };

    globalThis.ks.tagToJson = {
        domToSpec: localFuncDefinition,
        tagToJson: localFuncDefinition
    };

    // Global browser & devtools console shortcuts
    globalThis.domToSpec = localFuncDefinition;
    globalThis.tagToJson = localFuncDefinition;
};

export default registerGlobal;
