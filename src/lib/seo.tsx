import { Metadata } from "next";
import { ALL_TOOLS, CategoryEntry, ToolEntry } from "@/src/tool-registry";
import { TOOL_CONTENT } from "@/src/tool-content";

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

interface StructuredDataProps {
  tool?: ToolEntry;
  category?: CategoryEntry;
  content?: any;
}

/**
 * Renders JSON-LD structured data for Tools, Breadcrumbs, FAQ, and HowTo.
 */
export function StructuredData({ tool, category, content: propsContent }: StructuredDataProps) {
  const scripts: any[] = [];

  // 1. Breadcrumb Schema
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      }
    ]
  };

  if (category) {
    breadcrumbList.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": category.label,
      "item": `${BASE_URL}/${category.href}`
    });
  }

  if (tool) {
    breadcrumbList.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": tool.name,
      "item": `${BASE_URL}/${tool.href}`
    });
  }

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
    const registryContent = TOOL_CONTENT[tool.id as keyof typeof TOOL_CONTENT] || {};
    const detailedDesc = propsContent?.detailedDescription || registryContent.detailedDescription || tool.desc;
    
    const toolSchema: any = {
      "@context": "https://schema.org",
      "@type": tool.schemaType || "WebApplication",
      "name": tool.name,
      "description": detailedDesc,
      "url": `${BASE_URL}/${tool.href}`,
      "applicationCategory": category?.label || "Utility",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "KaruviLab"
      }
    };

    scripts.push(toolSchema);

    // 3. FAQ Schema
    const faqs = propsContent?.faq || registryContent.faq;
    if (faqs && faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f: any) => ({
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

    // 4. HowTo Schema
    const howTo = propsContent?.howTo || registryContent.howTo;
    if (howTo && howTo.length > 0) {
      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${tool.name}`,
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
