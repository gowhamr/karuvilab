const fs = require('fs');
const path = require('path');

const files = [
"app/(tools)/calculators/age-calculator/page.tsx",
"app/(tools)/calculators/cagr-calculator/page.tsx",
"app/(tools)/calculators/compound-interest/page.tsx",
"app/(tools)/calculators/currency-converter/page.tsx",
"app/(tools)/calculators/date-calculator/page.tsx",
"app/(tools)/calculators/discount-calculator/page.tsx",
"app/(tools)/calculators/fd-calculator/page.tsx",
"app/(tools)/calculators/gst-calculator/page.tsx",
"app/(tools)/calculators/inflation-calculator/page.tsx",
"app/(tools)/calculators/lumpsum-calculator/page.tsx",
"app/(tools)/calculators/mutual-fund-returns/page.tsx",
"app/(tools)/calculators/numeral-converter/page.tsx",
"app/(tools)/calculators/percentage-calculator/page.tsx",
"app/(tools)/calculators/ppf-calculator/page.tsx",
"app/(tools)/calculators/rd-calculator/page.tsx",
"app/(tools)/calculators/retirement-calculator/page.tsx",
"app/(tools)/calculators/safe-to-spend/page.tsx",
"app/(tools)/calculators/salary-calculator/page.tsx",
"app/(tools)/calculators/sip-calculator/page.tsx",
"app/(tools)/calculators/smart-converter/page.tsx",
"app/(tools)/calculators/standard-calculator/page.tsx",
"app/(tools)/calculators/stock-average-calculator/page.tsx",
"app/(tools)/calculators/swp-calculator/page.tsx",
"app/(tools)/calculators/time-calculator/page.tsx",
"app/(tools)/calculators/unit-converter/page.tsx",
"app/(tools)/calculators/utc-ist-converter/page.tsx",
"app/(tools)/calculators/work-hours/page.tsx",
"app/(tools)/calculators/world-clock/page.tsx",
"app/(tools)/developer-tools/code-minifier/page.tsx",
"app/(tools)/developer-tools/diff-checker/page.tsx",
"app/(tools)/developer-tools/format/page.tsx",
"app/(tools)/developer-tools/html-viewer/page.tsx",
"app/(tools)/developer-tools/json-csv/page.tsx",
"app/(tools)/developer-tools/json-formatter/page.tsx",
"app/(tools)/developer-tools/regex/page.tsx",
"app/(tools)/image-tools/bg-remover/page.tsx",
"app/(tools)/image-tools/bulk-resizer/page.tsx",
"app/(tools)/image-tools/compress/page.tsx",
"app/(tools)/image-tools/image-base64/page.tsx",
"app/(tools)/image-tools/image-converter/page.tsx",
"app/(tools)/image-tools/image-crop/page.tsx",
"app/(tools)/image-tools/image-resizer/page.tsx",
"app/(tools)/pdf-tools/compress-pdf/page.tsx",
"app/(tools)/pdf-tools/extract-images/page.tsx",
"app/(tools)/pdf-tools/image-to-pdf/page.tsx",
"app/(tools)/pdf-tools/lock-unlock/page.tsx",
"app/(tools)/pdf-tools/merge-pdf/page.tsx",
"app/(tools)/pdf-tools/page-numbering/page.tsx",
"app/(tools)/pdf-tools/pdf-to-word/page.tsx",
"app/(tools)/pdf-tools/rotate-pdf/page.tsx",
"app/(tools)/pdf-tools/split-pdf/page.tsx",
"app/(tools)/pdf-tools/watermark-pdf/page.tsx",
"app/(tools)/security-tools/base64/page.tsx",
"app/(tools)/security-tools/hash-generator/page.tsx",
"app/(tools)/security-tools/html-entities/page.tsx",
"app/(tools)/security-tools/jwt-decoder/page.tsx",
"app/(tools)/security-tools/password-generator/page.tsx",
"app/(tools)/security-tools/url-encoder/page.tsx",
"app/(tools)/seo-tools/image-seo/page.tsx",
"app/(tools)/seo-tools/meta-tags/page.tsx",
"app/(tools)/seo-tools/og-preview/page.tsx",
"app/(tools)/seo-tools/robots-txt/page.tsx",
"app/(tools)/seo-tools/seo-title/page.tsx",
"app/(tools)/seo-tools/sitemap-generator/page.tsx",
"app/(tools)/seo-tools/slug-generator/page.tsx",
"app/(tools)/utilities/grammar-checker/page.tsx",
"app/(tools)/utilities/markdown/page.tsx",
"app/(tools)/utilities/qrcode/page.tsx",
"app/(tools)/utilities/split-copy/page.tsx",
"app/(tools)/utilities/task-reminder/page.tsx",
"app/(tools)/utilities/text-utility/page.tsx",
"app/(tools)/utilities/url-cleaner/page.tsx",
"app/(tools)/utilities/validate/page.tsx"
];

const importLine = 'import { ToolSkeleton } from "@/components/ui/ToolSkeleton";\n';

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if not present
    if (!content.includes('import { ToolSkeleton }')) {
        content = importLine + content;
    }

    // Replace loading: () => null
    const oldLoading = 'loading: () => null';
    const newLoading = 'loading: () => <ToolSkeleton />';
    
    if (content.includes(oldLoading)) {
        content = content.replace(oldLoading, newLoading);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    } else {
        console.log(`Pattern not found in: ${file}`);
    }
});
