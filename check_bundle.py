import json

with open("package.json") as f:
    pkg = json.load(f)
deps = list(pkg.get("dependencies", {}).keys())

with open("docs/decisions/BUNDLE_DECISIONS.md") as f:
    content = f.read()

core_stack = [
    "next", "react", "react-dom", "zustand", "comlink", "framer-motion",
    "dompurify", "pdf-lib", "terser", "fflate", "date-fns"
]

missing = []
for dep in deps:
    if dep not in content and dep not in core_stack:
        missing.append(dep)

print("Missing from BUNDLE_DECISIONS.md:")
for m in sorted(missing):
    print(f"- {m}")
