import { ToolContent } from '../../registry/types';

export const xmlFormatter: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: XML Architecture & XXE Vulnerabilities

Welcome to the engineering guide to XML (eXtensible Markup Language). This handbook explains the verbose, powerful data structure that ruled the early internet, and the catastrophic security flaw hidden inside its parsers.

---

## 1. Prerequisites: The Ancestor of JSON

Before JSON (JavaScript Object Notation) became the undisputed king of web APIs, developers used XML.
Unlike JSON, which is strictly designed to hold data structures (Arrays, Strings, Numbers), XML was designed to hold **Documents**.

- **The Good:** XML is incredibly strict. It supports Namespaces (preventing tag collisions between different datasets) and enforces rigid schemas (XSD), ensuring a payload exactly matches the required format before processing begins.
- **The Bad:** It is incredibly verbose. Storing a simple list of three users in XML requires nearly triple the bandwidth of JSON due to the repetitive opening and closing tags (e.g., \`<user><name>John</name></user>\`).

---

## 2. Core Concepts: Namespaces and CDATA

### Namespaces
If two companies merge their databases, Company A might use \`<table/>\` to describe database schemas, while Company B uses \`<table/>\` to describe furniture. To prevent crashes, XML uses namespaces:
\`<db:table>\` vs \`<furn:table>\`

### CDATA (Character Data)
If you need to store HTML code inside an XML tag, the XML parser will crash when it sees the \`<\` characters, thinking they are new XML tags.
To bypass this, developers wrap the data in a \`CDATA\` block:
\`<![CDATA[ <html><body>Hello</body></html> ]]>\`
The parser explicitly ignores everything inside the CDATA block.

---

## 3. Threat Model: The XXE Disaster

The most dangerous aspect of XML is not the format itself, but the **Parsers**.

In the early 2000s, the XML specification included a feature called **External Entities (XXE)**. It allowed an XML document to automatically fetch external files to build itself.

### The Attack
A hacker sends the following XML to a backend API:
\`\`\`xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "file:///etc/passwd" >]>
<login>
  <username>&xxe;</username>
</login>
\`\`\`

**What happens?**
The backend's XML parser sees the \`SYSTEM\` keyword, physically reads the server's highly classified \`/etc/passwd\` file, and injects the contents directly into the \`<username>\` tag. When the API responds with *"User [CONTENTS OF PASSWORD FILE] not found"*, the hacker has successfully stolen the server's passwords.

**The Fix:** Every modern backend engineer MUST explicitly configure their XML parser (like \`libxml2\` or Python's \`lxml\`) to disable External Entities (\`resolve_entities=False\`).

---

## 4. Engineering Challenge: Formatting XML

Formatting XML isn't just about replacing tags with newlines. A professional formatter must parse the document into an **Abstract Syntax Tree (AST)**. 
- It must calculate the correct indentation depth.
- It must preserve self-closing tags (\`<empty/>\`).
- It must aggressively sanitize the input. If a user pastes a 1GB XML file on a single line, a naive Regex formatter will instantly cause a Stack Overflow and crash the browser.

---

## 5. Production Workflows

If JSON is better, why is XML still used?
- **Enterprise SOA / SOAP:** Giant legacy financial systems (like banking mainframes) still communicate exclusively via SOAP (Simple Object Access Protocol), a strict XML messaging framework.
- **SAML SSO:** Corporate Single Sign-On (Okta, Azure AD) relies on heavily encrypted XML Assertions.
- **Vector Graphics (SVG):** Every SVG image on the internet is literally just an XML document containing math coordinates.

---

## 6. Interactive Quiz

**Beginner:**
1. Why did the internet largely abandon XML in favor of JSON for APIs? *(Answer: Because JSON is significantly more lightweight, easier to read, and maps directly to native JavaScript objects without requiring complex parsing logic).*

**Intermediate:**
2. What is the purpose of a CDATA block? *(Answer: It tells the XML parser to treat everything inside as raw text, preventing characters like \`<\` or \`&\` from crashing the parser).*

**Advanced:**
3. How does an XXE (XML External Entity) attack work? *(Answer: The attacker exploits a poorly configured XML parser by passing a payload containing a \`SYSTEM\` entity. The parser executes the entity, reads sensitive local files off the server's hard drive, and returns the data to the attacker).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Paste your raw, minified, or disorganized XML payload.",
    "**Step 2:** Select your preferred Indentation level (2 spaces, 4 spaces, or Tabs).",
    "**Step 3:** Click Format. The tool parses the AST and outputs clean, color-coded XML.",
    "**Step 4:** You can also click 'Minify' to strip all whitespace and compress the XML for production transmission."
  ],
  faq: [
    {
      question: "Will this tool execute XXE attacks?",
      answer: "No. KaruviLab's parser strictly evaluates the XML as a generic text tree in the browser and explicitly disables external entity resolution to prevent any accidental network or file access."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [
    {
      error: "Parse Error / Invalid XML",
      fix: "Your XML might be missing a single Root Node. Unlike JSON, a valid XML document must have exactly one top-level tag that wraps all other content."
    }
  ],
  alternatives: ["JSON Formatter", "SQL Formatter"]
};
