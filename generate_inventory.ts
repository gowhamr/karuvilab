import fs from 'fs';
import { ALL_TOOLS } from './src/tool-registry';

async function main() {
  let md = `# Tool Inventory\n\n`;
  md += `**Total Tools**: ${ALL_TOOLS.length}\n\n`;
  md += `| Tool Name | Category | Route | Status | Requires Network | Offline Support |\n`;
  md += `|-----------|----------|-------|--------|------------------|-----------------|\n`;
  
  for (const tool of ALL_TOOLS) {
    md += `| ${tool.name} | ${tool.category} | ${tool.href} | ${tool.status || 'stable'} | ${tool.requiresNetwork === true ? 'Yes' : 'No'} | Yes |\n`;
  }
  
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }
  fs.writeFileSync('docs/TOOL_INVENTORY.md', md);
  console.log("Done");
}

main().catch(console.error);
