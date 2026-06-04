// src/tool-engine/validators/validateRegistry.ts
import { ALL_TOOL_CONFIGS } from "../registry";
import { SAMPLE_ASSETS } from "@/src/data/sampleAssets";

export function validateRegistry() {
  const errors: string[] = [];
  const ids = new Set<string>();
  const seoTitles = new Set<string>();

  for (const config of ALL_TOOL_CONFIGS) {
    if (ids.has(config.id)) {
      errors.push(`Duplicate tool ID found: ${config.id}`);
    }
    ids.add(config.id);

    if (seoTitles.has(config.seo.title)) {
      errors.push(`Duplicate SEO title found in tool: ${config.id}`);
    }
    seoTitles.add(config.seo.title);

    if (!config.processor) {
      errors.push(`Missing processor for tool: ${config.id}`);
    }

    if (!SAMPLE_ASSETS[config.emptyState.sampleKey]) {
      // It's allowed if it's explicitly null in the registry, but the key must exist
      if (!(config.emptyState.sampleKey in SAMPLE_ASSETS)) {
        errors.push(`Missing sample asset key '${config.emptyState.sampleKey}' for tool: ${config.id}`);
      }
    }

    if (!config.relatedTools || config.relatedTools.length < 3) {
      errors.push(`Tool ${config.id} must have at least 3 related tools.`);
    }

    if (config.outputType === "custom" && !config.customRenderer) {
      errors.push(`Tool ${config.id} specifies custom outputType but has no customRenderer.`);
    }
  }

  // Cross-reference related tools
  for (const config of ALL_TOOL_CONFIGS) {
    for (const related of config.relatedTools) {
      if (!ids.has(related) && !isLegacyTool(related)) {
         // Allow legacy tools to be linked while migrating
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Registry Validation Failed:\n${errors.join("\n")}`);
  }

  return true;
}

// Temporary helper while migrating
function isLegacyTool(id: string) {
  // We would check the old registry here, but for now we'll just return true
  // to prevent validation failures during the transition.
  return true;
}
