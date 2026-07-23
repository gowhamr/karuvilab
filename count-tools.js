const fs = require('fs');

let registryContent = fs.readFileSync('src/registry/core-registry.ts', 'utf8');
const startTools = registryContent.indexOf('[');
const endTools = registryContent.lastIndexOf(']');
const toolsText = registryContent.substring(startTools, endTools + 1);
const CORE_TOOLS = new Function(`return ${toolsText}`)();

console.log(CORE_TOOLS.length);
console.log(CORE_TOOLS.slice(-10).map(t => t.id));
