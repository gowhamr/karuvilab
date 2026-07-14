export type Category = 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'productivity' | 'media' | 'banking' | 'seo' | 'break-time';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type DataType = 'image' | 'pdf' | 'text' | 'json' | 'csv' | 'zip' | 'any-file' | 'none' | 'html' | 'url' | 'password' | 'sql' | 'code';

export interface SEOContent {
  detailedDescription: string;
  howTo: string[];
  faq: { question: string; answer: string }[];
}
export interface ToolEntry {
  // Core Identity
  id: string;
  name: string;
  desc: string;
  href: string;
  category: Category;
  
  // Workflow Chaining
  input?: DataType | DataType[] | null | undefined;
  output?: DataType | DataType[] | null | undefined;
  
  // Discovery & SEO
  keywords: string[];
  searchIntent?: string | null | undefined; // e.g., "transactional", "informational"
  canonicalUrl?: string | null | undefined;
  priority?: number | null | undefined; // 0 to 1 for sitemap (e.g., 0.8)
  
  // UI & UX
  icon?: string | null | undefined; // Emoji or SVG path
  color?: string | null | undefined; // Brand color for the tool
  featured?: boolean | null | undefined;
  popular?: boolean | null | undefined;
  difficulty?: Difficulty | null | undefined;
  
  // Semantic Intelligence
  related?: string[] | null | undefined; // Array of tool IDs
  
  // Content Engine
  seoContent?: SEOContent | null | undefined;
  schemaType?: 'SoftwareApplication' | 'WebApplication' | null | undefined;
  sampleAssetKey?: string | null | undefined;
  
  // Custom grouping
  subCategory?: string | null | undefined;
  
  // Analytics & Management
  analyticsId?: string | null | undefined;
  status?: 'stable' | 'beta' | 'deprecated' | 'new' | null | undefined;
  lastUpdated?: string | null | undefined; // ISO format: YYYY-MM-DD
  lastAdded?: string | null | undefined;   // ISO format: YYYY-MM-DD
  requiresNetwork?: boolean | null | undefined;
  visibleExamples?: number | null | undefined;
}
export interface CategoryEntry {
  id: Category;
  label: string;
  href: string;
  emoji: string;
  description: string;
  color: string;
}

export interface ToolContent {
  detailedDescription?: string;
  howTo?: string[];
  faq?: { question: string; answer: string }[];
  useCases?: string[];
  /** 
   * Examples are mandatory for SEO and AdSense compliance.
   * Provide 2-3 practical real-world scenarios.
   */
  examples?: { label?: string; input: string; output: string; description?: string }[];
  commonErrors?: { error: string; fix: string }[];
  alternatives?: string[];
}
