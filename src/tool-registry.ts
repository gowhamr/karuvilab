/* ===== tool-registry.ts — KaruviLab Core Engine =====
 *
 * The single source of truth for the KaruviLab platform.
 * Defines metadata, SEO, UI hints, and relationships for every tool.
 */

export type Category = 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'seo';

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
}

export interface CategoryEntry {
  id: Category;
  label: string;
  href: string;
  emoji: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryEntry[] = [
  { id: 'calculators', label: 'Calculators',     href: 'calculators/',     emoji: '', description: 'Precision tools for financial, date, and mathematical calculations.', color: '#4F46E5' },
  { id: 'pdf',         label: 'PDF Tools',       href: 'pdf-tools/',       emoji: '', description: 'Fast, browser-side PDF merging, compression, and conversion.', color: '#EF4444' },
  { id: 'image',       label: 'Image Tools',     href: 'image-tools/',     emoji: '', description: 'Optimize, convert, and resize images without uploading them.', color: '#F43F5E' },
  { id: 'security',    label: 'Security',        href: 'security-tools/',  emoji: '', description: 'Private password generators, encoders, and hash utilities.', color: '#F59E0B' },
  { id: 'developer',   label: 'Developer Tools', href: 'developer-tools/', emoji: '', description: 'Essential utilities for formatting, minifying, and debugging code.', color: '#6366F1' },
  { id: 'utilities',   label: 'Daily Utilities', href: 'utilities/',       emoji: '', description: 'Lightweight helpers for text, reminders, and daily productivity.', color: '#64748B' },
  { id: 'seo',         label: 'SEO Tools',       href: 'seo-tools/',       emoji: '', description: 'Analyze and generate meta tags, sitemaps, and robots.txt files.', color: '#06B6D4' },
];

export const SUBCATEGORY_COLORS: Record<string, string> = {
  'Financial': '#10B981',      // Green
  'Date & Time': '#A855F7',    // Purple
  'Math & Units': '#3B82F6',   // Blue
};

export function getToolColor(tool: ToolEntry): string {
  if (tool.color) return tool.color;
  const subCatColor = tool.subCategory ? SUBCATEGORY_COLORS[tool.subCategory] : undefined;
  if (subCatColor) return subCatColor;
  return CATEGORIES.find(c => c.id === tool.category)?.color || '#4F46E5';
}

export const ALL_TOOLS: ToolEntry[] = [
  // ── Calculators ────────────────────────────────────────────────────────────
  { 
    id: 'emi-calculator', 
    name: 'EMI Calculator', 
    desc: 'Loan EMI, interest, and amortization', 
    href: 'calculators/emi-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['emi','loan','interest','mortgage','amortization'], 
    popular: true, 
    featured: true,
    difficulty: 'beginner',
    searchIntent: 'transactional',
    priority: 0.9,
    icon: '',
    color: '#4F46E5',
    related: ['sip-calculator', 'salary-calculator', 'compound-interest'],
    status: 'stable',
    schemaType: 'WebApplication'
  },
  { 
    id: 'sip-calculator', 
    name: 'SIP Calculator', 
    desc: 'Project mutual-fund SIP returns', 
    href: 'calculators/sip-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['sip','investment','mutual fund','returns'], 
    popular: true, 
    difficulty: 'beginner',
    searchIntent: 'transactional',
    priority: 0.8,
    icon: '',
    related: ['compound-interest', 'emi-calculator'],
    status: 'stable'
  },
  { 
    id: 'age-calculator', 
    name: 'Age Calculator', 
    desc: 'Calculate age in years, months, and days', 
    href: 'calculators/age-calculator/', 
    category: 'calculators', 
    subCategory: 'Date & Time',
    keywords: ['age','birthday','years'], 
    difficulty: 'beginner',
    searchIntent: 'informational',
    priority: 0.7,
    icon: '',
    related: ['date-calculator', 'time-calculator'],
    status: 'stable'
  },
  { id: 'compound-interest',      name: 'Compound Interest',      desc: 'Compounded growth over time',                    href: 'calculators/compound-interest/',      category: 'calculators', subCategory: 'Financial', keywords: ['compound','interest','savings','growth'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'gst-calculator',         name: 'GST Calculator',         desc: 'Add or remove GST from any amount',              href: 'calculators/gst-calculator/',         category: 'calculators', subCategory: 'Financial', keywords: ['gst','tax','vat','india'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'currency-converter',     name: 'Currency Converter',     desc: 'Convert between world currencies',               href: 'calculators/currency-converter/',     category: 'calculators', subCategory: 'Math & Units', keywords: ['currency','exchange','forex','usd','eur','inr'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'discount-calculator',    name: 'Discount Calculator',    desc: 'Find sale price and savings',                    href: 'calculators/discount-calculator/',    category: 'calculators', subCategory: 'Financial', keywords: ['discount','sale','percent','savings'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'world-clock',            name: 'World Clock',            desc: 'Time across multiple cities',                    href: 'calculators/world-clock/',            category: 'calculators', subCategory: 'Date & Time', keywords: ['time','timezone','clock','utc'], searchIntent: 'informational', schemaType: 'WebApplication' },
  { id: 'date-calculator',        name: 'Date Calculator',        desc: 'Add, subtract, or diff dates',                   href: 'calculators/date-calculator/',        category: 'calculators', subCategory: 'Date & Time', keywords: ['date','days','difference','add'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'time-calculator',        name: 'Time Calculator',        desc: 'Add or subtract hours and minutes',              href: 'calculators/time-calculator/',        category: 'calculators', subCategory: 'Date & Time', keywords: ['time','duration','hours','minutes'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'standard-calculator',    name: 'Standard Calculator',    desc: 'Quick arithmetic calculator',                    href: 'calculators/standard-calculator/',    category: 'calculators', subCategory: 'Math & Units', keywords: ['calculator','math','arithmetic'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'salary-calculator',      name: 'Salary Calculator',      desc: 'Indian take-home salary breakdown',              href: 'calculators/salary-calculator/',      category: 'calculators', subCategory: 'Financial', keywords: ['salary','ctc','take home','tax','india'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'percentage-calculator',  name: 'Percentage Calculator',  desc: 'Find percentages and ratios',                    href: 'calculators/percentage-calculator/',  category: 'calculators', subCategory: 'Math & Units', keywords: ['percent','percentage','ratio'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'unit-converter',         name: 'Unit Converter',         desc: 'Length, weight, volume, and more',               href: 'calculators/unit-converter/',         category: 'calculators', subCategory: 'Math & Units', keywords: ['unit','convert','length','weight','volume','metric'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'numeral-converter',      name: 'Numeral Converter',      desc: 'Convert numbers between bases',                  href: 'calculators/numeral-converter/',      category: 'calculators', subCategory: 'Math & Units', keywords: ['numeral','binary','hex','decimal','base'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'smart-converter',        name: 'Smart Unit Converter',   desc: 'Natural-language unit conversion',               href: 'calculators/smart-converter/',        category: 'calculators', subCategory: 'Math & Units', keywords: ['convert','smart','natural language'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'safe-to-spend',          name: 'Safe-to-Spend',          desc: 'Daily budget planner',                           href: 'calculators/safe-to-spend/',          category: 'calculators', subCategory: 'Financial', keywords: ['budget','spending','daily'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'work-hours',             name: 'Work Hours',             desc: 'Timesheet and overtime tracker',                 href: 'calculators/work-hours/',             category: 'calculators', subCategory: 'Date & Time', keywords: ['work','hours','timesheet','overtime'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { id: 'utc-ist-converter',      name: 'UTC ↔ IST',         desc: 'Convert between UTC and IST',                    href: 'calculators/utc-ist-converter/',      category: 'calculators', subCategory: 'Date & Time', keywords: ['utc','ist','timezone','india'], searchIntent: 'transactional', schemaType: 'WebApplication' },
  { 
    id: 'mutual-fund-returns', 
    name: 'Mutual Fund Returns', 
    desc: 'Calculate absolute and annualized returns', 
    href: 'calculators/mutual-fund-returns/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['mutual fund','returns','absolute','annualized','yield'], 
    difficulty: 'intermediate',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'lumpsum-calculator', 
    name: 'Lumpsum Calculator', 
    desc: 'Future value of one-time investment', 
    href: 'calculators/lumpsum-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['lumpsum','investment','future value','wealth'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'ppf-calculator', 
    name: 'PPF Calculator', 
    desc: 'Public Provident Fund maturity & interest', 
    href: 'calculators/ppf-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['ppf','savings','tax saving','interest','maturity'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'fd-calculator', 
    name: 'Fixed Deposit (FD)', 
    desc: 'FD maturity amount and interest earned', 
    href: 'calculators/fd-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['fd','fixed deposit','interest','savings'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'rd-calculator', 
    name: 'Recurring Deposit (RD)', 
    desc: 'RD maturity and interest calculation', 
    href: 'calculators/rd-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['rd','recurring deposit','savings','interest'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'cagr-calculator', 
    name: 'CAGR Calculator', 
    desc: 'Compound Annual Growth Rate', 
    href: 'calculators/cagr-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['cagr','growth','return','annualized'], 
    difficulty: 'intermediate',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'stock-average-calculator', 
    name: 'Stock Average', 
    desc: 'Weighted average buy price for stocks', 
    href: 'calculators/stock-average-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['stock','average','buy price','trading','investing'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'retirement-calculator', 
    name: 'Retirement Planner', 
    desc: 'Corpus needed for your retirement', 
    href: 'calculators/retirement-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['retirement','planning','pension','corpus','savings'], 
    difficulty: 'intermediate',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'swp-calculator', 
    name: 'SWP Calculator', 
    desc: 'Systematic Withdrawal Plan planning', 
    href: 'calculators/swp-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['swp','withdrawal','pension','mutual fund','income'], 
    difficulty: 'intermediate',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'inflation-calculator', 
    name: 'Inflation Calculator', 
    desc: 'Purchasing power over time', 
    href: 'calculators/inflation-calculator/', 
    category: 'calculators', 
    subCategory: 'Financial',
    keywords: ['inflation','purchasing power','money','value'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication'
  },
  { 
    id: 'data-calculator', 
    name: 'Data Calculator', 
    desc: 'Units, transfer time, cost, & hashes', 
    href: 'calculators/data-calculator/', 
    category: 'calculators', 
    subCategory: 'Math & Units',
    keywords: ['data','units','converter','bandwidth','checksum','md5','sha256'], 
    difficulty: 'beginner',
    status: 'new',
    searchIntent: 'transactional',
    schemaType: 'WebApplication',
    featured: true,
    popular: true,
    related: ['unit-converter', 'json-formatter', 'qrcode']
  },
  { 
    id: 'file-viewer-diff', 
    name: 'File Viewer & Diff', 
    desc: 'Local text editor and diff checker', 
    href: 'file-tools/file-viewer-diff/', 
    category: 'developer', 
    input: ['any-file', 'text'],
    output: ['any-file', 'text'],
    keywords: ['file viewer','diff','compare','editor','source code'], 
    featured: true,
    popular: true,
    difficulty: 'intermediate',
    status: 'new',
    schemaType: 'SoftwareApplication'
  },


  // ── PDF Tools ──────────────────────────────────────────────────────────────
  { id: 'compress-pdf',     name: 'Compress PDF',     desc: 'Reduce PDF file size',                href: 'pdf-tools/compress-pdf/',   category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','compress','reduce','size'], popular: true, priority: 0.8 },
  { id: 'merge-pdf',        name: 'Merge PDF',        desc: 'Combine multiple PDFs into one',      href: 'pdf-tools/merge-pdf/',      category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','merge','combine','join'], popular: true, priority: 0.8 },
  { id: 'split-pdf',        name: 'Split PDF',        desc: 'Extract pages from a PDF',            href: 'pdf-tools/split-pdf/',      category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','split','extract','pages'] },
  { id: 'image-to-pdf',     name: 'Image to PDF',     desc: 'Convert images into a single PDF',    href: 'pdf-tools/image-to-pdf/',   category: 'pdf', input: 'image', output: 'pdf', keywords: ['image','jpg','png','pdf','convert'] },
  { id: 'pdf-to-word',      name: 'PDF to Word',      desc: 'Convert PDF text to editable Word',   href: 'pdf-tools/pdf-to-word/',    category: 'pdf', input: 'pdf', output: 'text', keywords: ['pdf','word','docx','convert'], popular: true },
  { id: 'lock-unlock-pdf',  name: 'Lock / Unlock PDF',desc: 'Add or remove PDF passwords',         href: 'pdf-tools/lock-unlock/',    category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','password','lock','unlock','encrypt'] },
  { id: 'watermark-pdf',    name: 'Watermark PDF',    desc: 'Add text or image watermark',         href: 'pdf-tools/watermark-pdf/',  category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','watermark','stamp'] },
  { id: 'page-numbering',   name: 'Page Numbering',   desc: 'Add page numbers to PDF',             href: 'pdf-tools/page-numbering/', category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','page','number'] },
  { id: 'rotate-pdf',       name: 'Rotate PDF',       desc: 'Rotate one or all pages',             href: 'pdf-tools/rotate-pdf/',     category: 'pdf', input: 'pdf', output: 'pdf', keywords: ['pdf','rotate','flip','orientation'] },
  { id: 'extract-images',   name: 'Extract Images',   desc: 'Pull images out of a PDF',            href: 'pdf-tools/extract-images/', category: 'pdf', input: 'pdf', output: 'image', keywords: ['pdf','extract','image'] },

  // ── Image Tools ────────────────────────────────────────────────────────────
  { id: 'image-compress',  name: 'Compress Image',     desc: 'Reduce image file size',                 href: 'image-tools/image-compressor/',           category: 'image', input: 'image', output: 'image', keywords: ['image','compress','jpg','png','webp'], popular: true, priority: 0.8, difficulty: 'advanced' },
  { id: 'image-converter', name: 'Image Converter',    desc: 'Convert between JPG, PNG, WebP, AVIF',   href: 'image-tools/image-converter/',    category: 'image', input: 'image', output: 'image', keywords: ['image','convert','jpg','png','webp','avif'] },
  { id: 'image-resizer',   name: 'Image Resizer',      desc: 'Resize images to exact dimensions',      href: 'image-tools/image-resizer/',      category: 'image', input: 'image', output: 'image', keywords: ['image','resize','dimensions'] },
  { id: 'image-crop',      name: 'Image Crop',         desc: 'Crop images to ratio or freeform',       href: 'image-tools/image-crop/',         category: 'image', input: 'image', output: 'image', keywords: ['image','crop','trim'] },
  { id: 'bulk-resizer',    name: 'Bulk Image Resize',  desc: 'Resize many images at once',             href: 'image-tools/bulk-resizer/', category: 'image', input: 'image', output: 'image', keywords: ['image','bulk','batch','resize'] },
  { id: 'bg-remover',      name: 'Background Remover', desc: 'Remove image backgrounds locally',       href: 'image-tools/bg-remover/',   category: 'image', input: 'image', output: 'image', keywords: ['image','background','remove','transparent'], popular: true },
  { id: 'image-base64',    name: 'Image to Base64',    desc: 'Encode images as Base64 data URIs',      href: 'image-tools/image-base64/',       category: 'image', input: 'image', output: 'text', keywords: ['image','base64','data uri'] },

  // ── Developer Tools ────────────────────────────────────────────────────────
  { 
    id: 'json-formatter', 
    name: 'JSON Formatter', 
    desc: 'Format and validate JSON', 
    href: 'developer-tools/json-formatter/', 
    category: 'developer', 
    input: 'json',
    output: 'json',
    keywords: ['json','format','pretty','validate'], 
    popular: true, 
    difficulty: 'beginner',
    searchIntent: 'informational',
    priority: 0.9,
    icon: '',
    related: ['json-csv', 'base64', 'format'],
    status: 'stable',
    schemaType: 'SoftwareApplication'
  },
  { 
    id: 'json-csv', 
    name: 'JSON ↔ CSV', 
    desc: 'Convert between JSON and CSV', 
    href: 'developer-tools/json-csv/', 
    category: 'developer', 
    keywords: ['json','csv','convert'], 
    difficulty: 'intermediate',
    searchIntent: 'transactional',
    priority: 0.8,
    icon: '',
    related: ['json-formatter', 'unit-converter'],
    status: 'stable'
  },
  { id: 'regex-tester',   name: 'Regex Tester',    desc: 'Test regular expressions live',     href: 'developer-tools/regex/',          category: 'developer', keywords: ['regex','regexp','match','pattern'], popular: true },
  { id: 'code-minifier',  name: 'Code Minifier',   desc: 'Minify CSS, JS, and HTML',          href: 'developer-tools/code-minifier/',  category: 'developer', keywords: ['minify','css','js','html'] },
  { id: 'diff-checker',   name: 'Diff Checker',    desc: 'Compare two text snippets',         href: 'developer-tools/diff-checker/',   category: 'developer', keywords: ['diff','compare','text'] },
  { id: 'format',         name: 'Code Formatter',  desc: 'Auto-format code in many languages',href: 'developer-tools/format/',         category: 'developer', keywords: ['format','prettier','code'] },
  { 
    id: 'html-viewer',    
    name: 'HTML Online Viewer', 
    desc: 'Professional live HTML/CSS/JS editor and sandboxed preview', 
    href: 'developer-tools/html-viewer/', 
    category: 'developer', 
    keywords: ['html','viewer','editor','codepen','playground','javascript','css'], 
    popular: true, 
    difficulty: 'intermediate',
    searchIntent: 'transactional',
    priority: 0.95,
    related: ['code-minifier', 'format', 'json-formatter'],
    status: 'new'
  },

  // ── Security & Encoding ───────────────────────────────────────────────────
  { 
    id: 'base64', 
    name: 'Base64 Encode/Decode', 
    desc: 'Encode or decode Base64 strings', 
    href: 'security-tools/base64/', 
    category: 'security', 
    keywords: ['base64','encode','decode'], 
    difficulty: 'beginner',
    searchIntent: 'transactional',
    priority: 0.8,
    icon: '',
    related: ['url-encoder', 'hash-generator', 'jwt-decoder'],
    status: 'stable'
  },
  { 
    id: 'password-generator', 
    name: 'Password Generator', 
    desc: 'Strong, random passwords', 
    href: 'security-tools/password-generator/', 
    category: 'security', 
    keywords: ['password','random','strong','generator'], 
    popular: true, 
    difficulty: 'beginner',
    searchIntent: 'transactional',
    priority: 0.9,
    icon: '',
    related: ['hash-generator', 'base64'],
    status: 'stable'
  },
  { id: 'hash-generator',     name: 'Hash Generator',       desc: 'MD5, SHA-1/256/512 hashes',           href: 'security-tools/hash-generator/',     category: 'security', keywords: ['hash','md5','sha','checksum'], popular: true, priority: 0.8 },
  { id: 'url-encoder',        name: 'URL Encoder',          desc: 'Percent-encode and decode URLs',      href: 'security-tools/url-encoder/',        category: 'security', keywords: ['url','encode','decode','percent'] },
  { id: 'html-entities',      name: 'HTML Entities',        desc: 'Convert characters to HTML entities', href: 'security-tools/html-entities/',      category: 'security', keywords: ['html','entities','escape'] },
  { id: 'jwt-decoder',        name: 'JWT Decoder',          desc: 'Inspect JSON Web Tokens',             href: 'security-tools/jwt-decoder/',        category: 'security', keywords: ['jwt','token','json','decode'] },

  // ── Daily Utilities ────────────────────────────────────────────────────────
  { id: 'qrcode',         name: 'QR Code Generator', desc: 'Make QR codes for URLs, text, Wi-Fi', href: 'utilities/qrcode/',          category: 'utilities', keywords: ['qr','qrcode','barcode'], popular: true },
  { id: 'split-copy',     name: 'Split & Copy',      desc: 'Break long text into chunks',         href: 'utilities/split-copy/',      category: 'utilities', keywords: ['split','copy','text','chunks'] },
  { id: 'text-utility',   name: 'Text Utility',      desc: 'Clean, case convert, count words',    href: 'utilities/text-utility/',    category: 'utilities', keywords: ['text','case','word count','clean'] },
  { id: 'grammar-checker',name: 'Grammar Checker',   desc: 'Spot common writing errors',          href: 'utilities/grammar-checker/', category: 'utilities', keywords: ['grammar','spelling','writing'] },
  { id: 'task-reminder',  name: 'Task Reminder',     desc: 'Lightweight private to-do list',      href: 'utilities/task-reminder/',   category: 'utilities', keywords: ['task','todo','reminder','list'] },
  { id: 'markdown',       name: 'Markdown Editor',   desc: 'Live preview Markdown editor',        href: 'utilities/markdown/',        category: 'utilities', keywords: ['markdown','md','editor','preview'] },
  { id: 'url-cleaner',    name: 'URL Cleaner',       desc: 'Strip tracking parameters',           href: 'utilities/url-cleaner/',     category: 'utilities', keywords: ['url','clean','tracking','utm'] },
  { id: 'validate',       name: 'File Validator',    desc: 'Validate file size and type',         href: 'utilities/validate/',        category: 'utilities', keywords: ['validate','file','size','type'] },
  { id: 'internet-speed-test', name: 'Speed Tester', desc: 'Measure your internet connection speed', href: 'utilities/internet-speed-test/', category: 'utilities', keywords: ['speed','test','internet','wifi','ping','latency'], status: 'new' },

  // ── SEO Tools ──────────────────────────────────────────────────────────────
  { id: 'meta-tags',         name: 'Meta Tags Generator', desc: 'Build SEO meta tags',           href: 'seo-tools/meta-tags/',         category: 'seo', keywords: ['seo','meta','tags','head'], popular: true },
  { id: 'og-preview',        name: 'OG Preview',          desc: 'Preview Open Graph cards',      href: 'seo-tools/og-preview/',        category: 'seo', keywords: ['og','open graph','preview','social'] },
  { id: 'sitemap-generator', name: 'Sitemap Generator',   desc: 'Build XML sitemaps',            href: 'seo-tools/sitemap-generator/', category: 'seo', keywords: ['sitemap','xml','seo'] },
  { id: 'robots-txt',        name: 'robots.txt Builder',  desc: 'Create robots.txt files',       href: 'seo-tools/robots-txt/',        category: 'seo', keywords: ['robots','txt','crawl','seo'] },
  { id: 'image-seo',         name: 'Image SEO',           desc: 'Generate alt text and filenames',href: 'seo-tools/image-seo/',        category: 'seo', keywords: ['image','seo','alt','filename'] },
  { id: 'slug-generator',    name: 'Slug Generator',      desc: 'URL-safe slugs from text',      href: 'seo-tools/slug-generator/',    category: 'seo', keywords: ['slug','url','permalink','seo'] },
  { id: 'seo-title',         name: 'SEO Title Tester',    desc: 'Score SEO title tags',          href: 'seo-tools/seo-title/',         category: 'seo', keywords: ['seo','title','tag','score'] },
];

export const RECENT_PATH_KEY = 'karuvi.recent.paths';

export function findToolById(id: string): ToolEntry | undefined {
  return ALL_TOOLS.find(t => t.id === id);
}

export function findToolByPath(pathname: string): ToolEntry | undefined {
  const norm = pathname.replace(/^\/+/, '').replace(/index\.html$/, '').replace(/\/+$/, '');
  return ALL_TOOLS.find(t => {
    const h = t.href.replace(/\/+$/, '');
    return norm === h || norm.endsWith('/' + h);
  });
}

export function getRecentTools(): ToolEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_PATH_KEY);
    if (!raw) return [];
    const paths = JSON.parse(raw);
    if (!Array.isArray(paths)) return [];
    const seen = new Set<string>();
    const out: ToolEntry[] = [];
    for (const p of paths) {
      if (typeof p !== 'string') continue;
      const t = findToolByPath(p);
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        out.push(t);
      }
    }
    return out;
  } catch {
    return [];
  }
}
