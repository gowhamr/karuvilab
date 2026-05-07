"use client";

import { 
  Calculator, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Code, 
  Wrench, 
  Search,
  CheckCircle2,
  Lock,
  Zap,
  Smartphone
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

export const TRUST_INDICATORS = [
  { icon: Lock, label: "No Uploads" },
  { icon: CheckCircle2, label: "Runs Locally" },
  { icon: Zap, label: "Free Forever" },
  { icon: Smartphone, label: "Mobile Optimized" },
];

export function ToolIcon({ category, className = "w-5 h-5" }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] || Wrench;
  return <Icon className={className} />;
}
