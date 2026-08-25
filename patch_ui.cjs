const fs = require('fs');
const file = '/home/gowtham/karuvilab/app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(
  'const ALGOS = ["MD5", "SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"];',
  'const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512", "SHA3-256", "SHA3-512", "BLAKE3"];'
);

const oldFileBlock = `      } else if (mode === "file" && file) {
        const buffer = await file.arrayBuffer();
        for (const algo of selectedAlgos) {
          let value = "";
          try {
            if (useHmac) {
              if (algo === "MD5") {
                setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: "MD5 HMAC not supported" } }));
                continue;
              }
              value = await workerManager.generateFileHmac(buffer.slice(0), hmacKey, algo, encoding, undefined, controller.signal);
            } else {
              value = await workerManager.generateFileHash(buffer.slice(0), algo, encoding, undefined, controller.signal);
            }
            setHashes(prev => ({ ...prev, [algo]: { algo, value } }));
          } catch (e: any) {
            setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: e.message } }));
          }
        }
      }`;

const newFileBlock = `      } else if (mode === "file" && file) {
        for (const algo of selectedAlgos) {
          let value = "";
          try {
            if (useHmac) {
              if (algo === "MD5") {
                setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: "MD5 HMAC not supported" } }));
                continue;
              }
              value = await workerManager.generateFileHmac(file, hmacKey, algo, encoding, (p) => setProgress(p), controller.signal);
            } else {
              value = await workerManager.generateFileHash(file, algo, encoding, (p) => setProgress(p), controller.signal);
            }
            setHashes(prev => ({ ...prev, [algo]: { algo, value } }));
          } catch (e: any) {
            setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: e.message } }));
          }
        }
      }`;

c = c.replace(oldFileBlock, newFileBlock);
fs.writeFileSync(file, c);
