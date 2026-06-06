// src/__tests__/modern-seo-security.test.ts
import { describe, it, expect } from "vitest";
import { getCanonicalUrl } from "../seo/canonical";
import { generateToolMetadata, generateMetadata } from "../seo/metadata";
import { generateBreadcrumbSchema, generateFAQSchema, generateToolSchema } from "../seo/schema";
import { generateSitemapEntries } from "../seo/sitemap";
import { generateRobotsText } from "../seo/robots";
import { validateToolSEO } from "../seo/seoValidator";
import { sanitizeHtml, safeJsonParse, cleanObjectPrototype } from "../security/sanitization";
import { sanitizeCommandPaletteInput } from "../security/inputSanitization";
import { validateExtension, validateFileSize, verifyMagicBytes } from "../security/fileValidation";

describe("New SEO System", () => {
  it("generates correct canonical URLs", () => {
    expect(getCanonicalUrl("developer-tools/base64")).toBe("https://karuvilab.com/developer-tools/base64/");
    expect(getCanonicalUrl("/calculators/age-calculator/")).toBe("https://karuvilab.com/calculators/age-calculator/");
    expect(getCanonicalUrl("")).toBe("https://karuvilab.com/");
  });

  it("validates tool SEO configuration correctly", () => {
    const validTool = {
      id: "test-tool",
      name: "Test Tool",
      seo: {
        title: "Test Tool Title — KaruviLab",
        description: "Test description that is brief and under 160 characters long.",
        keywords: ["test", "tool", "keyword"],
        canonical: "/test-tool",
        ogImage: "/icons/test.png",
      },
    };
    
    expect(validateToolSEO(validTool).length).toBe(0);

    const invalidTool = {
      id: "bad-tool",
      name: "Bad Tool",
      seo: {
        title: "This SEO Title is extremely long and exceeds the sixty character limit specified by Google",
        description: "Description is also way too long to be search engine compliant and should fail validation checks because of its length of over 160 characters which is a standard constraint.",
        keywords: ["short"],
        canonical: "",
        ogImage: "",
      },
    };

    const errors = validateToolSEO(invalidTool);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes("exceeds 60 characters"))).toBe(true);
    expect(errors.some(e => e.includes("exceeds 160 characters"))).toBe(true);
    expect(errors.some(e => e.includes("at least 3 items"))).toBe(true);
    expect(errors.some(e => e.includes("canonical path is required"))).toBe(true);
    expect(errors.some(e => e.includes("ogImage path is required"))).toBe(true);
  });

  it("generates Breadcrumb and FAQ schema", () => {
    const breadcrumb = generateBreadcrumbSchema([
      { name: "Home", path: "" },
      { name: "Developer", path: "/developer-tools" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement[1]!.item).toBe("https://karuvilab.com/developer-tools/");

    const faq = generateFAQSchema([
      { question: "Is it local?", answer: "Yes." },
    ]);
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity[0]!.name).toBe("Is it local?");
  });
});

describe("New Security System", () => {
  it("sanitizes dangerous HTML and allows safe subset", () => {
    const dirty = "<p>Hello</p><script>alert(1)</script><img src='test.png' onerror='alert(2)' />";
    const clean = sanitizeHtml(dirty);
    expect(clean).toContain("<p>Hello</p>");
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onerror");
  });

  it("protects against prototype pollution in JSON parsing", () => {
    const pollutedJson = '{"name":"test","__proto__":{"polluted":true},"constructor":{"prototype":{"injected":true}}}';
    const parsed = safeJsonParse(pollutedJson);
    expect(parsed.name).toBe("test");
    // Verify that the prototype chain is not polluted
    expect((parsed as any).polluted).toBeUndefined();
    expect((parsed as any).injected).toBeUndefined();
    expect(Object.prototype.hasOwnProperty("polluted")).toBe(false);
  });

  it("sanitizes command palette input", () => {
    const input = "search `rm -rf /` (cmd)";
    const sanitized = sanitizeCommandPaletteInput(input);
    expect(sanitized).not.toContain("`rm -rf /` ");
    expect(sanitized).toContain("search");
  });

  it("validates files securely", () => {
    expect(validateExtension("document.pdf", ["pdf", "jpg"])).toBe(true);
    expect(validateExtension("script.exe", ["pdf", "jpg"])).toBe(false);
    expect(validateFileSize(5 * 1024 * 1024, 10)).toBe(true); // 5MB is under 10MB
    expect(validateFileSize(15 * 1024 * 1024, 10)).toBe(false); // 15MB is over 10MB
  });
});
