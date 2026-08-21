import re

with open("src/features/markdown/components/MarkdownEditor.tsx", "r") as f:
    content = f.read()

# Add MermaidExporter import
if "MermaidExporter" not in content:
    content = content.replace('import { SAMPLE_MARKDOWN } from "../constants";', 'import { SAMPLE_MARKDOWN } from "../constants";\nimport { MermaidExporter } from "../mermaid/MermaidExporter";')

# Replace the manual svg to img logic
pattern = r'        // Convert Mermaid SVGs to img tags to preserve foreignObject in html2canvas.*?        const allElements = \[clone, \.\.\.Array\.from\(clone\.querySelectorAll\("\*"\)\)\];'

replace_with = '''        // Utilize specialized MermaidExporter to convert all complex SVG diagrams to Raster PNGs
        await MermaidExporter.prepareForPdf(clone, 2);

        const allElements = [clone, ...Array.from(clone.querySelectorAll("*"))];'''

new_content = re.sub(pattern, replace_with, content, flags=re.DOTALL)
if new_content != content:
    with open("src/features/markdown/components/MarkdownEditor.tsx", "w") as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Pattern not found")
