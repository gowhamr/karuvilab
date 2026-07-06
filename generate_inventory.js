const fs = require('fs');

async function main() {
  const tsNode = require('ts-node');
  tsNode.register({
    compilerOptions: { module: 'commonjs', esModuleInterop: true },
    transpileOnly: true
  });
  
  // A mock to handle path aliases like @/src/...
  require('module-alias').addAlias('@', __dirname);
  
  const { ALL_TOOLS } = require('./src/registry/core-registry.ts');
  
  let md = `# Tool Inventory\n\n`;
  md += `**Total Tools**: ${ALL_TOOLS.length}\n\n`;
  md += `| Tool Name | Category | Route | Status | Worker Usage | Offline Support |\n`;
  md += `|-----------|----------|-------|--------|--------------|-----------------|\n`;
  
  for (const tool of ALL_TOOLS) {
    md += `| ${tool.name} | ${tool.category} | ${tool.href} | ${tool.status || 'stable'} | ${tool.requiresNetwork === false ? 'No' : 'Yes'} | Yes |\n`;
  }
  
  fs.writeFileSync('docs/TOOL_INVENTORY.md', md);
  console.log("Done");
}

main().catch(console.error);
