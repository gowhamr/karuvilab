import { loader } from "@monaco-editor/react";
/**
 * Configure Monaco Editor to load its core from the local public directory
 * rather than fetching from jsDelivr. This enforces KaruviLab's offline-first rule.
 */
export function configureMonacoLoader(basePath = "") {
    // Point to the local `public/lib/monaco/vs` directory synced by scripts/sync-workers.mjs
    loader.config({
        paths: {
            vs: `${basePath}/lib/monaco/vs`,
        },
    });
}
