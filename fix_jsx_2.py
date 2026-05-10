import os
import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Pattern to match the broken return statement
    pattern = r'  return \(\s*\n\s*\n(.*?)\n\s*\n\s*\);'
    new_content = re.sub(pattern, r'  return (\n    <div className="space-y-6">\n\1\n    </div>\n  );', content, flags=re.DOTALL)
    
    # Remove unused ToolShell import
    new_content = re.sub(r'import \{ ToolShell \} from "@/components/ui/ToolShell";\n?', '', new_content)
    
    # Remove unused cat constant
    new_content = re.sub(r'const cat = CATEGORIES\.find\(c => c\.id === ".*?"\)!;\n?', '', new_content)
    new_content = re.sub(r'const cat = CATEGORIES\.find\(\(c\) => c\.id === ".*?"\)!;\n?', '', new_content)

    if new_content != content:
        with open(path, 'w') as f:
            f.write(new_content)
        return True
    return False

# List of all *Client.tsx files in app/(tools)
import glob
files_to_fix = glob.glob('app/(tools)/**/*Client.tsx', recursive=True)

base_dir = "/data/data/com.termux/files/home/karuvilab"
fixed_count = 0
for f in files_to_fix:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        if fix_file(path):
            print(f"Fixed/Cleaned {f}")
            fixed_count += 1

print(f"Total fixed/cleaned: {fixed_count}")
