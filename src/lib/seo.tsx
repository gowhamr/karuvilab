import { Metadata } from "next";
import Script from "next/script";
import { ALL_TOOLS, CategoryEntry, ToolEntry } from "@/src/tool-registry";
import { TOOL_CONTENT, ToolContent } from "@/src/tool-content";

const BASE_URL = "https://karuvilab.com";

/**
 * Generates SEO metadata for a specific tool.
 */
export function generateToolMetadata(toolId: string): Metadata {
  const tool = ALL_TOOLS.find((t) => t.id === toolId);
  if (!tool) return {};

  const title = `${tool.name} | KaruviLab`;
  const description = tool.desc;
  const url = `${BASE_URL}/${tool.href}`;

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
  tool?: ToolEntry;
  category?: CategoryEntry;
  content?: {
    detailedDescription?: string;
    faq?: { question: string; answer: string }[];
    howTo?: string[];
  };
}

/**
 * Renders JSON-LD structured data for Tools, Breadcrumbs, FAQ, and HowTo.
 */
export function StructuredData({ tool, category, content: propsContent }: StructuredDataProps): React.JSX.Element {
  const scripts: Record<string, unknown>[] = [];

  // 1. Breadcrumb Schema
  const itemListElement: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": BASE_URL
    }
  ];

  if (category) {
    itemListElement.push({
      "@type": "ListItem",
      "position": itemListElement.length + 1,
      "name": category.label,
      "item": `${BASE_URL}/${category.href.replace(/^\/|\/$/g, '')}/`
    });
  }

  if (tool) {
    itemListElement.push({
      "@type": "ListItem",
      "position": itemListElement.length + 1,
      "name": tool.name,
      "item": `${BASE_URL}/${tool.href.replace(/^\/|\/$/g, '')}/`
    });
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  scripts.push(breadcrumbList);

  // 2. WebSite & Organization Schema (for Home)
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

  // 3. Tool / SoftwareApplication Schema
  if (tool) {
    const registryContent = (TOOL_CONTENT[tool.id as keyof typeof TOOL_CONTENT] || {}) as ToolContent;
    const detailedDesc = propsContent?.detailedDescription || registryContent.detailedDescription || tool.desc;
    
    const getApplicationCategory = (catId?: string) => {
      switch (catId) {
        case 'calculators': return 'FinanceApplication';
        case 'developer':   return 'DeveloperApplication';
        case 'seo':         return 'BusinessApplication';
        case 'security':    
        case 'pdf':
        case 'image':
        case 'utilities':   return 'UtilitiesApplication';
        default:            return 'UtilitiesApplication';
      }
    };

    const toolSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": tool.schemaType || "WebApplication",
      "name": tool.name,
      "description": detailedDesc,
      "url": `${BASE_URL}/${tool.href}`,
      "applicationCategory": getApplicationCategory(category?.id),
      "operatingSystem": "Any",
      "softwareVersion": "1.0.0",
      "datePublished": new Date("2026-05-01").toISOString(),
      "dateModified": tool.lastUpdated ? new Date(tool.lastUpdated).toISOString() : new Date().toISOString(),
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "KaruviLab"
      },
      "image": `${BASE_URL}/icons/icon-512.png`
    };

    scripts.push(toolSchema);

    // 4. FAQ Schema
    const faqs = propsContent?.faq || registryContent.faq;
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

    // 5. HowTo Schema
    const howTo = propsContent?.howTo || registryContent.howTo;
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
      {scripts.map((s, i) => (
        <Script
          key={i}
          id={`json-ld-${tool?.id || 'site'}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
