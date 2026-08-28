"use client";
import { useState, useMemo } from "react";
import { Code } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { DecodedJWT } from "../utils";

interface ApiSnippetsProps {
  decoded: DecodedJWT;
}

export function ApiSnippets({ decoded }: ApiSnippetsProps) {
  const [snippetLang, setSnippetLang] = useState<"curl" | "js" | "node" | "python" | "go" | "java" | "csharp">("curl");

  const codeSnippets = useMemo(() => {
    const jwt = decoded.raw;
    return {
      curl: `curl -X GET "https://api.example.com/data" \\\n  -H "Authorization: Bearer ${jwt}" \\\n  -H "Accept: application/json"`,
      js: `fetch("https://api.example.com/data", {\n  headers: {\n    "Authorization": "Bearer ${jwt}"\n  }\n}).then(res => res.json());`,
      node: `const axios = require('axios');\n\naxios.get('https://api.example.com/data', {\n  headers: { 'Authorization': 'Bearer ${jwt}' }\n});`,
      python: `import requests\n\nheaders = {"Authorization": "Bearer ${jwt}"}\nresponse = requests.get("https://api.example.com/data", headers=headers)`,
      go: `req, _ := http.NewRequest("GET", "https://api.example.com/data", nil)\nreq.Header.Set("Authorization", "Bearer ${jwt}")`,
      java: `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.example.com/data"))\n    .header("Authorization", "Bearer ${jwt}")\n    .GET().build();`,
      csharp: `var client = new HttpClient();\nclient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${jwt}");`
    };
  }, [decoded]);

  return (
    <section aria-labelledby="snippets-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="snippets-heading" className="text-sm font-bold text-text flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-500" aria-hidden="true" /> API Request Snippets
        </h3>
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Code Snippet Languages">
          {(["curl", "js", "node", "python", "go", "java", "csharp"] as const).map(lang => (
            <button
              key={lang}
              role="tab"
              aria-selected={snippetLang === lang}
              onClick={() => setSnippetLang(lang)}
              className={`min-h-[44px] md:min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                snippetLang === lang 
                  ? "bg-blue text-white shadow-sm" 
                  : "bg-bg text-text-muted hover:text-text border border-border"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <pre className="p-4 rounded-2xl bg-bg border border-border font-mono text-xs text-amber-600 dark:text-amber-400 leading-relaxed overflow-x-auto">
          {codeSnippets[snippetLang]}
        </pre>
        <div className="absolute top-3 right-3">
          <CopyButton text={codeSnippets[snippetLang] || ""} aria-label={`Copy ${snippetLang} snippet`} />
        </div>
      </div>
    </section>
  );
}
