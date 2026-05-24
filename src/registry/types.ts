export type Category = 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'seo' | 'productivity';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type DataType = 'image' | 'pdf' | 'text' | 'json' | 'csv' | 'zip' | 'any-file' | 'none' | 'html' | 'url' | 'password';

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
  input?: DataType | DataType[];
  output?: DataType | DataType[];
  
  // Discovery & SEO
  keywords: string[];
  searchIntent?: string; // e.g., "transactional", "informational"
  canonicalUrl?: string;
  priority?: number; // 0 to 1 for sitemap (e.g., 0.8)
  
  // UI & UX
  icon?: string; // Emoji or SVG path
  color?: string; // Brand color for the tool
  featured?: boolean;
  popular?: boolean;
  difficulty?: Difficulty;
  
  // Semantic Intelligence
  related?: string[]; // Array of tool IDs
  
  // Content Engine
  seoContent?: SEOContent;
  schemaType?: 'SoftwareApplication' | 'WebApplication';
  
  // Custom grouping
  subCategory?: string;
  
  // Analytics & Management
  analyticsId?: string;
  status?: 'stable' | 'beta' | 'deprecated' | 'new';
  lastUpdated?: string; // ISO format: YYYY-MM-DD
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
  examples?: { label?: string; input: string; output: string; description?: string }[];
  commonErrors?: { error: string; fix: string }[];
  alternatives?: string[];
}
