"use client";

import { 
  Calculator, FileText, Image as ImageIcon, ShieldCheck, Code, Wrench, Search,
  CheckCircle2, Lock, Zap, Smartphone, Landmark, TrendingUp, Calendar, 
  Coins, Tag, Clock, Hash, Percent, Layers, Gauge, Briefcase, FileArchive, 
  Combine, Scissors, FileImage, FileType, Key, Droplet, Hash as HashIcon, 
  RefreshCw, Crop, Users, Wand2, Braces, Table, Terminal, FileCode, GitCompare, 
  QrCode, Copy, Type, SpellCheck, CheckSquare, FileEdit, Link2, FileCheck, 
  Globe, Layout, FileSearch, Trash2, Binary, Fingerprint, LayoutTemplate
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, any> = {
  calculators: Calculator,
  pdf: FileText,
  image: ImageIcon,
  security: ShieldCheck,
  developer: Code,
  utilities: Wrench,
  seo: Search,
};

export const TOOL_ICONS: Record<string, any> = {
  // Calculators
  "emi-calculator": Landmark,
  "sip-calculator": TrendingUp,
  "age-calculator": Calendar,
  "compound-interest": Coins,
  "gst-calculator": Tag,
  "currency-converter": RefreshCw,
  "discount-calculator": Tag,
  "world-clock": Globe,
  "date-calculator": Calendar,
  "time-calculator": Clock,
  "standard-calculator": Calculator,
  "salary-calculator": Briefcase,
  "percentage-calculator": Percent,
  "unit-converter": Layers,
  "numeral-converter": HashIcon,
  "smart-converter": Wand2,
  "safe-to-spend": Gauge,
  "work-hours": Clock,
  "utc-ist-converter": Globe,

  // PDF Tools
  "compress-pdf": FileArchive,
  "merge-pdf": Combine,
  "split-pdf": Scissors,
  "image-to-pdf": FileImage,
  "pdf-to-word": FileType,
  "lock-unlock": Lock,
  "watermark-pdf": Droplet,
  "page-numbering": Hash,
  "rotate-pdf": RefreshCw,
  "extract-images": ImageIcon,

  // Image Tools
  "image-compress": FileArchive,
  "image-converter": RefreshCw,
  "image-resizer": Layers,
  "image-crop": Crop,
  "bulk-resizer": Users,
  "bg-remover": Wand2,
  "image-base64": Binary,

  // Developer Tools
  "json-formatter": Braces,
  "json-csv": Table,
  "regex-tester": Terminal,
  "code-minifier": FileCode,
  "diff-checker": GitCompare,
  "format": Code,
  "html-viewer": LayoutTemplate,

  // Security Tools
  "base64": Binary,
  "password-generator": Key,
  "hash-generator": Fingerprint,
  "url-encoder": Link2,
  "html-entities": Code,
  "jwt-decoder": ShieldCheck,

  // Utilities
  "qrcode": QrCode,
  "split-copy": Copy,
  "text-utility": Type,
  "grammar-checker": SpellCheck,
  "task-reminder": CheckSquare,
  "markdown": FileEdit,
  "url-cleaner": Trash2,
  "validate": FileCheck,

  // SEO Tools
  "meta-tags": Layout,
  "og-preview": ImageIcon,
  "sitemap-generator": Layout,
  "robots-txt": FileSearch,
  "image-seo": Search,
  "slug-generator": Link2,
  "seo-title": Type,
};

export const TRUST_INDICATORS = [
  { icon: Lock, label: "No Uploads" },
  { icon: CheckCircle2, label: "Runs Locally" },
  { icon: Zap, label: "Free Forever" },
  { icon: Smartphone, label: "Mobile Optimized" },
];

import { memo } from "react";

export const ToolIcon = memo(function ToolIcon({ category, toolId, className = "w-5 h-5" }: { category?: string; toolId?: string; className?: string }) {
  const Icon = (toolId && TOOL_ICONS[toolId]) || (category && CATEGORIES_FALLBACK[category]) || Wrench;
  return <Icon className={className} aria-hidden="true" />;
});

const CATEGORIES_FALLBACK: Record<string, any> = {
  calculators: Calculator,
  pdf: FileText,
  image: ImageIcon,
  security: ShieldCheck,
  developer: Code,
  utilities: Wrench,
  seo: Search,
};
