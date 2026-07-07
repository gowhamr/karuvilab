import { ALL_TOOLS } from '../src/tool-registry';
import fs from 'fs';

console.log(`Total Tools: ${ALL_TOOLS.length}`);
const categories = ALL_TOOLS.reduce((acc, tool) => {
  acc[tool.category] = (acc[tool.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
console.log('Categories:', categories);

const inventoryMarkdown = `# Tool Inventory\n\nTotal Tools: ${ALL_TOOLS.length}\n\n| Tool Name | Category | Route | Status | Privacy | Offline |\n|---|---|---|---|---|---|\n` + ALL_TOOLS.map(t => `| ${t.name} | ${t.category} | ${t.href} | ${t.status || 'stable'} | Client-side | Yes |`).join('\n');

fs.writeFileSync('docs/audit-2026/TOOL_INVENTORY.md', inventoryMarkdown);
console.log('Generated TOOL_INVENTORY.md');
