const fs = require('fs');
const path = 'app/(tools)/image-tools/avif-converter/AvifConverterClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the canvas.toBlob logic with a timeout
const oldLogic = `        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/avif", qualityFraction);
        });`;

const newLogic = `        const blob = await new Promise<Blob | null>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("AVIF conversion timed out. Your browser may not support native AVIF encoding."));
          }, 15000);
          try {
            canvas.toBlob((b) => {
              clearTimeout(timer);
              resolve(b);
            }, "image/avif", qualityFraction);
          } catch (e) {
            clearTimeout(timer);
            reject(e);
          }
        });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(path, content);
console.log("Patched AvifConverterClient.tsx with timeout");
