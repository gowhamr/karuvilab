"use client";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "security")!;

async function sha(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function md5(str: string): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = (((a + q) & 0xFFFFFFFF) + ((x + t) & 0xFFFFFFFF)) & 0xFFFFFFFF;
    return (((a << s) | (a >>> (32 - s))) + b) & 0xFFFFFFFF;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

  const bytes = new TextEncoder().encode(str);
  const len8 = bytes.length;
  const len64 = (((len8 + 8) >>> 6) + 1) << 4;
  const s = new Uint32Array(len64);
  for (let i = 0; i < len8; i++) s[i >> 2] |= bytes[i] << ((i & 3) * 8);
  s[len8 >> 2] |= 0x80 << ((len8 & 3) * 8);
  s[len64 - 2] = len8 * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < len64; i += 16) {
    const [A, B, C, D] = [a, b, c, d];
    a=ff(a,b,c,d,s[i],7,-680876936); d=ff(d,a,b,c,s[i+1],12,-389564586); c=ff(c,d,a,b,s[i+2],17,606105819); b=ff(b,c,d,a,s[i+3],22,-1044525330);
    a=ff(a,b,c,d,s[i+4],7,-176418897); d=ff(d,a,b,c,s[i+5],12,1200080426); c=ff(c,d,a,b,s[i+6],17,-1473231341); b=ff(b,c,d,a,s[i+7],22,-45705983);
    a=ff(a,b,c,d,s[i+8],7,1770035416); d=ff(d,a,b,c,s[i+9],12,-1958414417); c=ff(c,d,a,b,s[i+10],17,-42063); b=ff(b,c,d,a,s[i+11],22,-1990404162);
    a=ff(a,b,c,d,s[i+12],7,1804603682); d=ff(d,a,b,c,s[i+13],12,-40341101); c=ff(c,d,a,b,s[i+14],17,-1502002290); b=ff(b,c,d,a,s[i+15],22,1236535329);
    a=gg(a,b,c,d,s[i+1],5,-165796510); d=gg(d,a,b,c,s[i+6],9,-1069501632); c=gg(c,d,a,b,s[i+11],14,643717713); b=gg(b,c,d,a,s[i],20,-373897302);
    a=gg(a,b,c,d,s[i+5],5,-701558691); d=gg(d,a,b,c,s[i+10],9,38016083); c=gg(c,d,a,b,s[i+15],14,-660478335); b=gg(b,c,d,a,s[i+4],20,-405537848);
    a=gg(a,b,c,d,s[i+9],5,568446438); d=gg(d,a,b,c,s[i+14],9,-1019803690); c=gg(c,d,a,b,s[i+3],14,-187363961); b=gg(b,c,d,a,s[i+8],20,1163531501);
    a=gg(a,b,c,d,s[i+13],5,-1444681467); d=gg(d,a,b,c,s[i+2],9,-51403784); c=gg(c,d,a,b,s[i+7],14,1735328473); b=gg(b,c,d,a,s[i+12],20,-1926607734);
    a=hh(a,b,c,d,s[i+5],4,-378558); d=hh(d,a,b,c,s[i+8],11,-2022574463); c=hh(c,d,a,b,s[i+11],16,1839030562); b=hh(b,c,d,a,s[i+14],23,-35309556);
    a=hh(a,b,c,d,s[i+1],4,-1530992060); d=hh(d,a,b,c,s[i+4],11,1272893353); c=hh(c,d,a,b,s[i+7],16,-155497632); b=hh(b,c,d,a,s[i+10],23,-1094730640);
    a=hh(a,b,c,d,s[i+13],4,681279174); d=hh(d,a,b,c,s[i],11,-358537222); c=hh(c,d,a,b,s[i+3],16,-722521979); b=hh(b,c,d,a,s[i+6],23,76029189);
    a=hh(a,b,c,d,s[i+9],4,-640364487); d=hh(d,a,b,c,s[i+12],11,-421815835); c=hh(c,d,a,b,s[i+15],16,530742520); b=hh(b,c,d,a,s[i+2],23,-995338651);
    a=ii(a,b,c,d,s[i],6,-198630844); d=ii(d,a,b,c,s[i+7],10,1126891415); c=ii(c,d,a,b,s[i+14],15,-1416354905); b=ii(b,c,d,a,s[i+5],21,-57434055);
    a=ii(a,b,c,d,s[i+12],6,1700485571); d=ii(d,a,b,c,s[i+3],10,-1894986606); c=ii(c,d,a,b,s[i+10],15,-1051523); b=ii(b,c,d,a,s[i+1],21,-2054922799);
    a=ii(a,b,c,d,s[i+8],6,1873313359); d=ii(d,a,b,c,s[i+15],10,-30611744); c=ii(c,d,a,b,s[i+6],15,-1560198380); b=ii(b,c,d,a,s[i+13],21,1309151649);
    a=ii(a,b,c,d,s[i+4],6,-145523070); d=ii(d,a,b,c,s[i+11],10,-1120210379); c=ii(c,d,a,b,s[i+2],15,718787259); b=ii(b,c,d,a,s[i+9],21,-343485551);
    a=(a+A)&0xFFFFFFFF; b=(b+B)&0xFFFFFFFF; c=(c+C)&0xFFFFFFFF; d=(d+D)&0xFFFFFFFF;
  }
  return [a, b, c, d]
    .map(v => Array.from({ length: 4 }, (_, i) => ((v >>> (i * 8)) & 0xFF).toString(16).padStart(2, "0")).join(""))
    .join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "", sha512: "" });

  useEffect(() => {
    if (!input) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      return;
    }
    const md5val = md5(input);
    Promise.all([
      sha("SHA-1", input),
      sha("SHA-256", input),
      sha("SHA-512", input),
    ]).then(([sha1, sha256, sha512]) => {
      setHashes({ md5: md5val, sha1, sha256, sha512 });
    });
  }, [input]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setInput(ev.target?.result as string ?? "");
    reader.readAsText(file);
  };

  return (
    <ToolShell title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or file input." category={cat}>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">Input Text</label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={5}
          placeholder="Enter text to hash..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-4">{input.length} characters</p>
          <label className="cursor-pointer text-xs font-medium text-blue hover:underline">
            Or upload a file
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>

      {input && (
        <div className="space-y-3">
          {[
            { label: "MD5", value: hashes.md5 },
            { label: "SHA-1", value: hashes.sha1 },
            { label: "SHA-256", value: hashes.sha256 },
            { label: "SHA-512", value: hashes.sha512 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface border border-border p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text-4 uppercase tracking-wider">{label}</span>
                {value && <CopyButton text={value} />}
              </div>
              <div className="font-mono text-sm text-text break-all">
                {value || <span className="text-text-4 italic">Computing…</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
