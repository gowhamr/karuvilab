/**
 * KaruviLab Mermaid Preflight & Complexity Analyzer
 * Analyzes syntax type, estimated complexity, node/edge counts, and computes deterministic hashes.
 */

import {
  MermaidComplexity,
  MermaidDiagramType,
  MermaidPreflight,
  ComplexityLevel,
} from './types';
import { MERMAID_SECURITY_LIMITS, MermaidSecurity } from './MermaidSecurity';

const DIAGRAM_TYPE_PATTERNS: Array<{ type: MermaidDiagramType; regex: RegExp }> = [
  { type: 'flowchart', regex: /^\s*(?:flowchart|graph)\b/i },
  { type: 'sequenceDiagram', regex: /^\s*sequenceDiagram\b/i },
  { type: 'classDiagram', regex: /^\s*classDiagram\b/i },
  { type: 'stateDiagram', regex: /^\s*stateDiagram(?:-v2)?\b/i },
  { type: 'erDiagram', regex: /^\s*erDiagram\b/i },
  { type: 'journey', regex: /^\s*journey\b/i },
  { type: 'gantt', regex: /^\s*gantt\b/i },
  { type: 'pie', regex: /^\s*pie\b/i },
  { type: 'quadrantChart', regex: /^\s*quadrantChart\b/i },
  { type: 'requirementDiagram', regex: /^\s*requirementDiagram\b/i },
  { type: 'gitGraph', regex: /^\s*gitGraph\b/i },
  { type: 'mindmap', regex: /^\s*mindmap\b/i },
  { type: 'timeline', regex: /^\s*timeline\b/i },
  { type: 'sankey', regex: /^\s*sankey(?:-beta)?\b/i },
  { type: 'xychart', regex: /^\s*xychart(?:-beta)?\b/i },
  { type: 'block', regex: /^\s*block(?:-beta)?\b/i },
  { type: 'architecture', regex: /^\s*architecture(?:-beta)?\b/i },
  { type: 'packet', regex: /^\s*packet(?:-beta)?\b/i },
  { type: 'kanban', regex: /^\s*kanban\b/i },
  { type: 'c4', regex: /^\s*C4(?:Context|Container|Component|Dynamic|Deployment)\b/i },
  { type: 'radar', regex: /^\s*radar(?:-beta)?\b/i },
  { type: 'treemap', regex: /^\s*treemap(?:-beta)?\b/i },
  { type: 'venn', regex: /^\s*venn(?:-beta)?\b/i },
  { type: 'ishikawa', regex: /^\s*(?:ishikawa|fishbone)\b/i },
  { type: 'wardley', regex: /^\s*wardley\b/i },
  { type: 'swimlane', regex: /^\s*swimlane\b/i },
  { type: 'treeview', regex: /^\s*treeview\b/i },
];

export class MermaidPreflightAnalyzer {
  /**
   * Fast deterministic 64-bit FNV-1a hash implementation returning hex string.
   */
  public static computeHash(source: string, theme: string = 'dark', configVersion: string = 'v1'): string {
    const key = `${configVersion}:${theme}:${source.trim()}`;
    let h1 = 0xdeadbeef;
    let h2 = 0x41c64e6d;
    for (let i = 0; i < key.length; i++) {
      const ch = key.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const high = (h2 >>> 0).toString(16).padStart(8, '0');
    const low = (h1 >>> 0).toString(16).padStart(8, '0');
    return `${high}${low}`;
  }

  /**
   * Identifies the diagram type from the Mermaid source header.
   */
  public static detectType(source: string): MermaidDiagramType {
    const clean = source.replace(/%%\{[\s\S]*?\}%%/g, '').replace(/%%.*$/gm, '').trim();
    for (const { type, regex } of DIAGRAM_TYPE_PATTERNS) {
      if (regex.test(clean)) return type;
    }
    return 'unknown';
  }

  /**
   * Estimates diagram complexity (character size, node counts, edge counts, subgraphs).
   */
  public static analyzeComplexity(source: string): MermaidComplexity {
    const characters = source.length;
    const lines = source.split('\n').length;

    // Approximate node matches: tokens surrounded by shapes or identifiers
    const nodeMatches = source.match(/[a-zA-Z0-9_-]+\s*(?:\[|\(|\{|\>|\(\[|\[\[|\(\()/g) || [];
    const nodes = Math.max(nodeMatches.length, 1);

    // Approximate edge matches: arrows and link syntax
    const edgeMatches = source.match(/(?:-->|---|==>|-\.->|->>|--\s*[\w\s]+\s*-->|<-->)/g) || [];
    const edges = edgeMatches.length;

    // Subgraphs
    const subgraphs = (source.match(/\bsubgraph\b/gi) || []).length;

    let complexity: ComplexityLevel = 'low';
    let reason: string | undefined;

    if (
      characters > MERMAID_SECURITY_LIMITS.HARD_CAP_CHARS ||
      edges > MERMAID_SECURITY_LIMITS.HARD_CAP_EDGES
    ) {
      complexity = 'blocked';
      reason = `Diagram exceeds hard limits (chars: ${characters}, edges: ${edges})`;
    } else if (
      characters > MERMAID_SECURITY_LIMITS.MAX_SOURCE_CHARS ||
      edges > MERMAID_SECURITY_LIMITS.MAX_EDGES ||
      nodes > MERMAID_SECURITY_LIMITS.MAX_NODES
    ) {
      complexity = 'high';
      reason = 'High complexity diagram: on-demand or idle rendering advised';
    } else if (characters > 5 * 1024 || edges > 50 || nodes > 40) {
      complexity = 'medium';
    } else {
      complexity = 'low';
    }

    return {
      characters,
      lines,
      nodes,
      edges,
      subgraphs,
      complexity,
      reason,
    };
  }

  /**
   * Complete preflight check before rendering.
   */
  public static preflight(source: string): MermaidPreflight {
    const warnings: string[] = [];
    const errors: string[] = [];

    const securityResult = MermaidSecurity.validate(source);
    if (!securityResult.allowed) {
      errors.push(...securityResult.violations);
    } else if (securityResult.violations.length > 0) {
      warnings.push(...securityResult.violations);
    }

    const type = this.detectType(source);
    if (type === 'unknown') {
      warnings.push('Could not detect specific diagram type header (defaulting to flowchart)');
    }

    const complexity = this.analyzeComplexity(source);
    if (complexity.complexity === 'blocked') {
      errors.push(complexity.reason || 'Diagram complexity is blocked');
    } else if (complexity.complexity === 'high' && complexity.reason) {
      warnings.push(complexity.reason);
    }

    return {
      valid: errors.length === 0,
      type,
      complexity,
      warnings,
      errors,
    };
  }
}
