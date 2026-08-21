import re

with open("src/features/markdown/mermaid/MermaidExporter.ts", "r") as f:
    content = f.read()

content = re.sub(r'logger\.error\(.*?,\s*\{ error: e \}\);', r"logger.error('Failed to convert SVG to Data URL', { error: e });", content, count=1)
content = re.sub(r'logger\.error\(.*?,\s*\{ error: e \}\);', r"logger.error('SVG Rasterization failed to load image', { error: e });", content, count=1)
content = re.sub(r'logger\.warn\(.*?,\s*\{ error: e \}\);', r"logger.warn('Failed to rasterize Mermaid diagram for PDF', { error: e });", content, count=1)

with open("src/features/markdown/mermaid/MermaidExporter.ts", "w") as f:
    f.write(content)
