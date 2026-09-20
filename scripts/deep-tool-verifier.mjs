import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const toolsDir = path.join(rootDir, 'app', '(tools)');
const categories = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Found ${categories.length} tool categories.`);

const toolAudit = [];

for (const category of categories) {
  const catPath = path.join(toolsDir, category);
  const toolFolders = fs.readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const toolId of toolFolders) {
    const toolPath = path.join(catPath, toolId);
    const files = fs.readdirSync(toolPath);
    
    const hasPage = files.some(f => /^page\.(tsx|jsx|js|ts)$/.test(f));
    const hasWrapper = files.some(f => /Wrapper\.(tsx|jsx|js|ts)$/i.test(f));
    const hasClient = files.some(f => /Client\.(tsx|jsx|js|ts)$/i.test(f));

    // Check client implementation
    const clientFile = files.find(f => /Client\.(tsx|jsx|js|ts)$/i.test(f));
    let clientContent = '';
    if (clientFile) {
      clientContent = fs.readFileSync(path.join(toolPath, clientFile), 'utf-8');
    }

    // Check for interactive elements
    const buttonMatches = (clientContent.match(/<button\b/g) || []).length;
    const inputMatches = (clientContent.match(/<input\b/g) || []).length;
    const selectMatches = (clientContent.match(/<select\b/g) || []).length;
    const textareaMatches = (clientContent.match(/<textarea\b/g) || []).length;
    
    // Check for potential dead element patterns
    const emptyOnClick = (clientContent.match(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/g) || []).length;
    const dummyHref = (clientContent.match(/href\s*=\s*["'](#|\s*|javascript:.*)["']/g) || []).length;

    toolAudit.push({
      category,
      toolId,
      hasPage,
      hasWrapper,
      hasClient,
      interactiveStats: {
        buttons: buttonMatches,
        inputs: inputMatches,
        selects: selectMatches,
        textareas: textareaMatches
      },
      deadElementFlags: {
        emptyOnClick,
        dummyHref
      }
    });
  }
}

console.log(`Total tools audited: ${toolAudit.length}`);
const flaggedTools = toolAudit.filter(t => t.deadElementFlags.emptyOnClick > 0 || t.deadElementFlags.dummyHref > 0 || !t.hasClient);
console.log(`Tools with flagged issues: ${flaggedTools.length}`);
if (flaggedTools.length > 0) {
  console.table(flaggedTools.map(t => ({
    category: t.category,
    toolId: t.toolId,
    emptyOnClick: t.deadElementFlags.emptyOnClick,
    dummyHref: t.deadElementFlags.dummyHref,
    hasClient: t.hasClient
  })));
}

fs.writeFileSync(path.join(rootDir, 'tool_qa_inventory.json'), JSON.stringify(toolAudit, null, 2));
