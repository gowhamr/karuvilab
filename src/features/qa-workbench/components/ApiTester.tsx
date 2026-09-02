"use client";

import React, { useState } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { configureMonacoLoader } from "@/src/core/monaco/MonacoLoader";
configureMonacoLoader();

export function ApiTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("{\n  \"Accept\": \"application/json\"\n}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLanguage = React.useMemo(() => {
    try {
      const parsed = JSON.parse(headers);
      const ct = (parsed["Content-Type"] || parsed["content-type"] || "").toLowerCase();
      if (ct.includes("xml")) return "xml";
      if (ct.includes("html")) return "html";
      if (ct.includes("css")) return "css";
      if (ct.includes("javascript")) return "javascript";
      if (ct.includes("json")) return "json";
    } catch (e) {}
    return "text";
  }, [headers]);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }
      
      const startTime = performance.now();
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        ...((["GET", "HEAD"].includes(method) || !body) ? {} : { body })
      });
      const endTime = performance.now();
      
      const responseData = await res.text();
      let parsedData = responseData;
      try {
        parsedData = JSON.parse(responseData);
      } catch (e) {
        // Not JSON, leave as text
      }
      
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: Math.round(endTime - startTime),
        headers: resHeaders,
        data: parsedData
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch. CORS issue or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <select 
          value={method} 
          onChange={e => setMethod(e.target.value)}
          className="px-4 py-3 bg-bg border border-border rounded-xl font-bold text-text-2 w-full md:w-32 focus:ring-1 focus:ring-blue focus:outline-none"
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input 
          type="url" 
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text focus:ring-1 focus:ring-blue focus:outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !url}
          className="px-6 py-3 bg-blue text-white font-bold tracking-wide rounded-xl flex items-center justify-center gap-2 hover:bg-blue/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
          SEND
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="border border-border rounded-2xl overflow-hidden bg-bg">
            <div className="bg-surface border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-4">
              Headers (JSON)
            </div>
            <div className="h-32">
              <Editor
                height="100%"
                path="kv://api/request-headers.json"
                language="json"
                theme="karuvi-dark"
                value={headers}
                onChange={(val) => setHeaders(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
              />
            </div>
          </div>
          
          <div className="border border-border rounded-2xl overflow-hidden bg-bg">
            <div className="bg-surface border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-4">
              Request Body
            </div>
            <div className="h-64">
              <Editor
                height="100%"
                path="kv://api/request-body.json"
                language={requestLanguage}
                theme="karuvi-dark"
                value={body}
                onChange={(val) => setBody(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
              />
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-2xl overflow-hidden bg-bg flex flex-col h-full min-h-[400px]">
          <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-text-4">Response</span>
            {response && (
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className={response.status < 400 ? "text-success" : "text-error"}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-text-4">{response.time} ms</span>
              </div>
            )}
          </div>
          <div className="flex-1 relative bg-surface-2 p-4">
            {error && (
              <div className="absolute inset-4 bg-error/10 border border-error/20 rounded-xl p-4 flex flex-col items-center justify-center text-center text-error">
                <AlertCircle size={32} className="mb-2 opacity-80" />
                <h3 className="font-bold text-lg mb-1">Request Failed</h3>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            )}
            
            {response && !error && (
              <div className="h-full absolute inset-0">
                <Editor
                  height="100%"
                  path="kv://api/response.json"
                  language={
                    response.headers["content-type"]?.includes("application/xml") || response.headers["content-type"]?.includes("text/xml") ? "xml" :
                    response.headers["content-type"]?.includes("text/html") ? "html" :
                    response.headers["content-type"]?.includes("text/css") ? "css" :
                    response.headers["content-type"]?.includes("application/javascript") ? "javascript" :
                    (typeof response.data === "object" || response.headers["content-type"]?.includes("application/json")) ? "json" : "text"
                  }
                  theme="karuvi-dark"
                  value={typeof response.data === "object" ? JSON.stringify(response.data, null, 2) : response.data}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, wordWrap: "on" }}
                />
              </div>
            )}
            
            {!response && !error && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-text-4 text-sm">
                Enter URL and click send to see response.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
