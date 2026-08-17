// src/seo/seoValidator.ts
/**
 * Validates the SEO data of a single tool configuration.
 * Returns an array of error strings (empty if valid).
 */
export function validateToolSEO(tool) {
    const errors = [];
    const { seo, id } = tool;
    if (!seo) {
        errors.push(`[${id}] Missing 'seo' configuration object completely.`);
        return errors;
    }
    // 1. Title Validation (<= 60 chars)
    if (!seo.title) {
        errors.push(`[${id}] SEO title is required.`);
    }
    else if (seo.title.length > 60) {
        errors.push(`[${id}] SEO title exceeds 60 characters (current length: ${seo.title.length}).`);
    }
    // 2. Description Validation (<= 160 chars)
    if (!seo.description) {
        errors.push(`[${id}] SEO description is required.`);
    }
    else if (seo.description.length > 160) {
        errors.push(`[${id}] SEO description exceeds 160 characters (current length: ${seo.description.length}).`);
    }
    // 3. Keywords Validation (Minimum 3 keywords)
    if (!seo.keywords || !Array.isArray(seo.keywords)) {
        errors.push(`[${id}] SEO keywords must be an array.`);
    }
    else if (seo.keywords.length < 3) {
        errors.push(`[${id}] SEO keywords must contain at least 3 items (current count: ${seo.keywords.length}).`);
    }
    // 4. Canonical URL Validation (Required)
    if (!seo.canonical) {
        errors.push(`[${id}] SEO canonical path is required.`);
    }
    // 5. OpenGraph Image Validation (Required)
    if (!seo.ogImage) {
        errors.push(`[${id}] SEO ogImage path is required.`);
    }
    return errors;
}
/**
 * Validates a registry of tools and throws an Error if any fail, halting build/tests.
 */
export function validateAllToolsSEO(tools) {
    const allErrors = [];
    tools.forEach((tool) => {
        const errors = validateToolSEO(tool);
        allErrors.push(...errors);
    });
    if (allErrors.length > 0) {
        throw new Error(`SEO Configuration Validation Failed:\n${allErrors.join("\n")}`);
    }
}
