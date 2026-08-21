/**
 * KaruviLab Mermaid Security & Constraints Layer
 * Enforces strict security rules, content boundaries, and size caps for user & AI diagrams.
 */

export const MERMAID_SECURITY_LIMITS = {
  MAX_SOURCE_CHARS: 30 * 1024,     // 30 KB application limit
  HARD_CAP_CHARS: 50 * 1024,       // 50 KB hard limit
  MAX_EDGES: 250,                  // 250 edges max per diagram
  HARD_CAP_EDGES: 500,             // 500 hard cap
  MAX_NODES: 350,                  // 350 nodes max
  MAX_DIAGRAMS_PER_DOC: 20,        // Max 20 diagrams per document
  DEFAULT_SECURITY_LEVEL: 'strict' as const,
};

// Forbidden configuration keys that user input is never allowed to override
const FORBIDDEN_CONFIG_PATTERNS = [
  /['"]?securityLevel['"]?\s*[:=][^,}\n]*/gi,
  /['"]?startOnLoad['"]?\s*[:=][^,}\n]*/gi,
  /['"]?maxTextSize['"]?\s*[:=][^,}\n]*/gi,
  /['"]?maxEdges['"]?\s*[:=][^,}\n]*/gi,
  /['"]?htmlLabels['"]?\s*[:=]\s*false/gi,
];

// Dangerous script and event execution patterns in Mermaid source
const DANGEROUS_DIRECTIVE_PATTERNS = [
  // Click directives with javascript: or call
  /click\s+[^\n]+(?:\s+call\s+|\s+href\s+["']?javascript:)/gi,
  // Embedded HTML elements
  /<\s*script\b[^>]*>/gi,
  /<\s*iframe\b[^>]*>/gi,
  /<\s*object\b[^>]*>/gi,
  /<\s*embed\b[^>]*>/gi,
  // SVG event handlers (onload, onerror, onmouseover, onfocus, onclick, etc.)
  /\bon(?:load|error|mouseover|mouseout|focus|blur|click|dblclick|keydown|keyup|keypress|submit|reset|change|input)\s*=/gi,
  // javascript: URLs anywhere in source
  /javascript\s*:/gi,
  // data: URIs that could embed executable content
  /data\s*:\s*(?:text\/html|application\/xhtml\+xml|image\/svg\+xml)/gi,
  // xlink:href with javascript:
  /xlink:href\s*=\s*["']?\s*javascript:/gi,
  // SVG <use> with external references
  /<\s*use\b[^>]*href\s*=\s*["']https?:/gi,
];

export interface SecurityCheckResult {
  allowed: boolean;
  sanitizedSource: string;
  violations: string[];
}

export class MermaidSecurity {
  /**
   * Validate and sanitize diagram source against KaruviLab security rules.
   */
  public static validate(source: string): SecurityCheckResult {
    const violations: string[] = [];

    if (!source || typeof source !== 'string') {
      return { allowed: false, sanitizedSource: '', violations: ['Source is empty or invalid'] };
    }

    // 1. Length validation
    if (source.length > MERMAID_SECURITY_LIMITS.HARD_CAP_CHARS) {
      violations.push(
        `Diagram source exceeds hard limit (${source.length} chars > ${MERMAID_SECURITY_LIMITS.HARD_CAP_CHARS} chars)`
      );
      return { allowed: false, sanitizedSource: source, violations };
    }

    if (source.length > MERMAID_SECURITY_LIMITS.MAX_SOURCE_CHARS) {
      violations.push(
        `Diagram source exceeds recommended limit (${source.length} chars > ${MERMAID_SECURITY_LIMITS.MAX_SOURCE_CHARS} chars)`
      );
    }

    let sanitized = source;

    // 2. Neutralize forbidden embedded config keys
    for (const pattern of FORBIDDEN_CONFIG_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push(`Attempted to override protected Mermaid configuration key (${pattern.source})`);
        sanitized = sanitized.replace(pattern, '/* [stripped protected key] */');
      }
    }

    // 3. Neutralize dangerous script / event execution directives
    for (const pattern of DANGEROUS_DIRECTIVE_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push('Stripped potentially unsafe click/script directive in diagram source');
        sanitized = sanitized.replace(pattern, '%% [stripped unsafe directive] %%');
      }
    }

    return {
      allowed: violations.length === 0 || !violations.some(v => v.includes('exceeds hard limit')),
      sanitizedSource: sanitized,
      violations,
    };
  }

  /**
   * Standard secure Mermaid config settings
   */
  public static getSecureConfig(isDark: boolean) {
    return {
      startOnLoad: false,
      securityLevel: MERMAID_SECURITY_LIMITS.DEFAULT_SECURITY_LEVEL,
      maxTextSize: MERMAID_SECURITY_LIMITS.HARD_CAP_CHARS,
      maxEdges: MERMAID_SECURITY_LIMITS.HARD_CAP_EDGES,
      deterministicIds: true,
      htmlLabels: true, // Use true so complex flowcharts and nodes render properly using foreignObject
      theme: isDark ? 'dark' : 'default',
    };
  }
}
