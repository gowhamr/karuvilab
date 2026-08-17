import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldCheck } from "lucide-react";
export function PrivacyBadge({ message = "Processed entirely in your browser", className = "" }) {
    return (_jsxs("div", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue/5 border border-blue/10 rounded-lg text-xs font-medium text-blue ${className}`, children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), _jsx("span", { children: message })] }));
}
