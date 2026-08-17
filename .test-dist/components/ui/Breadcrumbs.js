import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
export function Breadcrumbs({ category, title }) {
    const showTitle = Boolean(title && title.toLowerCase() !== category?.label.toLowerCase());
    return (_jsxs("nav", { "aria-label": "Breadcrumb", className: "flex flex-wrap items-center gap-2 text-tiny font-bold uppercase tracking-widest-md text-text-4 mb-6", children: [_jsx(Link, { href: "/", "aria-label": "KV Home", className: "hover:text-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm", children: "Home" }), category && (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", children: "/" }), _jsx(Link, { href: category.href, className: "hover:text-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm", children: category.label })] })), showTitle && (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", children: "/" }), _jsx("span", { "aria-current": "page", className: "text-text-2 truncate max-w-[200px] sm:max-w-xs", children: title })] }))] }));
}
