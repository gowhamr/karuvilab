const fs = require('fs');

const extractFile = 'src/content/tools/extract-pages.ts';
let extractContent = fs.readFileSync(extractFile, 'utf8');
extractContent = extractContent.replace(/`Count`/g, '\\`Count\\`');
extractContent = extractContent.replace(/`Kids`/g, '\\`Kids\\`');
extractContent = extractContent.replace(/`Parent`/g, '\\`Parent\\`');
fs.writeFileSync(extractFile, extractContent);

const yamlFile = 'src/content/tools/yaml-json-converter.ts';
let yamlContent = fs.readFileSync(yamlFile, 'utf8');
yamlContent = yamlContent.replace(/`{}`/g, '\\`{}\\`');
yamlContent = yamlContent.replace(/`# comments`/g, '\\`# comments\\`');
fs.writeFileSync(yamlFile, yamlContent);

console.log("Fixed quotes in content files");
