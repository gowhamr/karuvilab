import re

with open("src/features/markdown/components/MarkdownEditor.tsx", "r") as f:
    content = f.read()

pattern = r'const allElements = \[clone, \.\.\.Array\.from\(clone\.querySelectorAll\("\*"\)\)\];'

replace_with = '''        // Convert Mermaid SVGs to img tags to preserve foreignObject in html2canvas
        const svgs = clone.querySelectorAll("svg");
        svgs.forEach((svg) => {
          try {
            // Set explicit width/height if not present
            const bbox = svg.getBoundingClientRect();
            if (!svg.getAttribute("width") && bbox.width) svg.setAttribute("width", bbox.width.toString());
            if (!svg.getAttribute("height") && bbox.height) svg.setAttribute("height", bbox.height.toString());
            
            const serializer = new XMLSerializer();
            let svgStr = serializer.serializeToString(svg);
            
            // Fix foreignObject namespaces
            svgStr = svgStr.replace(/<foreignObject/g, '<foreignObject xmlns="http://www.w3.org/1999/xhtml"');
            
            const encodedData = window.btoa(unescape(encodeURIComponent(svgStr)));
            const img = document.createElement("img");
            img.src = `data:image/svg+xml;base64,${encodedData}`;
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            
            if (svg.parentNode) {
              svg.parentNode.replaceChild(img, svg);
            }
          } catch (e) {
            console.error("Failed to convert SVG to Image for PDF", e);
          }
        });

        const allElements = [clone, ...Array.from(clone.querySelectorAll("*"))];'''

if pattern in content:
    content = content.replace(pattern, replace_with)
    with open("src/features/markdown/components/MarkdownEditor.tsx", "w") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Pattern not found")
