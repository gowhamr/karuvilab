// src/tool-engine/validators/validateRegistry.ts
import { ALL_TOOL_CONFIGS } from "../registry";
import { SAMPLE_ASSETS } from "@/src/data/sampleAssets";
import { validateToolSEO } from "@/src/seo/seoValidator";
import { ALL_TOOLS } from "@/src/tool-registry";
import fs from "fs";
import path from "path";
// Registry of validators for file-accepting tools
const TOOL_VALIDATORS = {
    "image-compressor": true,
    "pdf-merger": true,
};
const VALID_OUTPUT_TYPES = new Set([
    "download",
    "preview",
    "text",
    "json",
    "table",
    "chart",
    "custom",
]);
function verifyProcessorPath(processorFn) {
    const str = processorFn.toString();
    const match = str.match(/import\(['"]([^'"]+)['"]\)/);
    if (!match || !match[1]) {
        return "Could not parse dynamic import path from processor function.";
    }
    let importPath = match[1];
    // Resolve alias
    if (importPath.startsWith("@/")) {
        importPath = importPath.slice(2);
    }
    // Check if file exists
    const fullPath = path.resolve(process.cwd(), importPath);
    const possiblePaths = [
        fullPath + ".ts",
        fullPath + ".tsx",
        fullPath + "/index.ts",
        fullPath + "/index.tsx",
        fullPath + ".js",
        fullPath + ".jsx",
    ];
    if (!possiblePaths.some(p => fs.existsSync(p))) {
        return `Processor path does not resolve: ${match[1]} (tried: ${possiblePaths.join(", ")})`;
    }
    return null;
}
export function validateRegistry() {
    const errors = [];
    const ids = new Set();
    const seoTitles = new Set();
    const routes = new Set();
    const canonicals = new Set();
    // Collect all legacy/global tool IDs to validate links
    const legacyIds = new Set(ALL_TOOLS.map(t => t.id));
    for (const config of ALL_TOOL_CONFIGS) {
        // Check 1: Duplicate tool IDs
        if (ids.has(config.id)) {
            errors.push(`Duplicate tool ID found: ${config.id}`);
        }
        ids.add(config.id);
        // Check 2: SEO Validator
        const seoErrors = validateToolSEO(config);
        errors.push(...seoErrors);
        // Check 3: Duplicate SEO titles
        if (seoTitles.has(config.seo.title)) {
            errors.push(`Duplicate SEO title found in tool: ${config.id}`);
        }
        seoTitles.add(config.seo.title);
        // Check 4: Duplicate routes
        const route = `${config.category}/${config.id}`;
        if (routes.has(route)) {
            errors.push(`Duplicate route path found: ${route}`);
        }
        routes.add(route);
        if (config.seo.canonical) {
            if (canonicals.has(config.seo.canonical)) {
                errors.push(`Duplicate canonical path found: ${config.seo.canonical}`);
            }
            canonicals.add(config.seo.canonical);
        }
        // Check 5: File-accepting tool has entry in TOOL_VALIDATORS
        const isFileAccepting = config.inputType === "file" || config.inputType === "batch";
        if (isFileAccepting && !TOOL_VALIDATORS[config.id]) {
            errors.push(`File-accepting tool ${config.id} is missing an entry in TOOL_VALIDATORS.`);
        }
        // Check 6: Every processor import path resolves
        if (!config.processor) {
            errors.push(`Missing processor for tool: ${config.id}`);
        }
        else {
            const pathError = verifyProcessorPath(config.processor);
            if (pathError) {
                errors.push(`Processor resolution error in tool ${config.id}: ${pathError}`);
            }
        }
        // Check 7: Every sampleKey referenced in emptyState exists in SAMPLE_ASSETS
        if (config.emptyState.sampleKey) {
            if (!(config.emptyState.sampleKey in SAMPLE_ASSETS)) {
                errors.push(`Missing sample asset key '${config.emptyState.sampleKey}' in SAMPLE_ASSETS for tool: ${config.id}`);
            }
        }
        // Check 8: Every outputType is valid
        if (!VALID_OUTPUT_TYPES.has(config.outputType)) {
            errors.push(`Invalid outputType '${config.outputType}' for tool: ${config.id}`);
        }
        if (config.outputType === "custom" && !config.customRenderer) {
            errors.push(`Tool ${config.id} specifies custom outputType but has no customRenderer.`);
        }
    }
    // Check 9: Every relatedTools entry references a valid tool ID (migrated or legacy)
    for (const config of ALL_TOOL_CONFIGS) {
        if (!config.relatedTools || config.relatedTools.length < 3) {
            errors.push(`Tool ${config.id} must have at least 3 related tools.`);
        }
        else {
            for (const related of config.relatedTools) {
                if (!ids.has(related) && !legacyIds.has(related)) {
                    errors.push(`Tool ${config.id} references invalid related tool ID: ${related}`);
                }
            }
        }
    }
    if (errors.length > 0) {
        throw new Error(`Registry Validation Failed:\n${errors.join("\n")}`);
    }
    return true;
}
// Run validation directly if called as a script
if (require.main === module || (typeof process !== "undefined" && process.argv[1]?.includes("validateRegistry"))) {
    try {
        validateRegistry();
        console.log("✅ Registry validation passed.");
        process.exit(0);
    }
    catch (err) {
        console.error(`❌ ${err.message}`);
        process.exit(1);
    }
}
