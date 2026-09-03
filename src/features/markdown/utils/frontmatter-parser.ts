/**
 * YAML / TOML Frontmatter Parser for Markdown.
 * Parses frontmatter blocks (--- or +++) at the beginning of Markdown documents
 * into structured metadata objects.
 */

export interface ParsedFrontmatter {
  hasFrontmatter: boolean;
  type: 'yaml' | 'toml' | null;
  attributes: Record<string, string | number | boolean | string[]>;
  rawFrontmatter: string;
  body: string;
}

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  if (!markdown || typeof markdown !== 'string') {
    return {
      hasFrontmatter: false,
      type: null,
      attributes: {},
      rawFrontmatter: '',
      body: '',
    };
  }

  // 1. Check for YAML frontmatter (--- ... ---)
  const yamlMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (yamlMatch && yamlMatch[1] !== undefined) {
    const rawYaml = yamlMatch[1];
    const body = yamlMatch[2] || '';
    const attributes = parseYamlAttributes(rawYaml);
    return {
      hasFrontmatter: true,
      type: 'yaml',
      attributes,
      rawFrontmatter: rawYaml,
      body,
    };
  }

  // 2. Check for TOML frontmatter (+++ ... +++)
  const tomlMatch = markdown.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?([\s\S]*)$/);
  if (tomlMatch && tomlMatch[1] !== undefined) {
    const rawToml = tomlMatch[1];
    const body = tomlMatch[2] || '';
    const attributes = parseYamlAttributes(rawToml); // Key-value parsing is similar for simple TOML
    return {
      hasFrontmatter: true,
      type: 'toml',
      attributes,
      rawFrontmatter: rawToml,
      body,
    };
  }

  return {
    hasFrontmatter: false,
    type: null,
    attributes: {},
    rawFrontmatter: '',
    body: markdown,
  };
}

function parseYamlAttributes(raw: string): Record<string, string | number | boolean | string[]> {
  const attributes: Record<string, string | number | boolean | string[]> = {};
  const lines = raw.split(/\r?\n/);

  let currentArrayKey: string | null = null;
  let currentArray: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Handle YAML list item under key: "  - item"
    if (trimmed.startsWith('- ') && currentArrayKey) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      currentArray.push(val);
      attributes[currentArrayKey] = currentArray;
      continue;
    }

    // Key-value pair: "key: value" or "key = value"
    const kvMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*[:=]\s*(.*)$/);
    if (kvMatch && kvMatch[1]) {
      const key = kvMatch[1].trim();
      let rawVal = (kvMatch[2] || '').trim();

      // Check if value is an inline array: "[a, b, c]"
      if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        const items = rawVal
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
        attributes[key] = items;
        currentArrayKey = null;
        continue;
      }

      // Check if value begins a multiline array (empty value)
      if (!rawVal) {
        currentArrayKey = key;
        currentArray = [];
        attributes[key] = currentArray;
        continue;
      }

      currentArrayKey = null;

      // Clean quotes
      rawVal = rawVal.replace(/^["']|["']$/g, '');

      // Parse booleans and numbers
      if (rawVal.toLowerCase() === 'true') {
        attributes[key] = true;
      } else if (rawVal.toLowerCase() === 'false') {
        attributes[key] = false;
      } else if (!isNaN(Number(rawVal)) && rawVal !== '') {
        attributes[key] = Number(rawVal);
      } else {
        attributes[key] = rawVal;
      }
    }
  }

  return attributes;
}
