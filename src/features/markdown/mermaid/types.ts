/**
 * KaruviLab Mermaid Rendering Subsystem Types
 */

export type MermaidDiagramType =
  | 'flowchart'
  | 'sequenceDiagram'
  | 'classDiagram'
  | 'stateDiagram'
  | 'erDiagram'
  | 'journey'
  | 'gantt'
  | 'pie'
  | 'quadrantChart'
  | 'requirementDiagram'
  | 'gitGraph'
  | 'mindmap'
  | 'timeline'
  | 'sankey'
  | 'xychart'
  | 'block'
  | 'architecture'
  | 'packet'
  | 'kanban'
  | 'c4'
  | 'radar'
  | 'treemap'
  | 'venn'
  | 'ishikawa'
  | 'wardley'
  | 'swimlane'
  | 'treeview'
  | 'unknown';

export type MermaidSupportLevel = 'stable' | 'experimental' | 'unsupported';

export type MermaidErrorKind =
  | 'SYNTAX_ERROR'
  | 'UNSUPPORTED_DIAGRAM'
  | 'COMPLEXITY_LIMIT'
  | 'TIMEOUT'
  | 'MEMORY_LIMIT'
  | 'RENDER_ERROR'
  | 'SANITIZATION_ERROR'
  | 'EXPORT_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

export interface MermaidDiagramCapability {
  type: MermaidDiagramType;
  displayName: string;
  supportLevel: MermaidSupportLevel;
  mobileSupported: boolean;
  exportPdf: boolean;
  exportPng: boolean;
  exportSvg: boolean;
  maxRecommendedNodes: number;
  maxRecommendedEdges: number;
  description: string;
}

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'blocked';

export interface MermaidComplexity {
  characters: number;
  lines: number;
  nodes: number;
  edges: number;
  subgraphs: number;
  complexity: ComplexityLevel;
  reason?: string | undefined;
}

export interface MermaidPreflight {
  valid: boolean;
  type: MermaidDiagramType;
  complexity: MermaidComplexity;
  warnings: string[];
  errors: string[];
}

export interface MermaidBlock {
  id: string;
  source: string;
  hash: string;
  index: number;
  lang?: string | undefined;
}

export type MermaidThemeMode = 'dark' | 'light';

export interface MermaidCacheEntry {
  id: string;
  hash: string;
  svg: string;
  theme: MermaidThemeMode;
  width?: number | undefined;
  height?: number | undefined;
  timestamp: number;
  approxBytes?: number;
  mermaidVersion: string;
}

export interface MermaidRenderResult {
  id: string;
  hash: string;
  svg: string;
  width?: number | undefined;
  height?: number | undefined;
  error?: string | undefined;
  errorKind?: MermaidErrorKind | undefined;
  source: string;
  timestamp: number;
  generationId?: number | undefined;
  renderTimeMs?: number | undefined;
  cacheHit?: boolean | undefined;
}

export interface MermaidRenderOptions {
  theme?: MermaidThemeMode | undefined;
  forceRerender?: boolean | undefined;
  generationId?: number | undefined;
  /** Universal document revision for stale-result protection */
  documentRevision?: number | undefined;
  signal?: AbortSignal | undefined;
  priority?: 'immediate' | 'queue' | 'lazy' | undefined;
}

export interface MermaidMetrics {
  totalRenders: number;
  cacheHits: number;
  cacheMisses: number;
  renderErrors: number;
  abortedRenders: number;
  avgRenderTimeMs: number;
  lastRenderTimeMs: number;
  approxCacheBytes?: number;
}
