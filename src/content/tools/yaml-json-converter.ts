import { ToolContent } from '../../registry/types';

export const yamlJsonConverter: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: YAML Architecture & Deserialization Attacks

Welcome to the engineering guide to YAML (YAML Ain't Markup Language). This handbook explains why DevOps engineers love it, why security engineers fear it, and the notorious "Norway Problem."

---

## 1. Prerequisites: The Rise of YAML

As JSON replaced XML for APIs, engineers realized a problem: JSON is terrible for configuration files.
JSON requires strict double-quotes around every key, bans trailing commas, and completely forbids comments (you cannot explain *why* a configuration setting exists). 

**The Solution:** YAML.
YAML relies on **indentation** (Python-style) instead of curly braces \`{}\`. It removes the need for quotes and natively supports \`# comments\`. 

*(Fun Fact: Every valid JSON file is technically also a perfectly valid YAML 1.2 file! The parser will read it identically).*

---

## 2. Engineering Challenge: The "Norway Problem"

YAML was designed to be "smart" and automatically infer data types without quotes. This led to one of the most famous bugs in software engineering.

In YAML, the strings \`true\`, \`false\`, \`on\`, \`off\`, \`yes\`, and \`no\` are automatically converted into Boolean values.

**The Bug:**
Imagine a DevOps engineer configuring a list of server countries:
\`\`\`yaml
countries:
  - GB
  - US
  - NO
\`\`\`

When the YAML parser converts this into JSON, the result is:
\`\`\`json
{ "countries": ["GB", "US", false] }
\`\`\`
The parser saw \`NO\` (the country code for Norway) and assumed it was the boolean \`false\`. This bug crashed thousands of applications worldwide. 

**The Fix:** You must explicitly wrap ambiguous strings in quotes in YAML (\`"NO"\`) to force the parser to treat them as strings.

---

## 3. Threat Model: YAML Deserialization Vulnerabilities

YAML is far more complex than JSON. It supports **Tags**, allowing you to instantiate arbitrary language-specific objects.

### The Attack
If a Python backend (using the default \`PyYAML\` library) accepts a YAML payload from a user, a hacker can submit this:

\`\`\`yaml
!!python/object/apply:os.system
args: ['cat /etc/passwd']
\`\`\`

**What happens?**
The parser sees the \`!!python\` tag and automatically executes the internal Python system command. The hacker has achieved **Remote Code Execution (RCE)** and completely compromised the server just by uploading a config file!

**The Mitigation:** Modern parsers must strictly use "Safe Load" functions (e.g., \`yaml.safe_load()\` in Python) which explicitly disable the execution of custom object tags.

---

## 4. JSON vs YAML: The Conversion Math

Converting JSON to YAML is mathematically trivial (JSON is a subset).
Converting YAML to JSON requires a complex state machine parser to:
1. Track indentation depth spaces (and throw errors on mismatched tabs vs spaces).
2. Resolve aliases and anchors (YAML allows you to define a variable \`&base\` and reuse it later with \`*base\`, keeping the file DRY. The JSON converter must expand these pointers).
3. Evaluate implicit type casting (The Norway Problem).

---

## 5. Production Workflows

- **Kubernetes (K8s) & Docker:** Almost all modern infrastructure-as-code is written in YAML. The lack of brackets makes 500-line deployment manifests significantly easier for DevOps engineers to read.
- **CI/CD Pipelines:** GitHub Actions and GitLab CI rely on YAML files to define step-by-step build instructions.

---

## 6. Interactive Quiz

**Beginner:**
1. Why do developers prefer YAML over JSON for configuration files? *(Answer: Because YAML supports comments, removes the visual clutter of curly braces and quotes, and is generally much easier for humans to read).*

**Intermediate:**
2. What is the "Norway Problem" in YAML? *(Answer: The string 'NO' (Norway's country code) is automatically evaluated by older YAML parsers as the boolean 'false', leading to catastrophic parsing bugs unless wrapped in quotes).*

**Advanced:**
3. Why is accepting arbitrary YAML payloads from users extremely dangerous? *(Answer: Because YAML supports custom Object Tags. If a backend uses an unsafe parser, a hacker can inject a payload that executes arbitrary system commands (RCE) during the deserialization process).*

---

`,
  howTo: [
    "**Step 1:** Select your conversion direction: YAML to JSON, or JSON to YAML.",
    "**Step 2:** Paste your payload into the editor.",
    "**Step 3:** The tool instantly runs a strict AST parser to convert the format, alerting you immediately to any indentation errors or syntax failures.",
    "**Step 4:** Copy the converted output."
  ],
  faq: [
    {
      question: "Are YAML Anchors supported?",
      answer: "Yes. If your YAML contains &anchors and *aliases, the tool will automatically resolve and expand them into flat JSON objects."
    },
    {
      question: "Why did my conversion fail with a formatting error?",
      answer: "YAML is highly sensitive to indentation. Mixing tabs and spaces, or misaligning a dash by a single space, will cause the strict parser to fail. Check your whitespace."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["JSON Formatter", "JSON to CSV"]
};
