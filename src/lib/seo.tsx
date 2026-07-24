import { Metadata } from "next";
import Script from "next/script";
import { ALL_TOOLS, CategoryEntry, ToolEntry } from "@/src/tool-registry";
import type { ToolContent } from "@/src/tool-content";

const BASE_URL = "https://karuvilab.com";

/**
 * Generates SEO metadata for a specific tool.
 */
export function generateToolMetadata(toolId: string): Metadata {
  const tool = ALL_TOOLS.find((t) => t.id === toolId);
  if (!tool) return {};

  const title = `${tool.name} – KV`;
  const description = tool.desc;
  const url = `${BASE_URL}/${tool.href.replace(/^\/+|\/+$/g, "")}/`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/icons/icon-512.png`,
          width: 512,
          height: 512,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/icons/icon-512.png`],
    },
  };
}

interface StructuredDataProps {
  tool?: ToolEntry | undefined;
  category?: CategoryEntry | undefined;
  content?: {
    detailedDescription?: string | undefined;
    faq?: { question: string; answer: string }[] | undefined;
    howTo?: string[] | undefined;
    useCases?: string[] | undefined;
  } | undefined;
  isHead?: boolean;
}

interface BreadcrumbListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

/**
 * Renders JSON-LD structured data for Tools, Breadcrumbs, FAQ, and HowTo.
 */
export function StructuredData({ tool, category, content: propsContent, isHead }: StructuredDataProps): React.JSX.Element {
  const scripts: Record<string, unknown>[] = [];

  // Helper to ensure absolute URLs are perfectly canonical (trailing slash enforced)
  const normalizeUrl = (path: string) => {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const url = `${BASE_URL}/${cleanPath}/`;
    return url.replace(/\/+$/, "/");
  };

  // 1. Breadcrumb List Construction
  const itemListElement: BreadcrumbListItem[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${BASE_URL}/`
    }
  ];

  if (category) {
    itemListElement.push({
      "@type": "ListItem",
      "position": itemListElement.length + 1,
      "name": category.label || "Category",
      "item": normalizeUrl(category.href)
    });
  }

  if (tool) {
    itemListElement.push({
      "@type": "ListItem",
      "position": itemListElement.length + 1,
      "name": tool.name || "Tool",
      "item": normalizeUrl(tool.href)
    });
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  scripts.push(breadcrumbList);

  if (category && !tool) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category.label} Tools | KaruviLab`,
      "description": `Browse our collection of free, private, and offline-first ${category.label.toLowerCase()} tools.`,
      "url": `${BASE_URL}/${category.href.replace(/^\/|\/$/g, "")}/`,
      "publisher": {
        "@type": "Organization",
        "name": "KaruviLab"
      }
    });
  }

  if (!tool && !category) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "KaruviLab",
      "url": BASE_URL,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });

    scripts.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "KaruviLab",
      "url": BASE_URL,
      "logo": `${BASE_URL}/icons/icon-512.png`,
      "sameAs": [
        "https://twitter.com/karuvilab",
        "https://github.com/karuvilab"
      ]
    });
  }

  if (propsContent?.detailedDescription && !tool) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Blog Article",
      "description": propsContent.detailedDescription.substring(0, 160).replace(/<[^>]*>/g, ""),
      "articleBody": propsContent.detailedDescription.replace(/<[^>]*>/g, ""),
      "author": {
        "@type": "Organization",
        "name": "KaruviLab"
      }
    });
  }

  if (tool) {
    const detailedDesc = propsContent?.detailedDescription || tool.desc;
    
    const getApplicationCategory = (catId?: string) => {
      switch (catId) {
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

    const useCases = propsContent?.useCases;

    const toolSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": tool.schemaType || "WebApplication",
      "name": tool.name,
      "description": detailedDesc,
      "url": `${BASE_URL}/${tool.href.replace(/^[\\/]+|[\\/]+$/g, "")}`,
      "applicationCategory": getApplicationCategory(category?.id),
      "operatingSystem": "Any",
      "softwareVersion": "1.0.0",
      "datePublished": "2026-05-01T00:00:00Z",
      "dateModified": tool.lastUpdated ? new Date(tool.lastUpdated).toISOString() : "2026-05-28T00:00:00Z",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "KaruviLab"
      },
      "image": `${BASE_URL}/icons/icon-512.png`,
      ...(useCases && useCases.length > 0 && { "featureList": useCases })
    };

    scripts.push(toolSchema);

    const faqs = propsContent?.faq;
    if (faqs && faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      };
      scripts.push(faqSchema);
    }

    const howTo = propsContent?.howTo;
    if (howTo && howTo.length > 0) {
      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${tool.name}`,
        "description": `Step-by-step guide on using the ${tool.name} tool on KaruviLab.`,
        "step": howTo.map((step: string, i: number) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "text": step,
          "name": `Step ${i + 1}`
        }))
      };
      scripts.push(howToSchema);
    }
  }

  return (
    <>
      {scripts.map((s, i) => {
        const content = JSON.stringify(s);
        if (isHead) {
          return (
            <script
              key={i}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        return (
          <Script
            key={i}
            id={`json-ld-${tool?.id || "site"}-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      })}
    </>
  );
}
