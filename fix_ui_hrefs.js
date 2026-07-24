const fs = require('fs');
const path = require('path');

// 1. Fix tool-registry.ts
let registryPath = path.join(__dirname, 'src/tool-registry.ts');
let registryContent = fs.readFileSync(registryPath, 'utf-8');
registryContent = registryContent.replace(/href:\s*['"](.*?)['"]/g, (match, hrefVal) => {
  let cleanHref = hrefVal.trim();
  if (!cleanHref.startsWith('/')) cleanHref = '/' + cleanHref;
  if (!cleanHref.endsWith('/')) cleanHref = cleanHref + '/';
  cleanHref = cleanHref.replace(/\/{2,}/g, '/');
  return `href: '${cleanHref}'`;
});
fs.writeFileSync(registryPath, registryContent, 'utf-8');

// 2. Fix UI Components
const filesToFix = [
  'components/ui/Breadcrumbs.tsx',
  'components/ui/ClientToolShell.tsx',
  'components/ui/WorkflowSuggestions.tsx',
  'components/ui/search/SearchOverlay.tsx',
  'components/ui/QuickActionsDashboard.tsx',
  'components/ui/GlobalDragDrop.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace href={`/${tool.href}`} with href={tool.href}
  content = content.replace(/href=\{`\/\$\{([^}]*href)\}`\}/g, 'href={$1}');
  
  // Replace router.push(`/${tool.href}`) with router.push(tool.href)
  content = content.replace(/router\.push\(`\/\$\{([^}]*href)\}`\)/g, 'router.push($1)');
  
  // Replace router.push("/" + tool.href) with router.push(tool.href)
  content = content.replace(/router\.push\("\/"\s*\+\s*([^)]*href)\)/g, 'router.push($1)');
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("UI hrefs fixed!");
