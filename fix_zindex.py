import os
import re

files_to_fix = [
    "app/(tools)/image-tools/aspect-ratio-converter/AspectRatioConverterClient.tsx",
    "app/(tools)/image-tools/bmp-converter/BmpConverterClient.tsx",
    "app/(tools)/image-tools/canvas-resize/CanvasResizeClient.tsx",
    "app/(tools)/image-tools/gif-extractor/GifExtractorClient.tsx",
    "app/(tools)/image-tools/heic-converter/HeicConverterClient.tsx",
    "app/(tools)/image-tools/image-mirror/ImageMirrorClient.tsx",
    "app/(tools)/image-tools/svg-converter/SvgConverterClient.tsx",
    "app/(tools)/image-tools/webp-converter/WebPConverterClient.tsx",
    "app/(tools)/productivity/typing-speed-test/TypingSpeedTestClient.tsx",
    "src/features/advanced-pdf-editor/components/PdfOrganizer.tsx",
    "src/features/basic-pdf-editor/components/BasicPdfEditor.tsx"
]

replacements = {
    r'\bz-10\b': 'z-content',
    r'\bz-20\b': 'z-above',
    r'\bz-30\b': 'z-sidebar',
    r'\bz-40\b': 'z-header',
    r'\bz-50\b': 'z-dropdown'
}

for file_path in files_to_fix:
    full_path = os.path.join("/root/karuvilab", file_path)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
            
        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content)
            
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Fixed {file_path}")
    else:
        print(f"File not found {file_path}")
