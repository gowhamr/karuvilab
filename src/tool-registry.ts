/* ===== tool-registry.ts — KaruviLab Tool Registry =====
 *
 * Central catalogue of every tool on KaruviLab.
 */

export type Category = 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'seo';

export interface ToolEntry {
  id: string;
  name: string;
  desc: string;
  href: string;
  category: Category;
  keywords: string[];
  popular?: boolean;
  related?: string[]; // Array of tool IDs
}

export interface CategoryEntry {
  id: Category;
  label: string;
  href: string;
  emoji: string;
}

export const CATEGORIES: CategoryEntry[] = [
  { id: 'calculators', label: 'Calculators',     href: 'calculators/',     emoji: '\u{1F9EE}' },
  { id: 'pdf',         label: 'PDF Tools',       href: 'pdf-tools/',       emoji: '\u{1F4C4}' },
  { id: 'image',       label: 'Image Tools',     href: 'image-tools/',     emoji: '\u{1F5BC}\u{FE0F}' },
  { id: 'security',    label: 'Security',        href: 'security-tools/',  emoji: '\u{1F510}' },
  { id: 'developer',   label: 'Developer Tools', href: 'developer-tools/', emoji: '\u{1F4BB}' },
  { id: 'utilities',   label: 'Daily Utilities', href: 'utilities/',       emoji: '\u{1F9F0}' },
  { id: 'seo',         label: 'SEO Tools',       href: 'tools/seo/',       emoji: '\u{1F50D}' },
];

