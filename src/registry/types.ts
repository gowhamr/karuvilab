export type Category = 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'productivity' | 'media';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type DataType = 'image' | 'pdf' | 'text' | 'json' | 'csv' | 'zip' | 'any-file' | 'none' | 'html' | 'url' | 'password' | 'sql';

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
  input?: DataType | DataType[] | null;
  output?: DataType | DataType[] | null;
  
  // Discovery & SEO
  keywords: string[];
  searchIntent?: string | null; // e.g., "transactional", "informational"
  canonicalUrl?: string | null;
  priority?: number | null; // 0 to 1 for sitemap (e.g., 0.8)
  
  // UI & UX
  icon?: string | null; // Emoji or SVG path
  color?: string | null; // Brand color for the tool
  featured?: boolean | null;
  popular?: boolean | null;
  difficulty?: Difficulty | null;
  
  // Semantic Intelligence
  related?: string[] | null; // Array of tool IDs
  
  // Content Engine
  seoContent?: SEOContent | null;
  schemaType?: 'SoftwareApplication' | 'WebApplication' | null;
  sampleAssetKey?: string | null;
  
  // Custom grouping
  subCategory?: string | null;
  
  // Analytics & Management
  analyticsId?: string | null;
  status?: 'stable' | 'beta' | 'deprecated' | 'new' | null;
  lastUpdated?: string | null; // ISO format: YYYY-MM-DD
  lastAdded?: string | null;   // ISO format: YYYY-MM-DD
  requiresNetwork?: boolean | null;
  visibleExamples?: number | null;
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
