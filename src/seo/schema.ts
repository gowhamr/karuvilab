// src/seo/schema.ts
import { getCanonicalUrl } from "./canonical";

const BASE_URL = "https://karuvilab.com";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Generates BreadcrumbList structured data.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": getCanonicalUrl(item.path),
    })),
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generates FAQPage structured data.
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export interface ToolSchemaProps {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  lastUpdated?: string;
  features?: string[];
  schemaType?: "WebApplication" | "SoftwareApplication";
}

/**
 * Generates WebApplication / SoftwareApplication structured data for a tool.
 */
export function generateToolSchema({
  name,
  description,
  category,
  path,
  lastUpdated,
  features = [],
  schemaType = "WebApplication",
}: ToolSchemaProps) {
  const canonicalUrl = getCanonicalUrl(path);
  
  const getApplicationCategory = (cat: string) => {
    switch (cat) {
      case "calculators": return "FinanceApplication";
      case "developer":   return "DeveloperApplication";
      case "seo":         return "BusinessApplication";
      case "security":
      case "pdf":
      case "image":
      case "utilities":   return "UtilitiesApplication";
      default:            return "UtilitiesApplication";
    }
  };

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": name,
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": getApplicationCategory(category),
    "operatingSystem": "Any",
    "softwareVersion": "1.0.0",
    "datePublished": "2026-05-01T00:00:00Z",
    "dateModified": lastUpdated ? new Date(lastUpdated).toISOString() : new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "author": {
      "@type": "Organization",
      "name": "KaruviLab",
    },
    "image": `${BASE_URL}/icons/icon-512.png`,
    ...(features.length > 0 ? { "featureList": features } : {}),
  };
}

/**
 * Generates Website and Organization structured data for the homepage.
 */
export function generateSiteSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "KaruviLab",
      "url": `${BASE_URL}/`,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "KaruviLab",
      "url": `${BASE_URL}/`,
      "logo": `${BASE_URL}/icons/icon-512.png`,
      "sameAs": [
        "https://twitter.com/karuvilab",
        "https://github.com/karuvilab"
      ]
    }
  ];
}

/**
 * Generates CollectionPage structured data for category hubs.
 */
export function generateCollectionSchema(categoryLabel: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryLabel} Tools | KaruviLab`,
    "description": description,
    "url": getCanonicalUrl(path),
    "publisher": {
      "@type": "Organization",
      "name": "KaruviLab"
    }
  };
}
