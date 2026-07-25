import fs from 'fs';
import path from 'path';

const registryPath = path.join(process.cwd(), 'src/registry/core-registry.ts');
const registryStr = fs.readFileSync(registryPath, 'utf8');

const tools = [];
const regex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"desc":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(registryStr)) !== null) {
  tools.push({
    id: match[1],
    name: match[2],
    desc: match[3],
    category: match[4]
  });
}

const contentDir = path.join(process.cwd(), 'src/content/tools');
const existingFiles = fs.readdirSync(contentDir)
  .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
  .map(f => f.replace(/\.tsx?$/, ''));

const missing = tools.filter(t => !existingFiles.includes(t.id));

function camelCase(str) {
  return str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
}

missing.forEach(tool => {
  const content = `import { ToolContent } from '../../registry/types';

export const ${camelCase(tool.id)}: ToolContent = {
  detailedDescription: \`
The **${tool.name}** tool is a privacy-first utility designed to run entirely in your browser.

${tool.desc}.

In line with KaruviLab's strict privacy policy, all processing happens locally on your device. Your data is never uploaded to external servers, ensuring maximum security and speed.
\`,
  howTo: [
    "**Step 1:** Select or upload your input data.",
    "**Step 2:** Adjust the available settings to your preference.",
    "**Step 3:** The tool will process your data instantly.",
    "**Step 4:** Copy or download the results securely to your device."
  ],
  faq: [
    {
      question: "Is my data uploaded to a server?",
      answer: "No. All processing happens locally in your browser. Your files and text remain on your device, ensuring total privacy."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes! Because it relies on browser-native APIs and WebAssembly/Web Workers, it functions perfectly even without an active internet connection once loaded."
    }
  ]
};
`;
  
  fs.writeFileSync(path.join(contentDir, `${tool.id}.ts`), content, 'utf8');
  console.log(`Generated ${tool.id}.ts`);
});
