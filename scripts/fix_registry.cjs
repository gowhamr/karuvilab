const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/registry/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.ts'));

// Words to keep lowercase in Title Case if not first word
const lowercaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'to', 'with'];

function smartTitleCase(str) {
  // Split by spaces or hyphens to correctly title-case compound words if needed,
  // but it's simpler to just do words. 
  return str.split(' ').map((word, index) => {
    // Keep hyphenated words as is if they are already Title Cased
    if (word.includes('-')) {
      return word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
    }
    
    if (index > 0 && lowercaseWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix name
  content = content.replace(/name:\s*['"]([^'"]+)['"]/, (match, p1) => {
    // Only apply if it's not already Title Case to avoid messing up specific brands
    let fixedName = p1;
    // We'll apply Title Case
    fixedName = smartTitleCase(p1);
    // Special exceptions: PDF, MP4, JSON, CSV, SVG, JWT, SQL, QR, HTML, CSS, JS, API, URL, HMAC, CSP, EMI, CAGR, SIP, BMI, etc
    const acrons = ['PDF', 'MP4', 'JSON', 'CSV', 'SVG', 'JWT', 'SQL', 'QR', 'HTML', 'CSS', 'JS', 'API', 'URL', 'HMAC', 'CSP', 'EMI', 'CAGR', 'SIP', 'BMI', 'SEO', 'UUID'];
    acrons.forEach(a => {
      const reg = new RegExp(`\\b${a}\\b`, 'gi');
      fixedName = fixedName.replace(reg, a);
    });
    return `name: '${fixedName}'`;
  });

  // Fix desc
  content = content.replace(/desc:\s*['"]([^'"]+)['"]/, (match, p1) => {
    let fixedDesc = p1;
    
    // Remove fluff
    fixedDesc = fixedDesc.replace(/\s*[-—]*\s*100%\s+local[^\.]*\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*locally\s+in\s+your\s+browser\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*natively\s+in\s+your\s+browser\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*[-—]*\s*nothing\s+leaves\s+your\s+browser\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*without\s+uploading\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*without\s+sending\s+to\s+a\s+server\.?/gi, '');
    fixedDesc = fixedDesc.replace(/\s*locally\./gi, '');
    fixedDesc = fixedDesc.replace(/\s*locally/gi, '');
    
    // Clean up spaces
    fixedDesc = fixedDesc.trim();
    
    // Ensure first letter is capitalized
    if (fixedDesc.length > 0) {
      fixedDesc = fixedDesc.charAt(0).toUpperCase() + fixedDesc.slice(1);
    }
    
    // Ensure no trailing period
    if (fixedDesc.endsWith('.')) {
      fixedDesc = fixedDesc.slice(0, -1);
    }

    return `desc: '${fixedDesc}'`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done cleaning tools.');
