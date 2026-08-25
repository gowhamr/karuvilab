const fs = require('fs');
const file = '/home/gowtham/karuvilab/app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'const [hmacKey, setHmacKey] = useState("");',
  'const [hmacKey, setHmacKey] = useState("");\n  const [expectedHash, setExpectedHash] = useState("");'
);

c = c.replace(
  '<ToolResultArea',
  `const isMatch = expectedHash ? (res?.value || '').toLowerCase() === expectedHash.toLowerCase() : null;
              return (
                <div key={algo} className="relative">
                  {expectedHash && res?.value && (
                    <div className={\`absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-bold \${isMatch ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}\`}>
                      {isMatch ? 'MATCH' : 'MISMATCH'}
                    </div>
                  )}
                  <ToolResultArea`
);

// We need to add the input for expectedHash in the optionsPanel
c = c.replace(
  /<div className="space-y-4 pt-4 border-t border-border">\s*<label className="text-sm font-bold text-text-2">Output Encoding<\/label>/,
  `<div className="space-y-4 pt-4 border-t border-border">
            <label className="text-sm font-bold text-text-2">Expected Hash (Verify)</label>
            <ToolInput
              value={expectedHash}
              onChange={setExpectedHash}
              placeholder="Paste hash to compare..."
              mono
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <label className="text-sm font-bold text-text-2">Output Encoding</label>`
);

// Also fix the note to say Web Crypto API + hash-wasm
c = c.replace(
  'All operations are performed on-device via Web Crypto API.',
  'All operations are performed on-device using Web Crypto API and hash-wasm for streaming algorithms.'
);

fs.writeFileSync(file, c);
console.log("Patched verification UI");
