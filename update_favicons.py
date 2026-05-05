import os
import re

standard_favicons = [
    '  <link rel="icon" href="/favicon.ico" sizes="any" />',
    '  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />',
    '  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />',
    '  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />'
]

def update_favicons(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if all standard favicons are present
    missing = []
    for line in standard_favicons:
        # Simplified check: just see if the href is there
        href = re.search(r'href="([^"]+)"', line).group(1)
        if href not in content:
            missing.append(line)

    if not missing:
        return False

    # Find a good place to insert: after <title> or after last <meta>
    # If some favicons are already present, we might want to replace them or add near them.
    
    # Let's remove any existing partial favicon tags to avoid duplicates and ensure standard set
    # This is a bit risky but cleaner.
    # Patterns to match any of the standard favicon tags or similar
    patterns = [
        r'<link rel="icon" [^>]*href="/favicon\.ico"[^>]*>',
        r'<link rel="icon" [^>]*href="/icons/icon\.svg"[^>]*>',
        r'<link rel="icon" [^>]*href="/icons/icon-32\.png"[^>]*>',
        r'<link rel="apple-touch-icon" [^>]*href="/icons/icon-180\.png"[^>]*>'
    ]
    
    new_content = content
    for p in patterns:
        new_content = re.sub(p, '', new_content)
    
    # Remove empty lines that might have been left
    new_content = re.sub(r'\n\s*\n\s*<link', '\n  <link', new_content)

    # Insert the full standard set
    favicon_block = '\n'.join(standard_favicons)
    
    if '<title>' in new_content:
        new_content = re.sub(r'(</title>)', r'\1\n' + favicon_block, new_content)
    elif '<head>' in new_content:
        new_content = re.sub(r'(<head>)', r'\1\n' + favicon_block, new_content)
    else:
        # Should not happen for valid HTML
        return False

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

directories = ['tools', 'calculators', 'image-tools', 'pdf-tools']
updated_count = 0
for root_dir in directories:
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                if update_favicons(path):
                    print(f"Updated {path}")
                    updated_count += 1

print(f"Total updated: {updated_count}")
