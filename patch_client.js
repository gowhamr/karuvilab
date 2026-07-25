const fs = require('fs');
const path = 'app/(tools)/image-tools/color-palette-extractor/ColorPaletteExtractorClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '{palette.map((color) => (\\n                  <div key={color}',
  '{palette.map((color, idx) => (\\n                  <div key={`${color}-${idx}`}'
);

fs.writeFileSync(path, content);
console.log("Patched ColorPaletteExtractorClient.tsx");
