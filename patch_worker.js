const fs = require('fs');
const path = 'src/workers/karuvi.worker.ts';
let content = fs.readFileSync(path, 'utf8');

const oldInit = `      // k-means implementation
      let centroids: [number, number, number][] = [];
      for(let i=0; i<k; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]!);
      }`;

const newInit = `      // k-means implementation - Select unique initial centroids
      // Sample up to 1000 pixels to find unique colors for initialization
      const sampleSize = Math.min(pixels.length, 1000);
      const sampledUnique = new Map<string, [number, number, number]>();
      for(let i=0; i<sampleSize; i++) {
         const p = pixels[Math.floor(Math.random() * pixels.length)]!;
         sampledUnique.set(p.join(','), p);
         if (sampledUnique.size >= k * 5) break; // get enough candidates
      }
      const uniquePixels = Array.from(sampledUnique.values());
      const actualK = Math.min(k, uniquePixels.length);
      
      let centroids: [number, number, number][] = [];
      for(let i=0; i<actualK; i++) {
        const idx = Math.floor(Math.random() * uniquePixels.length);
        centroids.push(uniquePixels[idx]!);
        uniquePixels.splice(idx, 1);
      }
      k = actualK;`;

content = content.replace(oldInit, newInit);

const oldReturn = `      return centroids.map(c => {
        const r = Math.round(c[0]).toString(16).padStart(2, '0');
        const g = Math.round(c[1]).toString(16).padStart(2, '0');
        const b = Math.round(c[2]).toString(16).padStart(2, '0');
        return \`#\${r}\${g}\${b}\`;
      });`;

const newReturn = `      const hexColors = centroids.map(c => {
        const r = Math.round(c[0]).toString(16).padStart(2, '0');
        const g = Math.round(c[1]).toString(16).padStart(2, '0');
        const b = Math.round(c[2]).toString(16).padStart(2, '0');
        return \`#\${r}\${g}\${b}\`;
      });
      return Array.from(new Set(hexColors));`;

content = content.replace(oldReturn, newReturn);
fs.writeFileSync(path, content);
console.log("Patched karuvi.worker.ts");
