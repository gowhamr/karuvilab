# Architecture Migration Instructions

For each tool page.tsx in the list:
1. Extract the functional component to `[ComponentName]Client.tsx` in the same directory.
   - Component name should be PascalCase version of the directory name (e.g., `extract-images` -> `ExtractImagesClient`).
   - Move `"use client"`, all imports, and all logic there.
2. Replace the original `page.tsx` with a Server Component.
3. The Server Component MUST:
   - Import `Metadata` from "next".
   - Import `dynamic` from "next/dynamic".
   - Import `generateToolMetadata` from "@/src/lib/seo".
   - Import `ToolShell` from "@/components/ui/ToolShell".
   - Import `findToolById` from "@/src/tool-registry".
   - Use `generateToolMetadata(toolId)` for metadata.
   - Use `findToolById(toolId)` to get tool details for `ToolShell`.
   - Use `dynamic(() => import("./[ComponentName]Client"), { ssr: false, loading: () => null })`.

## Tool IDs Mapping:
- `pdf-tools/extract-images` -> `extract-images`
- `pdf-tools/image-to-pdf` -> `image-to-pdf`
- `pdf-tools/lock-unlock` -> `lock-unlock-pdf`
- `pdf-tools/page-numbering` -> `page-numbering`
- `pdf-tools/pdf-to-word` -> `pdf-to-word`
- `pdf-tools/rotate-pdf` -> `rotate-pdf`
- `pdf-tools/split-pdf` -> `split-pdf`
- `pdf-tools/watermark-pdf` -> `watermark-pdf`
- `utilities/grammar-checker` -> `grammar-checker`
- `utilities/markdown` -> `markdown`
- `utilities/qrcode` -> `qrcode`
- `utilities/split-copy` -> `split-copy`
- `utilities/text-utility` -> `text-utility`
- `utilities/url-cleaner` -> `url-cleaner`
- `utilities/validate` -> `validate`
- `security-tools/hash-generator` -> `hash-generator`
- `security-tools/html-entities` -> `html-entities`
- `security-tools/jwt-decoder` -> `jwt-decoder`
- `security-tools/password-generator` -> `password-generator`
- `security-tools/url-encoder` -> `url-encoder`
- `seo-tools/image-seo` -> `image-seo`
- `seo-tools/meta-tags` -> `meta-tags`
- `seo-tools/og-preview` -> `og-preview`
- `seo-tools/robots-txt` -> `robots-txt`
- `seo-tools/seo-title` -> `seo-title`
- `seo-tools/sitemap-generator` -> `sitemap-generator`
- `seo-tools/slug-generator` -> `slug-generator`
- `developer-tools/code-minifier` -> `code-minifier`
- `developer-tools/diff-checker` -> `diff-checker`
- `developer-tools/format` -> `format`
- `developer-tools/json-csv` -> `json-csv`
- `developer-tools/json-formatter` -> `json-formatter`
- `developer-tools/regex` -> `regex-tester`

## Example Page Structure:
```tsx
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { findToolById } from "@/src/tool-registry";

const TOOL_ID = "tool-id";

export const metadata: Metadata = generateToolMetadata(TOOL_ID);

const ClientComponent = dynamic(() => import("./ClientComponent"), {
  ssr: false,
  loading: () => null,
});

export default function ToolPage() {
  const tool = findToolById(TOOL_ID);
  if (!tool) return null;

  return (
    <ToolShell
      title={tool.name}
      description={tool.desc}
      category={tool.category}
    >
      <ClientComponent />
    </ToolShell>
  );
}
```
