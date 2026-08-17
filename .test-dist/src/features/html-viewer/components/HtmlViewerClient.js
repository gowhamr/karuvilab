"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback, useId } from "react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import LZString from "lz-string";
import { Download, Share2, Plus, Laptop, Tablet, Smartphone, Terminal, Trash2, Copy, Check, Upload, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useToast } from "@/components/ui/Toast";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EngineLoader } from "@/components/system/EngineLoader";
import { sanitizeHtml } from "@/src/lib/security";
import { DropZone } from "@/components/ui/DropZone";
import { logger } from "@/src/lib/logger";
import { CdnOverlay } from "./CdnOverlay";
import { ConsoleDrawer } from "./ConsoleDrawer";
const DEFAULT_CODE = {
    html: `<!-- Professional HTML Online Viewer -->\n<div class="container">\n  <h1>Hello, KaruviLab!</h1>\n  <p>Start editing to see real-time changes.</p>\n  <button id="action-btn">Click Me</button>\n</div>`,
    css: `/* Add your styles here */\n.container {\n  padding: 2rem;\n  text-align: center;\n  font-family: system-ui, -apple-system, sans-serif;\n  background: #f0f4ff;\n  border-radius: 20px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n}\n\nh1 { color: #4F46E5; margin-bottom: 1rem; }\n\nbutton {\n  padding: 0.8rem 1.5rem;\n  background: #4F46E5;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  cursor: pointer;\n  font-weight: bold;\n  transition: transform 0.2s;\n}\n\nbutton:hover { transform: scale(1.05); }`,
    js: `// Add your interactivity here\nconst btn = document.getElementById('action-btn');\n\nbtn.addEventListener('click', () => {\n  btn.textContent = 'Clicked!';\n  btn.style.background = '#059669';\n});`
};
const DEVICE_SIZES = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
    "mobile-xs": "320px"
};
// ── Main Component ───────────────────────────────────────────────────────────
export default function HtmlViewerClient() {
    const cdnInputId = useId();
    const searchParams = useSearchParams();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const { toast } = useToast();
    // State
    const [html, setHtml] = useState(DEFAULT_CODE.html);
    const [css, setCss] = useState(DEFAULT_CODE.css);
    const [js, setJs] = useState(DEFAULT_CODE.js);
    const [activeTab, setActiveTab] = useState("html");
    const [device, setDevice] = useState("desktop");
    const [logs, setLogs] = useState([]);
    const [cdns, setCdns] = useState([]);
    const [newCdn, setNewCdn] = useState("");
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);
    const [isCdnOpen, setIsCdnOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const debouncedHtml = useDebounce(html, 500);
    const debouncedCss = useDebounce(css, 500);
    const debouncedJs = useDebounce(js, 500);
    const debouncedCdns = useDebounce(cdns, 500);
    const iframeRef = useRef(null);
    const logIdRef = useRef(0);
    // Initialize Monaco Engine
    useEffect(() => {
        const isGithubPages = window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/karuvilab');
        const basePath = isGithubPages ? '/karuvilab' : '';
        const localMonacoPath = `${basePath}/lib/monaco/vs`;
        import("@monaco-editor/react").then(({ loader }) => {
            loader.config({ paths: { vs: localMonacoPath } });
            loader.init().then(monacoInstance => {
                window.monaco = monacoInstance;
            }).catch(() => {
                loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' } });
                loader.init().then(monacoInstance => {
                    window.monaco = monacoInstance;
                });
            });
        });
    }, []);
    // Load from URL or LocalStorage
    useEffect(() => {
        const codeParam = searchParams.get("code");
        if (codeParam) {
            try {
                const decoded = JSON.parse(LZString.decompressFromEncodedURIComponent(codeParam));
                Promise.resolve().then(() => {
                    setHtml(decoded.html || "");
                    setCss(decoded.css || "");
                    setJs(decoded.js || "");
                    if (decoded.cdns)
                        setCdns(decoded.cdns);
                });
            }
            catch (e) {
                logger.error("Failed to parse code from URL", { error: e });
            }
        }
        else {
            const saved = localStorage.getItem("karuvi-html-viewer");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    Promise.resolve().then(() => {
                        setHtml(parsed.html || DEFAULT_CODE.html);
                        setCss(parsed.css || DEFAULT_CODE.css);
                        setJs(parsed.js || DEFAULT_CODE.js);
                        if (parsed.cdns)
                            setCdns(parsed.cdns);
                    });
                }
                catch { }
            }
        }
    }, [searchParams]);
    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("karuvi-html-viewer", JSON.stringify({ html, css, js, cdns }));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [html, css, js, cdns]);
    // Handle Logs from Iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin && event.origin !== "null")
                return;
            if (iframeRef.current && event.source !== iframeRef.current.contentWindow)
                return;
            if (event.data.source === "karuvi-sandbox") {
                const { type, payload } = event.data;
                setLogs(prev => [...prev, {
                        type,
                        content: payload.map((p) => typeof p === 'object' ? JSON.stringify(p) : String(p)).join(" "),
                        id: ++logIdRef.current
                    }].slice(-50));
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);
    const getCompiledDoc = useCallback(() => {
        const cssLinks = cdns.filter(url => url.endsWith(".css")).map(url => `<link rel="stylesheet" href="${url}">`).join("\n");
        const jsLinks = cdns.filter(url => !url.endsWith(".css")).map(url => `<script src="${url}"></script>`).join("\n");
        const sanitizedHtml = sanitizeHtml(html);
        const sanitizedCss = sanitizeHtml(css);
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${cssLinks}
          <style>${sanitizedCss}</style>
          <script>
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            const sendToParent = (type, args) => {
              window.parent.postMessage({ source: 'karuvi-sandbox', type, payload: Array.from(args) }, '${typeof window !== "undefined" ? window.location.origin : "*"}');
            };
            console.log = (...args) => { sendToParent('log', args); originalLog(...args); };
            console.error = (...args) => { sendToParent('error', args); originalError(...args); };
            console.warn = (...args) => { sendToParent('warn', args); originalWarn(...args); };
            console.info = (...args) => { sendToParent('info', args); originalInfo(...args); };
            window.onerror = (msg, url, line, col, error) => { sendToParent('error', [msg + ' (line ' + line + ')']); return false; };
          </script>
        </head>
        <body>
          ${sanitizedHtml}
          ${jsLinks}
          <script>${js}</script>
        </body>
      </html>
    `;
    }, [html, css, js, cdns]);
    const updatePreview = useCallback(() => {
        if (iframeRef.current) {
            setLogs([]);
            iframeRef.current.srcdoc = getCompiledDoc();
        }
    }, [getCompiledDoc]);
    useEffect(() => {
        updatePreview();
    }, [debouncedHtml, debouncedCss, debouncedJs, debouncedCdns, updatePreview]);
    const handleShare = () => {
        const code = LZString.compressToEncodedURIComponent(JSON.stringify({ html, css, js, cdns }));
        const url = `${window.location.origin}${window.location.pathname}?code=${code}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleCopyCode = () => {
        const code = activeTab === "html" ? html : activeTab === "css" ? css : js;
        navigator.clipboard.writeText(code);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };
    const handleClear = () => {
        if (activeTab === "html")
            setHtml("");
        else if (activeTab === "css")
            setCss("");
        else
            setJs("");
    };
    const handleDownload = () => {
        const blob = new Blob([getCompiledDoc()], { type: "text/html" });
        const url = createUrl(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "karuvilab-project.html";
        a.click();
        revokeUrl(url);
    };
    const addCdn = () => {
        if (newCdn && !cdns.includes(newCdn)) {
            setCdns([...cdns, newCdn]);
            setNewCdn("");
        }
    };
    const removeCdn = (url) => {
        setCdns(cdns.filter(c => c !== url));
    };
    const handleFiles = (files) => {
        const file = files instanceof FileList ? files[0] : files[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast("File exceeds 5MB limit.", "error");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (file.name.endsWith(".html")) {
                setHtml(content);
                setActiveTab("html");
            }
            else if (file.name.endsWith(".css")) {
                setCss(content);
                setActiveTab("css");
            }
            else if (file.name.endsWith(".js")) {
                setJs(content);
                setActiveTab("js");
            }
        };
        reader.readAsText(file);
    };
    const checkMonaco = useCallback(() => !!window.monaco, []);
    return (_jsxs("div", { className: cn("relative flex flex-col lg:flex-row h-tool-viewport min-h-full border border-border dark:border-white/5 rounded-3xl overflow-hidden bg-surface dark:bg-black/20 premium-card-shadow transition-all duration-500", isFullscreen && "fixed inset-0 z-dropdown h-screen w-screen rounded-none m-0"), children: [_jsxs("div", { className: "flex-1 flex flex-col min-w-0 border-r border-border dark:border-white/5", children: [_jsxs("div", { className: "h-14 flex items-center justify-between px-4 bg-bg dark:bg-white/5 border-b border-border dark:border-white/5", children: [_jsx("div", { className: "flex gap-1", children: ["html", "css", "js"].map(t => (_jsx("button", { onClick: () => setActiveTab(t), "aria-label": `Switch to ${t.toUpperCase()} editor`, className: cn("px-4 py-2 rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all", activeTab === t ? "bg-blue text-white neon-glow" : "text-text-4 hover:bg-blue/5 hover:text-blue"), children: t }, t))) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DropZone, { onFilesSelected: handleFiles, accept: ".html,.css,.js", title: "Import", description: "", className: "p-1 border-none bg-transparent hover:bg-blue/5 rounded-lg", icon: _jsx(Upload, { className: "w-4 h-4 text-text-4" }) }), _jsx("button", { onClick: handleCopyCode, "aria-label": "Copy code", className: "p-2 text-text-4 hover:bg-blue/5 hover:text-blue rounded-lg transition-colors", title: "Copy Code", children: codeCopied ? _jsx(Check, { className: "w-4 h-4 text-green-500" }) : _jsx(Copy, { className: "w-4 h-4" }) }), _jsx("button", { onClick: handleClear, "aria-label": "Clear code", className: "p-2 text-text-4 hover:bg-blue/5 hover:text-red-500 rounded-lg transition-colors", title: "Clear Editor", children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsx("div", { className: "w-px h-4 bg-border mx-1" }), _jsx("button", { onClick: () => setIsCdnOpen(!isCdnOpen), "aria-label": "Open libraries", className: cn("p-2 rounded-lg transition-colors", isCdnOpen ? "text-blue bg-blue/10" : "text-text-4 hover:bg-blue/5 hover:text-blue"), title: "External Libraries", children: _jsx(Plus, { className: "w-4 h-4" }) }), _jsx("button", { onClick: handleShare, "aria-label": "Share project", className: "p-2 text-text-4 hover:bg-blue/5 hover:text-blue rounded-lg transition-colors", title: "Copy Share Link", children: copied ? _jsx(Check, { className: "w-4 h-4 text-green-500" }) : _jsx(Share2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex-1 overflow-hidden relative", children: [isMobile ? (_jsx("textarea", { className: "w-full h-full p-6 bg-mat-base text-text-2 font-mono text-sm outline-none resize-none", value: activeTab === "html" ? html : activeTab === "css" ? css : js, onChange: (e) => {
                                    const v = e.target.value;
                                    if (activeTab === "html")
                                        setHtml(v);
                                    else if (activeTab === "css")
                                        setCss(v);
                                    else
                                        setJs(v);
                                }, placeholder: `Enter ${activeTab.toUpperCase()} code...` })) : (_jsx(EngineLoader, { checkInit: checkMonaco, loadingMessage: "Initializing Monaco Editor...", errorMessage: "Failed to load editor engine. Check your connection or retry.", children: _jsx(Editor, { theme: "vs-dark", language: activeTab === "js" ? "javascript" : activeTab, value: activeTab === "html" ? html : activeTab === "css" ? css : js, onChange: (v) => {
                                        if (activeTab === "html")
                                            setHtml(v || "");
                                        else if (activeTab === "css")
                                            setCss(v || "");
                                        else
                                            setJs(v || "");
                                    }, options: { minimap: { enabled: false }, fontSize: 14, fontFamily: "JetBrains Mono, monospace", padding: { top: 20 }, lineNumbers: "on", roundedSelection: true, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2 } }) })), _jsx(CdnOverlay, { isOpen: isCdnOpen, onClose: () => setIsCdnOpen(false), inputId: cdnInputId, newCdn: newCdn, setNewCdn: setNewCdn, onAddCdn: addCdn, cdns: cdns, onRemoveCdn: removeCdn, onAddPreset: (url) => !cdns.includes(url) && setCdns([...cdns, url]) })] })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 bg-bg dark:bg-white/[0.02]", children: [_jsxs("div", { className: "h-14 flex items-center justify-between px-4 bg-bg dark:bg-white/5 border-b border-border dark:border-white/5 overflow-x-auto no-scrollbar", children: [_jsx(SegmentedControl, { activeId: device, onChange: (id) => setDevice(id), options: [{ id: "desktop", label: "Desktop", icon: _jsx(Laptop, { size: 14 }) }, { id: "tablet", label: "Tablet", icon: _jsx(Tablet, { size: 14 }) }, { id: "mobile", label: "Mobile", icon: _jsx(Smartphone, { size: 14 }) }, { id: "mobile-xs", label: "Mobile XS", icon: _jsx(Smartphone, { size: 14 }) }] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: handleDownload, "aria-label": "Download project", className: "flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-tiny font-bold uppercase tracking-widest-sm text-text-4 hover:border-blue/30 hover:text-blue transition-all", children: [_jsx(Download, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "hidden sm:inline", children: "Export" })] }), _jsx("button", { onClick: () => setIsFullscreen(!isFullscreen), "aria-label": "Toggle fullscreen", className: "p-2 text-text-4 hover:text-blue", children: isFullscreen ? _jsx(Minimize2, { className: "w-4 h-4" }) : _jsx(Maximize2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex-1 overflow-hidden p-4 md:p-8 flex items-center justify-center relative", children: [_jsx("div", { className: "h-full bg-white rounded-xl shadow-2xl transition-all duration-500 overflow-hidden relative", style: { width: DEVICE_SIZES[device] }, children: _jsx("iframe", { ref: iframeRef, title: "Sandbox Preview", className: "w-full h-full border-none", sandbox: "allow-scripts" }) }), _jsxs("button", { onClick: () => setIsConsoleOpen(!isConsoleOpen), "aria-label": "Toggle console", className: cn("absolute bottom-6 right-6 p-3 rounded-2xl shadow-xl transition-all flex items-center gap-2", isConsoleOpen ? "bg-red-500 text-white" : "bg-surface border border-border text-text-2 hover:border-blue"), children: [_jsx(Terminal, { className: "w-4 h-4" }), _jsxs("span", { className: "text-tiny font-bold uppercase tracking-widest-sm", children: ["Console ", logs.length > 0 && `(${logs.length})`] }), isConsoleOpen ? _jsx(ChevronDown, { className: "w-3 h-3" }) : _jsx(ChevronUp, { className: "w-3 h-3" })] }), _jsx(ConsoleDrawer, { isOpen: isConsoleOpen, logs: logs, onClear: () => setLogs([]) })] })] })] }));
}
