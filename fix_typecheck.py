import re

with open("src/features/markdown/mermaid/MermaidExporter.ts", "r") as f:
    content = f.read()

# Fix 1: logger.warn href error
content = content.replace("logger.warn('Failed to inline external SVG image for export', { href, error: e });", "logger.warn('Failed to inline external SVG image for export', { error: e });")

# Fix 2: Type 'SVGStyleElement' is missing properties from 'HTMLStyleElement'
content = content.replace("let styleEl: HTMLStyleElement | null = svgClone.querySelector('style');", "let styleEl: SVGStyleElement | HTMLStyleElement | null = svgClone.querySelector('style');")
content = content.replace("styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');", "styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style') as unknown as SVGStyleElement;")
content = content.replace("svgClone.insertBefore(styleEl, svgClone.firstChild);", "svgClone.insertBefore(styleEl as unknown as Node, svgClone.firstChild);")

# Fix 3: 'styleEl' is possibly 'null'
content = content.replace("styleEl.textContent = (styleEl.textContent || '') + '\\n' + defaultTypography;", "if (styleEl) { styleEl.textContent = (styleEl.textContent || '') + '\\n' + defaultTypography; }")

with open("src/features/markdown/mermaid/MermaidExporter.ts", "w") as f:
    f.write(content)