export const TOOLS: ToolEntry[] = [
  // Calculators
  { id: 'emi-calculator',         name: 'EMI Calculator',         desc: 'Loan EMI, interest, and amortization',           href: 'calculators/emi-calculator/',         category: 'calculators', keywords: ['emi','loan','interest','mortgage','amortization'], popular: true, related: ['sip-calculator', 'salary-calculator'] },
  { id: 'sip-calculator',         name: 'SIP Calculator',         desc: 'Project mutual-fund SIP returns',                href: 'calculators/sip-calculator/',         category: 'calculators', keywords: ['sip','investment','mutual fund','returns'], popular: true, related: ['compound-interest', 'emi-calculator'] },
  { id: 'age-calculator',         name: 'Age Calculator',         desc: 'Calculate age in years, months, and days',       href: 'calculators/age-calculator/',         category: 'calculators', keywords: ['age','birthday','years'], related: ['date-calculator', 'time-calculator'] },
  { id: 'compound-interest',      name: 'Compound Interest',      desc: 'Compounded growth over time',                    href: 'calculators/compound-interest/',      category: 'calculators', keywords: ['compound','interest','savings','growth'] },
  { id: 'gst-calculator',         name: 'GST Calculator',         desc: 'Add or remove GST from any amount',              href: 'calculators/gst-calculator/',         category: 'calculators', keywords: ['gst','tax','vat','india'] },
  { id: 'currency-converter',     name: 'Currency Converter',     desc: 'Convert between world currencies',               href: 'calculators/currency-converter/',     category: 'calculators', keywords: ['currency','exchange','forex','usd','eur','inr'] },
  { id: 'discount-calculator',    name: 'Discount Calculator',    desc: 'Find sale price and savings',                    href: 'calculators/discount-calculator/',    category: 'calculators', keywords: ['discount','sale','percent','savings'] },
  { id: 'world-clock',            name: 'World Clock',            desc: 'Time across multiple cities',                    href: 'calculators/world-clock/',            category: 'calculators', keywords: ['time','timezone','clock','utc'] },
  { id: 'date-calculator',        name: 'Date Calculator',        desc: 'Add, subtract, or diff dates',                   href: 'calculators/date-calculator/',        category: 'calculators', keywords: ['date','days','difference','add'] },
  { id: 'time-calculator',        name: 'Time Calculator',        desc: 'Add or subtract hours and minutes',              href: 'calculators/time-calculator/',        category: 'calculators', keywords: ['time','duration','hours','minutes'] },
  { id: 'standard-calculator',    name: 'Standard Calculator',    desc: 'Quick arithmetic calculator',                    href: 'calculators/standard-calculator/',    category: 'calculators', keywords: ['calculator','math','arithmetic'] },
  { id: 'salary-calculator',      name: 'Salary Calculator',      desc: 'Indian take-home salary breakdown',              href: 'calculators/salary-calculator/',      category: 'calculators', keywords: ['salary','ctc','take home','tax','india'] },
  { id: 'percentage-calculator',  name: 'Percentage Calculator',  desc: 'Find percentages and ratios',                    href: 'calculators/percentage-calculator/',  category: 'calculators', keywords: ['percent','percentage','ratio'] },
  { id: 'unit-converter',         name: 'Unit Converter',         desc: 'Length, weight, volume, and more',               href: 'calculators/unit-converter/',         category: 'calculators', keywords: ['unit','convert','length','weight','volume','metric'] },
  { id: 'numeral-converter',      name: 'Numeral Converter',      desc: 'Convert numbers between bases',                  href: 'calculators/numeral-converter/',      category: 'calculators', keywords: ['numeral','binary','hex','decimal','base'] },
  { id: 'smart-converter',        name: 'Smart Unit Converter',   desc: 'Natural-language unit conversion',               href: 'calculators/smart-converter/',        category: 'calculators', keywords: ['convert','smart','natural language'] },
  { id: 'safe-to-spend',          name: 'Safe-to-Spend',          desc: 'Daily budget planner',                           href: 'calculators/safe-to-spend/',          category: 'calculators', keywords: ['budget','spending','daily'] },
  { id: 'work-hours',             name: 'Work Hours',             desc: 'Timesheet and overtime tracker',                 href: 'calculators/work-hours/',             category: 'calculators', keywords: ['work','hours','timesheet','overtime'] },
  { id: 'utc-ist-converter',      name: 'UTC ↔ IST',         desc: 'Convert between UTC and IST',                    href: 'calculators/utc-ist-converter/',      category: 'calculators', keywords: ['utc','ist','timezone','india'] },

  // PDF
  { id: 'compress-pdf',     name: 'Compress PDF',     desc: 'Reduce PDF file size',                href: 'pdf-tools/compress-pdf/',   category: 'pdf', keywords: ['pdf','compress','reduce','size'], popular: true },
  { id: 'merge-pdf',        name: 'Merge PDF',        desc: 'Combine multiple PDFs into one',      href: 'pdf-tools/merge-pdf/',      category: 'pdf', keywords: ['pdf','merge','combine','join'], popular: true },
  { id: 'split-pdf',        name: 'Split PDF',        desc: 'Extract pages from a PDF',            href: 'pdf-tools/split-pdf/',      category: 'pdf', keywords: ['pdf','split','extract','pages'] },
  { id: 'image-to-pdf',     name: 'Image to PDF',     desc: 'Convert images into a single PDF',    href: 'pdf-tools/image-to-pdf/',   category: 'pdf', keywords: ['image','jpg','png','pdf','convert'] },
  { id: 'pdf-to-word',      name: 'PDF to Word',      desc: 'Convert PDF text to editable Word',   href: 'pdf-tools/pdf-to-word/',    category: 'pdf', keywords: ['pdf','word','docx','convert'], popular: true },
  { id: 'lock-unlock-pdf',  name: 'Lock / Unlock PDF',desc: 'Add or remove PDF passwords',         href: 'pdf-tools/lock-unlock/',    category: 'pdf', keywords: ['pdf','password','lock','unlock','encrypt'] },
  { id: 'watermark-pdf',    name: 'Watermark PDF',    desc: 'Add text or image watermark',         href: 'pdf-tools/watermark-pdf/',  category: 'pdf', keywords: ['pdf','watermark','stamp'] },
  { id: 'page-numbering',   name: 'Page Numbering',   desc: 'Add page numbers to PDF',             href: 'pdf-tools/page-numbering/', category: 'pdf', keywords: ['pdf','page','number'] },
  { id: 'rotate-pdf',       name: 'Rotate PDF',       desc: 'Rotate one or all pages',             href: 'pdf-tools/rotate-pdf/',     category: 'pdf', keywords: ['pdf','rotate','flip','orientation'] },
  { id: 'extract-images',   name: 'Extract Images',   desc: 'Pull images out of a PDF',            href: 'pdf-tools/extract-images/', category: 'pdf', keywords: ['pdf','extract','image'] },

  // Image
  { id: 'image-compress',  name: 'Compress Image',     desc: 'Reduce image file size',                 href: 'tools/compress/',           category: 'image', keywords: ['image','compress','jpg','png','webp'], popular: true },
  { id: 'image-converter', name: 'Image Converter',    desc: 'Convert between JPG, PNG, WebP, AVIF',   href: 'tools/image-converter/',    category: 'image', keywords: ['image','convert','jpg','png','webp','avif'] },
  { id: 'image-resizer',   name: 'Image Resizer',      desc: 'Resize images to exact dimensions',      href: 'tools/image-resizer/',      category: 'image', keywords: ['image','resize','dimensions'] },
  { id: 'image-crop',      name: 'Image Crop',         desc: 'Crop images to ratio or freeform',       href: 'tools/image-crop/',         category: 'image', keywords: ['image','crop','trim'] },
  { id: 'bulk-resizer',    name: 'Bulk Image Resize',  desc: 'Resize many images at once',             href: 'image-tools/bulk-resizer/', category: 'image', keywords: ['image','bulk','batch','resize'] },
  { id: 'bg-remover',      name: 'Background Remover', desc: 'Remove image backgrounds locally',       href: 'image-tools/bg-remover/',   category: 'image', keywords: ['image','background','remove','transparent'], popular: true },
  { id: 'image-base64',    name: 'Image to Base64',    desc: 'Encode images as Base64 data URIs',      href: 'tools/image-base64/',       category: 'image', keywords: ['image','base64','data uri'] },

  // Security & Encoding
  { id: 'hash-generator',     name: 'Hash Generator',       desc: 'MD5, SHA-1/256/512 hashes',           href: 'tools/hash-generator/',     category: 'security', keywords: ['hash','md5','sha','checksum'], popular: true },
  { id: 'password-generator', name: 'Password Generator',   desc: 'Strong, random passwords',            href: 'tools/password-generator/', category: 'security', keywords: ['password','random','strong','generator'], popular: true },
  { id: 'base64',             name: 'Base64 Encode/Decode', desc: 'Encode or decode Base64 strings',     href: 'tools/base64/',             category: 'security', keywords: ['base64','encode','decode'], related: ['url-encoder', 'hash-generator', 'jwt-decoder'] },
  { id: 'url-encoder',        name: 'URL Encoder',          desc: 'Percent-encode and decode URLs',      href: 'tools/url-encoder/',        category: 'security', keywords: ['url','encode','decode','percent'], related: ['base64', 'url-cleaner'] },
  { id: 'html-entities',      name: 'HTML Entities',        desc: 'Convert characters to HTML entities', href: 'tools/html-entities/',      category: 'security', keywords: ['html','entities','escape'] },
  { id: 'jwt-decoder',        name: 'JWT Decoder',          desc: 'Inspect JSON Web Tokens',             href: 'tools/jwt-decoder/',        category: 'security', keywords: ['jwt','token','json','decode'] },

  // Developer
  { id: 'json-formatter', name: 'JSON Formatter',  desc: 'Format and validate JSON',          href: 'tools/json-formatter/', category: 'developer', keywords: ['json','format','pretty','validate'], popular: true, related: ['json-csv', 'base64', 'format'] },
  { id: 'json-csv',       name: 'JSON ↔ CSV', desc: 'Convert between JSON and CSV',      href: 'tools/json-csv/',       category: 'developer', keywords: ['json','csv','convert'], related: ['json-formatter', 'unit-converter'] },
  { id: 'regex-tester',   name: 'Regex Tester',    desc: 'Test regular expressions live',     href: 'tools/regex/',          category: 'developer', keywords: ['regex','regexp','match','pattern'], popular: true },
  { id: 'code-minifier',  name: 'Code Minifier',   desc: 'Minify CSS, JS, and HTML',          href: 'tools/code-minifier/',  category: 'developer', keywords: ['minify','css','js','html'] },
  { id: 'diff-checker',   name: 'Diff Checker',    desc: 'Compare two text snippets',         href: 'tools/diff-checker/',   category: 'developer', keywords: ['diff','compare','text'] },
  { id: 'format',         name: 'Code Formatter',  desc: 'Auto-format code in many languages',href: 'tools/format/',         category: 'developer', keywords: ['format','prettier','code'] },

  // Utilities
  { id: 'qrcode',         name: 'QR Code Generator', desc: 'Make QR codes for URLs, text, Wi-Fi', href: 'tools/qrcode/',          category: 'utilities', keywords: ['qr','qrcode','barcode'], popular: true },
  { id: 'split-copy',     name: 'Split & Copy',      desc: 'Break long text into chunks',         href: 'tools/split-copy/',      category: 'utilities', keywords: ['split','copy','text','chunks'] },
  { id: 'text-utility',   name: 'Text Utility',      desc: 'Clean, case convert, count words',    href: 'tools/text-utility/',    category: 'utilities', keywords: ['text','case','word count','clean'] },
  { id: 'grammar-checker',name: 'Grammar Checker',   desc: 'Spot common writing errors',          href: 'tools/grammar-checker/', category: 'utilities', keywords: ['grammar','spelling','writing'] },
  { id: 'task-reminder',  name: 'Task Reminder',     desc: 'Lightweight private to-do list',      href: 'tools/task-reminder/',   category: 'utilities', keywords: ['task','todo','reminder','list'] },
  { id: 'markdown',       name: 'Markdown Editor',   desc: 'Live preview Markdown editor',        href: 'tools/markdown/',        category: 'utilities', keywords: ['markdown','md','editor','preview'] },
  { id: 'url-cleaner',    name: 'URL Cleaner',       desc: 'Strip tracking parameters',           href: 'tools/url-cleaner/',     category: 'utilities', keywords: ['url','clean','tracking','utm'] },
  { id: 'validate',       name: 'File Validator',    desc: 'Validate file size and type',         href: 'tools/validate/',        category: 'utilities', keywords: ['validate','file','size','type'] },

  // SEO
  { id: 'meta-tags',         name: 'Meta Tags Generator', desc: 'Build SEO meta tags',           href: 'tools/meta-tags/',         category: 'seo', keywords: ['seo','meta','tags','head'], popular: true },
  { id: 'og-preview',        name: 'OG Preview',          desc: 'Preview Open Graph cards',      href: 'tools/og-preview/',        category: 'seo', keywords: ['og','open graph','preview','social'] },
  { id: 'sitemap-generator', name: 'Sitemap Generator',   desc: 'Build XML sitemaps',            href: 'tools/sitemap-generator/', category: 'seo', keywords: ['sitemap','xml','seo'] },
  { id: 'robots-txt',        name: 'robots.txt Builder',  desc: 'Create robots.txt files',       href: 'tools/robots-txt/',        category: 'seo', keywords: ['robots','txt','crawl','seo'] },
  { id: 'image-seo',         name: 'Image SEO',           desc: 'Generate alt text and filenames',href: 'tools/image-seo/',        category: 'seo', keywords: ['image','seo','alt','filename'] },
  { id: 'slug-generator',    name: 'Slug Generator',      desc: 'URL-safe slugs from text',      href: 'tools/slug-generator/',    category: 'seo', keywords: ['slug','url','permalink','seo'] },
  { id: 'seo-title',         name: 'SEO Title Tester',    desc: 'Score SEO title tags',          href: 'tools/seo-title/',         category: 'seo', keywords: ['seo','title','tag','score'] },
];

export const RECENT_PATH_KEY = 'karuvi.recent.paths';

export function findToolById(id: string): ToolEntry | undefined {
  return TOOLS.find(t => t.id === id);
}

export function findToolByPath(pathname: string): ToolEntry | undefined {
  const norm = pathname.replace(/^\/+/, '').replace(/index\.html$/, '').replace(/\/+$/, '');
  return TOOLS.find(t => {
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
