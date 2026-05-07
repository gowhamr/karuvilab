/* ===== tool-content.ts — KaruviLab Educational Content Registry =====
 *
 * Comprehensive educational content for every KaruviLab tool.
 * All tools are client-side utilities — no data is uploaded to any server.
 */

export interface ToolContent {
  detailedDescription?: string;
  howTo?: string[];
  faq?: { question: string; answer: string }[];
  useCases?: string[];
  examples?: { label: string; input: string; output: string }[];
  commonErrors?: { error: string; fix: string }[];
  alternatives?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Security / Encoding
// ─────────────────────────────────────────────────────────────────────────────

const hashGenerator: ToolContent = {
  detailedDescription:
    "Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for any text string using the browser's built-in Web Crypto API. Hashes are one-way fingerprints useful for verifying data integrity and storing passwords securely. All computation happens locally — your input never leaves your device.",
  howTo: [
    "Type or paste the text you want to hash into the input field.",
    "Select the hash algorithm (MD5, SHA-1, SHA-256, or SHA-512) from the dropdown.",
    "The hash is generated instantly and displayed in the output area.",
    "Click the copy icon to copy the hex digest to your clipboard.",
  ],
  faq: [
    {
      question: "Is my data sent to a server?",
      answer:
        "No. All hashing runs entirely in your browser using the Web Crypto API. No data is transmitted anywhere.",
    },
    {
      question: "Which algorithm should I use?",
      answer:
        "SHA-256 is the modern standard for most integrity checks. Avoid MD5 and SHA-1 for security-sensitive purposes — they are cryptographically broken.",
    },
    {
      question: "Why does the same text always produce the same hash?",
      answer:
        "Hash functions are deterministic. The same input always yields the same output, which is why they are useful for integrity verification.",
    },
    {
      question: "Can I reverse a hash to get the original text?",
      answer:
        "No. Hash functions are designed to be one-way. You cannot recover the original input from a hash digest alone.",
    },
  ],
  useCases: [
    "Verifying a downloaded file's integrity with SHA-256",
    "Comparing two files to confirm they are identical",
    "Generating a checksum for a configuration value",
    "Teaching cryptography concepts interactively",
  ],
  examples: [
    {
      label: "SHA-256 of 'hello'",
      input: "hello",
      output: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    },
    {
      label: "MD5 of 'karuvilab'",
      input: "karuvilab",
      output: "e99f5a2a6b2a2e4f7c3d1b0e9f8a7c6d",
    },
  ],
  commonErrors: [
    {
      error: "Hash looks wrong or too short",
      fix: "Ensure you selected the correct algorithm. MD5 produces 32 hex chars, SHA-256 produces 64, and SHA-512 produces 128.",
    },
    {
      error: "Output differs from an online tool",
      fix: "Check for invisible leading/trailing whitespace in your input. Even a single space changes the hash completely.",
    },
    {
      error: "Non-ASCII characters produce unexpected results",
      fix: "The tool encodes text as UTF-8 before hashing, which is the standard. Ensure the tool you are comparing against uses the same encoding.",
    },
  ],
  alternatives: ["CyberChef", "md5hashgenerator.com", "sha256.online"],
};

const passwordGenerator: ToolContent = {
  detailedDescription:
    "Create strong, random passwords of any length using the browser's cryptographically secure `crypto.getRandomValues` API. Choose from uppercase, lowercase, digits, and symbols to match any site's password policy. Passwords are generated entirely in your browser and are never stored or transmitted.",
  howTo: [
    "Set the desired password length using the slider or number input.",
    "Toggle the character sets you want: uppercase, lowercase, numbers, and/or symbols.",
    "Click 'Generate' (or wait for the live preview) to create a new password.",
    "Click 'Copy' to copy the password to your clipboard.",
    "Click 'Generate' again to create a different password at any time.",
  ],
  faq: [
    {
      question: "Is this truly random?",
      answer:
        "Yes. The tool uses `crypto.getRandomValues`, which is a cryptographically secure pseudorandom number generator (CSPRNG) provided by your browser.",
    },
    {
      question: "Are generated passwords saved anywhere?",
      answer:
        "No. Passwords exist only in your browser's memory and are discarded when you navigate away.",
    },
    {
      question: "What length should I use?",
      answer:
        "At least 16 characters for general accounts and 24+ for sensitive accounts. Longer passwords are exponentially harder to brute-force.",
    },
    {
      question: "Why is the tool not generating symbols?",
      answer:
        "Make sure the 'Symbols' toggle is enabled. If a site doesn't allow symbols, you can turn that set off.",
    },
  ],
  useCases: [
    "Generating a secure password for a new online account",
    "Creating a random API key or secret token for testing",
    "Producing a strong Wi-Fi passphrase",
    "Creating temporary passwords for shared accounts",
  ],
  examples: [
    {
      label: "16-char, all sets",
      input: "length=16, upper+lower+digits+symbols",
      output: "gT3#mXqL!9wZkR@2",
    },
    {
      label: "12-char, alphanumeric only",
      input: "length=12, upper+lower+digits",
      output: "Kx7mN2pQrJ4w",
    },
  ],
  commonErrors: [
    {
      error: "Password rejected by the target site",
      fix: "Check the site's requirements and adjust character sets accordingly — some sites disallow certain symbols.",
    },
    {
      error: "Generated password is too predictable",
      fix: "Ensure you are not using a very short length. Use at least 16 characters and enable all character sets.",
    },
    {
      error: "Copy button doesn't work",
      fix: "Browser clipboard access requires HTTPS or localhost. If you see a permission error, manually select and copy the password text.",
    },
  ],
  alternatives: ["Bitwarden password generator", "1Password generator", "KeePass"],
};

const base64: ToolContent = {
  detailedDescription:
    "Encode plain text or binary data to Base64 and decode Base64 strings back to readable text, all inside your browser. Supports both standard Base64 and the URL-safe variant (replacing `+` with `-` and `/` with `_`). Useful for embedding data in JSON, URLs, and HTTP headers without special-character conflicts.",
  howTo: [
    "Select 'Encode' or 'Decode' mode using the toggle.",
    "Paste your input text into the left panel.",
    "The result appears instantly in the right panel.",
    "Toggle 'URL-safe' if you need the `-_` variant instead of `+/`.",
    "Click 'Copy' to copy the result to your clipboard.",
  ],
  faq: [
    {
      question: "Does Base64 encrypt my data?",
      answer:
        "No. Base64 is an encoding scheme, not encryption. Anyone who sees the Base64 string can trivially decode it.",
    },
    {
      question: "Why does my decoded output look garbled?",
      answer:
        "The input may be binary data (like an image) rather than text. Base64 can encode arbitrary bytes, but the decoded output will only be readable if the original was text.",
    },
    {
      question: "What is the URL-safe variant?",
      answer:
        "URL-safe Base64 replaces `+` with `-` and `/` with `_` so the output can be used directly in URLs and filenames without percent-encoding.",
    },
    {
      question: "Is there a size limit?",
      answer:
        "The tool handles typical text and small files. Very large inputs may slow the browser but there is no hard limit enforced.",
    },
  ],
  useCases: [
    "Encoding a JSON payload for a JWT token",
    "Embedding a small image as a Base64 data URI in CSS",
    "Decoding a Base64-encoded API response for inspection",
    "Passing binary data through a text-only protocol",
  ],
  examples: [
    {
      label: "Encode 'Hello, World!'",
      input: "Hello, World!",
      output: "SGVsbG8sIFdvcmxkIQ==",
    },
    {
      label: "Decode 'SGVsbG8='",
      input: "SGVsbG8=",
      output: "Hello",
    },
  ],
  commonErrors: [
    {
      error: "'Invalid Base64' error when decoding",
      fix: "Ensure the string length is a multiple of 4. Missing `=` padding characters are a common cause. Add them manually if needed.",
    },
    {
      error: "Output has unexpected line breaks",
      fix: "Some Base64 encoders insert newlines every 76 characters (MIME style). Remove all whitespace from the input before decoding.",
    },
    {
      error: "URL-safe decode fails on standard Base64",
      fix: "Switch off the URL-safe toggle. Standard Base64 uses `+` and `/`, which differ from the URL-safe `-` and `_`.",
    },
  ],
  alternatives: ["CyberChef", "base64encode.org", "base64decode.org"],
};

const urlEncoder: ToolContent = {
  detailedDescription:
    "Percent-encode and decode URLs and query string parameters to ensure they are safely transmitted in HTTP requests. Special characters like spaces, `&`, `=`, and non-ASCII letters are replaced with their `%XX` hex equivalents. Everything runs in the browser — no data is sent anywhere.",
  howTo: [
    "Choose 'Encode' or 'Decode' mode.",
    "Paste your URL or query string into the input field.",
    "The encoded or decoded result appears immediately.",
    "Copy the output using the copy button.",
  ],
  faq: [
    {
      question: "When should I encode a URL vs. a query parameter?",
      answer:
        "Use `encodeURI` for full URLs (preserves `://`, `?`, `&`, `=`) and `encodeURIComponent` for individual query parameter values (encodes everything including `&` and `=`).",
    },
    {
      question: "Why does a space become `%20` or `+`?",
      answer:
        "Both are valid in different contexts. `%20` is the RFC-standard encoding; `+` is used only in `application/x-www-form-urlencoded` form data.",
    },
    {
      question: "Does this handle Unicode characters?",
      answer:
        "Yes. Non-ASCII characters are UTF-8-encoded first and then percent-encoded (e.g., `€` becomes `%E2%82%AC`).",
    },
  ],
  useCases: [
    "Encoding a search query before appending it to a URL",
    "Decoding a URL copied from a browser address bar",
    "Fixing a broken link that contains unencoded special characters",
    "Preparing query parameters for an API request",
  ],
  examples: [
    {
      label: "Encode query value",
      input: "hello world & more",
      output: "hello%20world%20%26%20more",
    },
    {
      label: "Decode percent-encoded string",
      input: "caf%C3%A9%20menu",
      output: "café menu",
    },
  ],
  commonErrors: [
    {
      error: "Double-encoding (e.g., `%2520` instead of `%20`)",
      fix: "Decode the string first before re-encoding, or encode only the parts that have not yet been encoded.",
    },
    {
      error: "Encoding the entire URL including `://`",
      fix: "Encode only the query parameter values, not the full URL. Encoding `://` will break the link.",
    },
    {
      error: "`+` signs disappear after decoding",
      fix: "A literal `+` in a URL must be encoded as `%2B`. A raw `+` is interpreted as a space in form-encoded contexts.",
    },
  ],
  alternatives: ["CyberChef", "urlencoder.org", "Browser DevTools Network tab"],
};

const htmlEntities: ToolContent = {
  detailedDescription:
    "Convert special HTML characters to their named or numeric entity equivalents (e.g., `<` → `&lt;`) and decode entities back to readable characters. Essential for safely embedding user-generated content in HTML without triggering XSS vulnerabilities. Runs entirely in the browser.",
  howTo: [
    "Select 'Encode' to escape HTML characters or 'Decode' to unescape entities.",
    "Paste your HTML snippet or plain text into the input box.",
    "The converted output appears instantly.",
    "Copy the result and use it in your code.",
  ],
  faq: [
    {
      question: "Why do I need HTML entities?",
      answer:
        "Characters like `<`, `>`, `&`, and `\"` have special meaning in HTML. Without encoding them, they can break page structure or enable cross-site scripting (XSS) attacks.",
    },
    {
      question: "What is the difference between named and numeric entities?",
      answer:
        "`&amp;` is a named entity; `&#38;` is the decimal numeric form; `&#x26;` is the hex form. They all produce the same character — `&`.",
    },
    {
      question: "Does this handle all Unicode characters?",
      answer:
        "Most Unicode characters do not need encoding in modern UTF-8 HTML. The tool focuses on the characters that must be escaped for safety: `<`, `>`, `&`, `\"`, `'`.",
    },
  ],
  useCases: [
    "Escaping user input before inserting it into an HTML page",
    "Decoding HTML entities in a scraped web page",
    "Preparing code samples to display in a blog post",
    "Fixing corrupted text that shows raw entity codes",
  ],
  examples: [
    {
      label: "Encode HTML special chars",
      input: "<script>alert('xss')</script>",
      output: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;",
    },
    {
      label: "Decode entities",
      input: "&copy; 2025 &mdash; All rights reserved",
      output: "© 2025 — All rights reserved",
    },
  ],
  commonErrors: [
    {
      error: "Double-encoding entities (e.g., `&amp;amp;`)",
      fix: "Decode the text first if it already contains entities before encoding again.",
    },
    {
      error: "Encoded output breaks inside a JavaScript string",
      fix: "HTML entity encoding is for HTML context only. Use JavaScript string escaping (e.g., `\\\"`) inside JS strings.",
    },
  ],
  alternatives: ["CyberChef", "htmlentities.com", "Character Map (OS utility)"],
};

const jwtDecoder: ToolContent = {
  detailedDescription:
    "Decode and inspect the header and payload sections of any JSON Web Token (JWT) without needing a secret key. This tool parses the Base64URL-encoded parts and displays the JSON contents in a readable format. Note: this tool does not verify the signature — it only reads the claims.",
  howTo: [
    "Paste the full JWT string (three dot-separated parts) into the input field.",
    "The header and payload JSON are automatically decoded and displayed.",
    "Review the claims such as `iss`, `exp`, `sub`, and custom fields.",
    "Check the expiry (`exp`) timestamp to see if the token is still valid.",
  ],
  faq: [
    {
      question: "Does this verify the JWT signature?",
      answer:
        "No. Signature verification requires the secret or public key held by the issuing server. This tool only decodes the readable parts of the token.",
    },
    {
      question: "Is it safe to paste a production JWT here?",
      answer:
        "Decoding happens entirely in your browser — nothing is sent to a server. That said, treat JWTs like passwords; avoid pasting tokens with sensitive permissions into any third-party site.",
    },
    {
      question: "Why does the payload show an `exp` timestamp?",
      answer:
        "`exp` is a Unix timestamp (seconds since 1970-01-01 UTC). The tool converts it to a human-readable date for convenience.",
    },
    {
      question: "I see 'Invalid JWT format' — why?",
      answer:
        "A valid JWT must consist of exactly three Base64URL parts separated by dots. Ensure you copied the complete token without extra spaces or line breaks.",
    },
  ],
  useCases: [
    "Inspecting token claims during API development and debugging",
    "Checking whether a JWT has expired",
    "Reading user roles and permissions embedded in a token",
    "Teaching JWT structure in a workshop or tutorial",
  ],
  examples: [
    {
      label: "Decode a sample JWT header",
      input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<sig>",
      output: '{ "alg": "HS256", "typ": "JWT" }',
    },
  ],
  commonErrors: [
    {
      error: "'Invalid JWT' with a token that looks correct",
      fix: "Remove any surrounding quotes or whitespace. Some tools wrap JWTs in quotes when copying.",
    },
    {
      error: "Payload shows garbled characters",
      fix: "The JWT may use a non-standard encoding. Ensure the token is a proper Base64URL string without standard Base64 `+` or `/` characters.",
    },
    {
      error: "`exp` claim shows a date in the past",
      fix: "The token has expired. Your application or server needs to issue a fresh token.",
    },
  ],
  alternatives: ["jwt.io", "token.dev", "CyberChef"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Developer
// ─────────────────────────────────────────────────────────────────────────────

const jsonFormatter: ToolContent = {
  detailedDescription:
    "Beautify, minify, and validate JSON in real time with syntax highlighting and an interactive tree view. Instantly spot malformed JSON with descriptive error messages pointing to the exact line. All processing is local — your data never leaves the browser.",
  howTo: [
    "Paste your raw or minified JSON into the input panel.",
    "Click 'Format' to beautify, or 'Minify' to compact the JSON.",
    "Errors are highlighted inline with the line number and a description.",
    "Switch to 'Tree View' to expand and collapse nested objects.",
    "Copy the formatted output using the copy button.",
  ],
  faq: [
    {
      question: "What counts as valid JSON?",
      answer:
        "Valid JSON must use double-quoted keys, no trailing commas, and no JavaScript-style comments. Single-quoted strings and `undefined` values are not valid JSON.",
    },
    {
      question: "Can I format very large JSON files?",
      answer:
        "Yes, but files over a few megabytes may cause the browser to slow down. For huge files, consider a local tool like `jq`.",
    },
    {
      question: "Why does minified JSON not save space sometimes?",
      answer:
        "Whitespace-only savings are modest if the JSON contains mostly data. Minification primarily helps when JSON has lots of indentation and newlines.",
    },
    {
      question: "Does the tree view support editing?",
      answer:
        "The tree view is for inspection only. Edit in the text panel and the tree updates automatically.",
    },
  ],
  useCases: [
    "Debugging a malformed API response",
    "Reading a minified configuration file from a build artifact",
    "Validating JSON before committing to a repository",
    "Exploring a deeply nested JSON structure interactively",
  ],
  examples: [
    {
      label: "Beautify minified JSON",
      input: '{"name":"Alice","age":30,"city":"Chennai"}',
      output: '{\n  "name": "Alice",\n  "age": 30,\n  "city": "Chennai"\n}',
    },
  ],
  commonErrors: [
    {
      error: "Unexpected token at line N",
      fix: "Look for a trailing comma after the last item in an array or object — JSON does not allow trailing commas.",
    },
    {
      error: "Keys are not quoted or use single quotes",
      fix: "JSON requires all keys and string values to use double quotes. Replace `'key'` with `\"key\"`.",
    },
    {
      error: "Formatter outputs nothing for a seemingly valid input",
      fix: "Check for a byte-order mark (BOM) at the start of the pasted text. Copy the JSON again from the source.",
    },
  ],
  alternatives: ["jsonlint.com", "JSONBeautifier.org", "VS Code built-in formatter"],
};

const jsonCsv: ToolContent = {
  detailedDescription:
    "Convert a JSON array of objects to a CSV file and back with a single click. The tool automatically infers column headers from the JSON keys. Supports nested value flattening and custom delimiters. Everything runs in the browser — your data is never uploaded.",
  howTo: [
    "Select the conversion direction: 'JSON → CSV' or 'CSV → JSON'.",
    "Paste your JSON array or CSV text into the input panel.",
    "The converted output appears in the right panel.",
    "Download the result as a file or copy it to the clipboard.",
  ],
  faq: [
    {
      question: "Does the JSON input need to be an array?",
      answer:
        "Yes. The input must be a JSON array of objects where each object represents a row. A single object or nested arrays are not directly supported.",
    },
    {
      question: "What happens to nested objects in JSON?",
      answer:
        "Nested objects are flattened using dot notation (e.g., `address.city`) or stringified, depending on the tool's setting.",
    },
    {
      question: "Can I change the CSV delimiter?",
      answer:
        "Yes. Switch from comma to semicolon or tab to handle regional CSV variants or TSV files.",
    },
    {
      question: "Will special characters in values break the CSV?",
      answer:
        "Values containing commas or quotes are automatically wrapped in double quotes and internal quotes are escaped per RFC 4180.",
    },
  ],
  useCases: [
    "Exporting API data to Excel for reporting",
    "Importing a CSV dataset into a JavaScript application as JSON",
    "Preparing data for a spreadsheet from a REST API",
    "Converting a database export between formats",
  ],
  examples: [
    {
      label: "JSON array to CSV",
      input: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
      output: "name,age\nAlice,30\nBob,25",
    },
  ],
  commonErrors: [
    {
      error: "JSON input is not an array",
      fix: "Wrap your object in square brackets: `[{ ... }]`. The tool expects an array of objects.",
    },
    {
      error: "CSV output has misaligned columns",
      fix: "Ensure all JSON objects have the same keys. Missing keys produce empty cells, which may shift columns in some spreadsheet apps.",
    },
    {
      error: "Non-ASCII characters appear garbled in Excel",
      fix: "Open the CSV in Excel using the import wizard and select UTF-8 encoding. Or add a UTF-8 BOM at the start of the file.",
    },
  ],
  alternatives: ["csvjson.com", "ConvertCSV.com", "Python pandas"],
};

const regexTester: ToolContent = {
  detailedDescription:
    "Test regular expressions against sample text in real time with live match highlighting. Supports all JavaScript regex flags (`g`, `i`, `m`, `s`, `u`), named capture groups, and displays each match's index and captured groups. No data leaves your browser.",
  howTo: [
    "Enter your regular expression in the pattern field.",
    "Type or paste the sample text in the test area.",
    "All matches are highlighted immediately as you type.",
    "Review the match list below showing each match's value, index, and groups.",
    "Toggle flags (`g`, `i`, `m`, etc.) using the flag buttons.",
  ],
  faq: [
    {
      question: "Which regex flavor does this use?",
      answer:
        "JavaScript's built-in `RegExp` engine. Most common patterns are compatible, but features like lookbehinds require a modern browser (Chrome 62+, Firefox 78+).",
    },
    {
      question: "Why does my regex match nothing?",
      answer:
        "Check that special characters (`.`, `*`, `+`, `?`, `(`, `)`) are escaped with a backslash if you want them treated literally.",
    },
    {
      question: "What are flags and when do I use them?",
      answer:
        "`g` finds all matches (not just the first), `i` ignores case, `m` makes `^` and `$` match line boundaries, `s` makes `.` match newlines.",
    },
    {
      question: "Can I use named capture groups?",
      answer:
        "Yes. Use `(?<name>...)` syntax. Named groups are displayed alongside numeric groups in the match list.",
    },
  ],
  useCases: [
    "Building and testing an email validation regex",
    "Extracting dates or phone numbers from a block of text",
    "Debugging a complex search-and-replace pattern",
    "Learning regex syntax interactively",
  ],
  examples: [
    {
      label: "Match email addresses",
      input: "Contact us at hello@karuvilab.com or support@example.org",
      output: "Matches: hello@karuvilab.com, support@example.org",
    },
    {
      label: "Extract digits",
      input: "Order #4521 ships in 3 days",
      output: "Matches: 4521, 3",
    },
  ],
  commonErrors: [
    {
      error: "Regex throws 'Invalid regular expression'",
      fix: "Check for unmatched parentheses, brackets, or unescaped special characters in the pattern.",
    },
    {
      error: "Pattern only matches once even with the global flag",
      fix: "Ensure the `g` flag is enabled. Without it, `RegExp.exec` and `String.match` return only the first match.",
    },
    {
      error: "Catastrophic backtracking causes the browser to hang",
      fix: "Simplify nested quantifiers (e.g., `(a+)+`). These can cause exponential time complexity on certain inputs.",
    },
  ],
  alternatives: ["regex101.com", "regexr.com", "RegExBuddy"],
};

const codeMinifier: ToolContent = {
  detailedDescription:
    "Minify CSS, JavaScript, and HTML to reduce file sizes for faster web page loading. The tool strips comments, whitespace, and unnecessary characters while preserving functionality. All minification happens client-side — your source code is never sent to a server.",
  howTo: [
    "Select the language tab: CSS, JavaScript, or HTML.",
    "Paste your source code into the input editor.",
    "Click 'Minify' to generate the compressed output.",
    "View the size reduction percentage shown below the output.",
    "Copy or download the minified code.",
  ],
  faq: [
    {
      question: "Will minification break my code?",
      answer:
        "For standard, well-formed code, no. However, code that relies on `arguments.caller`, `Function.name`, or specific whitespace formatting may behave differently after minification.",
    },
    {
      question: "What is the difference between minification and uglification?",
      answer:
        "Minification removes whitespace and comments. Uglification also renames variables to shorter names, providing a greater size reduction (and minor obfuscation).",
    },
    {
      question: "Should I minify my development files?",
      answer:
        "No. Minify only for production. Keep original source files for development. Use source maps if you need to debug minified code.",
    },
  ],
  useCases: [
    "Reducing CSS bundle size before deploying a website",
    "Preparing a single-file HTML page for distribution",
    "Minimizing inline JavaScript in an email template",
    "Learning how build tools like webpack transform code",
  ],
  examples: [
    {
      label: "Minify CSS",
      input: "body {\n  margin: 0;\n  padding: 0; /* reset */\n}",
      output: "body{margin:0;padding:0}",
    },
  ],
  commonErrors: [
    {
      error: "Minified JavaScript throws a syntax error",
      fix: "Ensure your original JS has no syntax errors before minifying. Run it through a linter first.",
    },
    {
      error: "CSS variables or custom properties are removed",
      fix: "The tool should preserve CSS custom properties. If not, check that your input uses standard `--variable` syntax.",
    },
    {
      error: "HTML minifier removes whitespace inside `<pre>` tags",
      fix: "Content inside `<pre>` and `<textarea>` should be preserved. If whitespace is removed, report it or manually add it back.",
    },
  ],
  alternatives: ["Terser (JS)", "cssnano", "HTMLMinifier.com"],
};

const diffChecker: ToolContent = {
  detailedDescription:
    "Perform a line-by-line comparison of two text blocks to highlight additions, deletions, and unchanged lines — similar to `git diff`. Ideal for comparing configuration files, code versions, or any two pieces of text. All comparison runs locally in the browser.",
  howTo: [
    "Paste the original text into the left panel ('Before').",
    "Paste the updated text into the right panel ('After').",
    "The diff is computed instantly with added lines in green and removed lines in red.",
    "Scroll through the diff to review all changes.",
    "Use 'Unified' or 'Split' view to switch display modes.",
  ],
  faq: [
    {
      question: "Does it compare character-level differences?",
      answer:
        "By default the tool diffs line by line. Within a changed line, it may highlight the specific words or characters that changed depending on the view mode.",
    },
    {
      question: "Can I compare files instead of pasting text?",
      answer:
        "Yes. Use the file upload option to load text files directly. Binary files are not supported.",
    },
    {
      question: "Does whitespace matter in the comparison?",
      answer:
        "By default, trailing whitespace differences are flagged. Enable 'Ignore whitespace' mode to suppress whitespace-only changes.",
    },
  ],
  useCases: [
    "Reviewing changes to a configuration file before deploying",
    "Comparing two versions of a contract or document",
    "Verifying that a code refactor did not change behaviour",
    "Checking what changed between two API responses",
  ],
  commonErrors: [
    {
      error: "Entire file shows as changed when only one line differs",
      fix: "Check for mismatched line endings (CRLF vs. LF). Enable 'Ignore line endings' mode or normalize them first.",
    },
    {
      error: "Diff is very slow for large files",
      fix: "The algorithm is O(n²) in the worst case. For files larger than a few thousand lines, use a desktop tool like VS Code or `diff`.",
    },
    {
      error: "Colors are hard to read",
      fix: "Switch between light and dark mode. You can also switch to unified view for better contrast on small screens.",
    },
  ],
  alternatives: ["diffchecker.com", "VS Code diff editor", "git diff"],
};

const format: ToolContent = {
  detailedDescription:
    "A multi-language code formatter supporting JSON, HTML, CSS, SQL, and Markdown. Paste messy code and get properly indented, consistently styled output in one click using Prettier-compatible formatting rules. No code is sent to a server — formatting runs entirely in the browser.",
  howTo: [
    "Select the language from the format tabs (JSON, HTML, CSS, SQL, Markdown).",
    "Paste your unformatted code into the editor.",
    "Click 'Format' or wait for the auto-format trigger.",
    "Copy the formatted output or switch tabs to format another language.",
  ],
  faq: [
    {
      question: "Which formatter is used under the hood?",
      answer:
        "The tool uses Prettier (for JS/HTML/CSS/Markdown) and sql-formatter for SQL, compiled to WebAssembly so everything runs in the browser.",
    },
    {
      question: "Can I configure the indentation width?",
      answer:
        "Yes. Use the settings panel to set indent size (2 or 4 spaces, or tabs) and other style options.",
    },
    {
      question: "Does it support JSX or TypeScript?",
      answer:
        "TypeScript and JSX formatting may be available under the 'JS/TS' tab. Check the language selector for the full list.",
    },
  ],
  useCases: [
    "Cleaning up HTML copied from a CMS or email builder",
    "Formatting a long SQL query for readability",
    "Standardising CSS before a code review",
    "Rendering a Markdown document to check its preview",
  ],
  examples: [
    {
      label: "Format SQL",
      input: "select id,name from users where active=1 order by name",
      output: "SELECT\n  id,\n  name\nFROM users\nWHERE active = 1\nORDER BY name",
    },
  ],
  commonErrors: [
    {
      error: "Formatter does nothing to the input",
      fix: "Check that you selected the correct language tab. Formatting HTML as CSS (or vice versa) produces no output.",
    },
    {
      error: "SQL formatter reorders clauses unexpectedly",
      fix: "The SQL formatter normalises clause order per SQL standards. Verify your query logic is preserved — it should be.",
    },
  ],
  alternatives: ["Prettier.io", "SQL Formatter Online", "VS Code Prettier extension"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

const qrcode: ToolContent = {
  detailedDescription:
    "Generate QR codes for URLs, plain text, Wi-Fi credentials, and more instantly in the browser. Customize the size, error correction level, and colors. Download the QR code as a PNG or SVG for use in print or digital materials. No data is sent to any server.",
  howTo: [
    "Select the content type: URL, Text, or Wi-Fi.",
    "Enter your content in the input field.",
    "The QR code preview updates in real time.",
    "Adjust size and error correction level if needed.",
    "Click 'Download PNG' or 'Download SVG' to save.",
  ],
  faq: [
    {
      question: "What is the error correction level?",
      answer:
        "Error correction allows QR codes to be read even when partially damaged or obscured. Level L (7%) is smallest; level H (30%) is most resilient but produces a denser code.",
    },
    {
      question: "How much data can a QR code hold?",
      answer:
        "A standard QR code can store up to ~4,296 alphanumeric characters. Longer content produces a denser, harder-to-scan code.",
    },
    {
      question: "Can I add a logo inside the QR code?",
      answer:
        "Yes, if the tool supports logo overlay. Use a high error correction level (Q or H) when adding a logo so the code remains scannable.",
    },
    {
      question: "Will the QR code work forever?",
      answer:
        "The QR code itself never expires. However, if it encodes a URL, the code stops working if the URL is taken down.",
    },
  ],
  useCases: [
    "Sharing a Wi-Fi password at a café or event",
    "Linking a printed flyer to a website",
    "Encoding a contact vCard for business cards",
    "Providing a quick payment link at a market stall",
  ],
  examples: [
    {
      label: "QR for URL",
      input: "https://karuvilab.com",
      output: "[QR code image encoding the URL]",
    },
  ],
  commonErrors: [
    {
      error: "QR code scans but opens a broken link",
      fix: "Double-check the URL for typos. Include the `https://` prefix.",
    },
    {
      error: "QR code is too dense to scan reliably",
      fix: "Shorten the URL using a URL shortener, or increase the physical print size.",
    },
    {
      error: "Downloaded PNG is blurry",
      fix: "Increase the size setting before downloading, or download the SVG for infinite resolution.",
    },
  ],
  alternatives: ["qr-code-generator.com", "goqr.me", "QRCode Monkey"],
};

const textUtility: ToolContent = {
  detailedDescription:
    "A Swiss-army-knife text manipulation tool covering case conversion (upper, lower, title, camel, snake, kebab), word and character counts, whitespace cleanup, line sorting, and duplicate removal. Ideal for quick text normalization tasks without writing any code.",
  howTo: [
    "Paste your text into the input area.",
    "Choose a transformation from the toolbar (e.g., 'Title Case', 'Remove Extra Spaces').",
    "The transformed text appears in the output area immediately.",
    "Chain multiple transformations by applying them one after another.",
    "Copy the final result using the copy button.",
  ],
  faq: [
    {
      question: "What is the difference between title case and sentence case?",
      answer:
        "Title case capitalizes the first letter of every major word. Sentence case capitalizes only the first word of each sentence.",
    },
    {
      question: "What does 'Remove extra whitespace' do?",
      answer:
        "It collapses multiple consecutive spaces and tabs into a single space, and removes leading/trailing whitespace from each line.",
    },
    {
      question: "Can I sort lines alphabetically?",
      answer:
        "Yes. Use the 'Sort Lines A→Z' or 'Sort Lines Z→A' option. You can also remove duplicate lines with 'Remove Duplicates'.",
    },
  ],
  useCases: [
    "Converting a list of names to title case for a report",
    "Counting words in an essay or article",
    "Removing blank lines from a pasted CSV",
    "Converting a camelCase variable name to snake_case",
  ],
  examples: [
    {
      label: "Convert to title case",
      input: "the quick brown fox jumps over the lazy dog",
      output: "The Quick Brown Fox Jumps Over The Lazy Dog",
    },
    {
      label: "camelCase to snake_case",
      input: "myVariableName",
      output: "my_variable_name",
    },
  ],
  commonErrors: [
    {
      error: "Title case capitalizes articles and prepositions",
      fix: "This is a known simplification. True title case rules (not capitalizing 'the', 'of', 'and') vary by style guide. Apply manual corrections for formal documents.",
    },
    {
      error: "Line count differs from word processor",
      fix: "Different tools count blank lines differently. The word count excludes blank lines; the line count includes them.",
    },
  ],
  alternatives: ["TextMechanic.com", "Convert Case", "Sublime Text multi-cursor editing"],
};

const splitCopy: ToolContent = {
  detailedDescription:
    "Split a long block of text into equal-sized chunks of N characters, useful for pasting into character-limited inputs like SMS, Twitter (legacy), or form fields. Each chunk is displayed separately and can be individually copied. Runs entirely in the browser.",
  howTo: [
    "Paste your long text into the input field.",
    "Set the chunk size (number of characters per chunk).",
    "The text is split and each chunk is displayed with its index.",
    "Copy individual chunks using each chunk's copy button.",
  ],
  faq: [
    {
      question: "Does the splitter cut words mid-way?",
      answer:
        "By default, yes — it splits at exactly N characters. Enable 'Split at word boundary' to avoid cutting words in half.",
    },
    {
      question: "What is a good chunk size for SMS?",
      answer:
        "Standard SMS supports 160 characters. If you use Unicode/emoji, the limit drops to 70 characters per segment.",
    },
    {
      question: "Can I split by line count instead of character count?",
      answer:
        "Most implementations split by character. For line-based splitting, use the Text Utility tool's line operations.",
    },
  ],
  useCases: [
    "Splitting a long message to send over SMS",
    "Breaking a prompt into chunks for a character-limited API",
    "Dividing a large text for manual entry into multiple fields",
    "Preparing paginated content for a multi-step form",
  ],
  examples: [
    {
      label: "Split at 10 chars",
      input: "Hello, this is a long message.",
      output: "Chunk 1: 'Hello, thi' | Chunk 2: 's is a lon' | Chunk 3: 'g message.'",
    },
  ],
  commonErrors: [
    {
      error: "Last chunk is empty",
      fix: "This happens when the total length is an exact multiple of the chunk size. The tool may generate a trailing empty chunk — safely ignore it.",
    },
    {
      error: "Emoji characters cause misaligned chunks",
      fix: "Emoji are multi-byte characters. If character count matters, count code points, not bytes. Enable Unicode-aware mode if available.",
    },
  ],
  alternatives: ["TextMechanic.com", "TextSplit.net", "Manual copy-paste"],
};

const markdown: ToolContent = {
  detailedDescription:
    "A live Markdown editor with a split-pane preview that renders your Markdown to HTML in real time. Supports CommonMark spec including tables, code blocks with syntax highlighting, task lists, and footnotes. All rendering is done in the browser using a lightweight Markdown parser.",
  howTo: [
    "Type or paste your Markdown in the left editor pane.",
    "The rendered HTML preview updates instantly on the right.",
    "Use the toolbar buttons for common Markdown shortcuts (bold, italic, link, etc.).",
    "Copy the rendered HTML or download the `.md` file.",
  ],
  faq: [
    {
      question: "Which Markdown spec does this follow?",
      answer:
        "The tool follows CommonMark with GitHub Flavored Markdown (GFM) extensions, supporting tables, strikethrough, and task lists.",
    },
    {
      question: "Can I export to HTML or PDF?",
      answer:
        "You can copy the rendered HTML. For PDF export, use the browser's 'Print → Save as PDF' feature.",
    },
    {
      question: "Are HTML tags inside Markdown rendered?",
      answer:
        "Raw HTML within Markdown is allowed by CommonMark and is rendered. Be cautious with `<script>` tags.",
    },
  ],
  useCases: [
    "Writing and previewing a README before pushing to GitHub",
    "Drafting a blog post in Markdown",
    "Creating formatted documentation for a project",
    "Learning Markdown syntax interactively",
  ],
  examples: [
    {
      label: "Heading and bold",
      input: "## Hello\n**Bold** and _italic_.",
      output: "<h2>Hello</h2><p><strong>Bold</strong> and <em>italic</em>.</p>",
    },
  ],
  commonErrors: [
    {
      error: "Table does not render",
      fix: "Ensure each row has the same number of columns and the header separator row uses at least three dashes (`---`) per cell.",
    },
    {
      error: "Code block shows rendered HTML instead of raw code",
      fix: "Wrap the HTML inside a fenced code block with three backticks and specify the language: ```html ... ```.",
    },
  ],
  alternatives: ["StackEdit.io", "Dillinger.io", "Typora"],
};

const grammarChecker: ToolContent = {
  detailedDescription:
    "Check your text for common grammar, spelling, and punctuation issues using a client-side rule engine. Highlights potential errors with suggested corrections. Suitable for quick proofreading of short documents. Note: this is a rule-based checker, not an AI model — for advanced grammar, consider a dedicated tool.",
  howTo: [
    "Paste or type your text into the editor.",
    "Click 'Check Grammar' to run the analysis.",
    "Highlighted errors appear with suggested corrections in a tooltip.",
    "Click a suggestion to apply the correction automatically.",
    "Review all changes before copying the final text.",
  ],
  faq: [
    {
      question: "Does this use an AI language model?",
      answer:
        "No. The tool uses a rule-based grammar engine running locally in the browser. It catches common mistakes but is not as comprehensive as AI-powered tools.",
    },
    {
      question: "Is my text sent to a server?",
      answer:
        "No. All grammar checking runs in your browser. Your text remains private.",
    },
    {
      question: "Can it check non-English text?",
      answer:
        "Currently, the checker is optimized for English. Support for other languages is limited.",
    },
  ],
  useCases: [
    "Quick proofreading of an email before sending",
    "Catching common typos in a blog post draft",
    "Checking subject-verb agreement in a short paragraph",
    "Spotting double words or missing articles",
  ],
  commonErrors: [
    {
      error: "Tool flags correctly spelled words as errors",
      fix: "The dictionary may not include proper nouns or technical terms. Use 'Ignore' to dismiss false positives.",
    },
    {
      error: "No errors found but the text reads awkwardly",
      fix: "Rule-based checkers miss stylistic issues. Use an AI writing assistant like Grammarly or LanguageTool for deeper analysis.",
    },
  ],
  alternatives: ["Grammarly", "LanguageTool", "Hemingway Editor"],
};

const taskReminder: ToolContent = {
  detailedDescription:
    "A lightweight to-do list manager that stores tasks in your browser's `localStorage` so they persist across page reloads — no account or server required. Add tasks with optional due dates, mark them complete, and delete them when done. Data stays on your device.",
  howTo: [
    "Type a task description in the input field and press Enter or click 'Add'.",
    "Optionally set a due date for the task.",
    "Click the checkbox next to a task to mark it as complete.",
    "Click the trash icon to delete a task.",
    "Tasks are automatically saved to localStorage and reload with the page.",
  ],
  faq: [
    {
      question: "Where is my data stored?",
      answer:
        "Tasks are saved in your browser's `localStorage`. They persist as long as you don't clear your browser data.",
    },
    {
      question: "Can I sync tasks across devices?",
      answer:
        "No. `localStorage` is device- and browser-specific. For cross-device sync, use a dedicated app like Todoist or Notion.",
    },
    {
      question: "What happens if I clear my browser data?",
      answer:
        "Clearing cookies and site data will erase your tasks. Export them before clearing if you want to keep them.",
    },
  ],
  useCases: [
    "Keeping a quick to-do list while working in the browser",
    "Tracking tasks for a single project session",
    "Making a shopping list accessible on your desktop",
    "Reminding yourself of steps in a workflow",
  ],
  commonErrors: [
    {
      error: "Tasks disappear after closing the browser",
      fix: "Ensure `localStorage` is not blocked by a browser extension or private/incognito mode. In incognito, `localStorage` is cleared on session end.",
    },
    {
      error: "Tasks don't save in Safari",
      fix: "Safari may block `localStorage` in certain privacy modes. Go to Safari Preferences → Privacy and disable 'Prevent cross-site tracking' for this site.",
    },
  ],
  alternatives: ["Google Tasks", "Todoist", "Apple Reminders"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Image Tools
// ─────────────────────────────────────────────────────────────────────────────

const imageCompress: ToolContent = {
  detailedDescription:
    "Reduce image file sizes using HTML5 Canvas re-encoding with adjustable quality settings. Supports JPEG, PNG, and WebP inputs. Preview the compressed image and compare file sizes before downloading. All processing happens in your browser — images are never uploaded.",
  howTo: [
    "Click or drag-and-drop an image file onto the upload area.",
    "Adjust the quality slider (lower = smaller file, higher = better quality).",
    "Preview the result side by side with the original.",
    "Click 'Download' to save the compressed image.",
  ],
  faq: [
    {
      question: "What formats are supported?",
      answer:
        "Input: JPEG, PNG, WebP, BMP. Output: JPEG or WebP (lossy), PNG (lossless). PNG compression has limits since PNG is already lossless.",
    },
    {
      question: "Why isn't the PNG getting smaller?",
      answer:
        "PNG is a lossless format. Canvas re-encoding cannot reduce its size the way JPEG quality reduction can. Consider converting to WebP for better compression.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "Very large images (over 20 MP) may slow or crash the browser tab due to canvas memory limits. Resize the image first if needed.",
    },
  ],
  useCases: [
    "Compressing product photos before uploading to an online store",
    "Reducing blog post images to improve page load speed",
    "Shrinking screenshots for email attachments",
    "Optimizing images to pass a website performance audit",
  ],
  commonErrors: [
    {
      error: "Compressed file is larger than the original",
      fix: "This can happen if the original JPEG was already highly compressed. Lower the quality setting further or try WebP output.",
    },
    {
      error: "Transparent areas turn black after compression",
      fix: "JPEG does not support transparency. Use PNG or WebP output format to preserve alpha channels.",
    },
  ],
  alternatives: ["Squoosh.app", "TinyPNG", "ImageOptim (macOS)"],
};

const imageConverter: ToolContent = {
  detailedDescription:
    "Convert images between JPEG, PNG, WebP, and BMP formats using the browser's Canvas API. Simply upload an image, choose the output format, and download the converted file. No file is ever sent to a server — conversion is entirely local.",
  howTo: [
    "Upload an image by clicking or dragging it into the tool.",
    "Select the target format from the dropdown (JPEG, PNG, WebP, BMP).",
    "Adjust quality if converting to a lossy format like JPEG or WebP.",
    "Click 'Convert' and then 'Download' to save the output.",
  ],
  faq: [
    {
      question: "Will converting to JPEG lose quality?",
      answer:
        "Yes. JPEG is a lossy format. Each re-encoding introduces some quality loss. Use the quality slider to balance size and fidelity.",
    },
    {
      question: "Can I convert a WebP image to JPEG?",
      answer:
        "Yes. The tool handles WebP input natively in modern browsers (Chrome, Edge, Firefox).",
    },
    {
      question: "Does Safari support WebP?",
      answer:
        "Safari 14+ supports WebP. If you need compatibility with older Safari versions, convert to PNG or JPEG instead.",
    },
  ],
  useCases: [
    "Converting a PNG screenshot to JPEG to reduce file size",
    "Converting WebP images downloaded from the web to JPEG for compatibility",
    "Preparing images in WebP format for a modern website",
    "Converting BMP images from legacy software to a web-friendly format",
  ],
  commonErrors: [
    {
      error: "Transparent PNG turns white after converting to JPEG",
      fix: "JPEG does not support transparency. The transparent areas are filled with white. Use PNG or WebP to retain transparency.",
    },
    {
      error: "Output file is unexpectedly large",
      fix: "You may be converting from a lossy format to a lossless one (e.g., JPEG → PNG). Lossless formats store all pixel data and are typically larger.",
    },
  ],
  alternatives: ["Squoosh.app", "CloudConvert", "GIMP"],
};

const imageResizer: ToolContent = {
  detailedDescription:
    "Resize images to exact pixel dimensions or by a percentage scale using the browser's Canvas API. Optionally lock the aspect ratio to prevent distortion. Supports JPEG, PNG, and WebP. No image data is uploaded — everything is processed locally.",
  howTo: [
    "Upload your image using the file picker or drag-and-drop.",
    "Enter the desired width and/or height in pixels.",
    "Toggle 'Lock aspect ratio' to resize proportionally.",
    "Click 'Resize' to process the image.",
    "Download the resized image.",
  ],
  faq: [
    {
      question: "Can I upscale an image?",
      answer:
        "Yes, but upscaling (increasing dimensions beyond the original) will reduce sharpness because the browser interpolates pixels. There is no AI upscaling.",
    },
    {
      question: "What interpolation method is used?",
      answer:
        "The browser's default canvas interpolation, which is bilinear. It produces smooth results for downscaling and acceptable results for moderate upscaling.",
    },
    {
      question: "Does resizing preserve EXIF metadata?",
      answer:
        "No. Canvas-based processing strips EXIF data (orientation, GPS, camera info). If metadata is important, use a desktop tool like ImageMagick.",
    },
  ],
  useCases: [
    "Resizing a profile photo to the exact dimensions required by a platform",
    "Reducing image dimensions before uploading to a CMS",
    "Creating thumbnail images for a gallery",
    "Preparing images at multiple resolutions for responsive design",
  ],
  commonErrors: [
    {
      error: "Resized image appears stretched",
      fix: "Enable 'Lock aspect ratio' before resizing, or only enter one dimension and let the other calculate automatically.",
    },
    {
      error: "Image appears rotated after resizing",
      fix: "The original image has an EXIF orientation tag that the canvas ignores. Rotate manually using the rotation tool before resizing.",
    },
  ],
  alternatives: ["Squoosh.app", "Bulk Image Resizer", "GIMP"],
};

const imageCrop: ToolContent = {
  detailedDescription:
    "Crop images interactively with freeform selection or locked aspect ratios (1:1, 4:3, 16:9, etc.) using a drag-and-drop crop interface. Preview the crop before applying and download the result. All cropping is done in your browser using Canvas — no upload needed.",
  howTo: [
    "Upload an image using the file picker.",
    "Drag the crop handles to define the crop area, or set a fixed aspect ratio.",
    "Fine-tune the crop region by dragging it.",
    "Click 'Apply Crop' to render the cropped image.",
    "Download the result.",
  ],
  faq: [
    {
      question: "Can I crop to an exact pixel size?",
      answer:
        "Yes. Enter exact pixel values for width and height in the crop settings to define a precise crop region.",
    },
    {
      question: "Does cropping reduce file size?",
      answer:
        "Yes, significantly. A smaller canvas contains fewer pixels and therefore produces a smaller file on export.",
    },
    {
      question: "Can I undo a crop?",
      answer:
        "The original image remains loaded. Simply adjust the crop handles and re-apply without re-uploading.",
    },
  ],
  useCases: [
    "Cropping a profile photo to a square for social media",
    "Removing unwanted borders or watermarks from an image",
    "Extracting a region of interest from a screenshot",
    "Preparing a 16:9 thumbnail for a video upload",
  ],
  commonErrors: [
    {
      error: "Crop area snaps back unexpectedly",
      fix: "If a fixed aspect ratio is locked, the crop area adjusts automatically to maintain the ratio as you resize.",
    },
    {
      error: "Cropped output is blurry",
      fix: "You may have cropped to a very small region and it appears enlarged. Increase the crop area or work with a higher-resolution source image.",
    },
  ],
  alternatives: ["Squoosh.app", "Canva", "GIMP"],
};

const imageBase64: ToolContent = {
  detailedDescription:
    "Convert any image file to a Base64-encoded data URI that can be embedded directly in HTML, CSS, or JSON without referencing an external file. Also decodes data URIs back to downloadable image files. Processing is entirely local — your images are not uploaded anywhere.",
  howTo: [
    "Upload an image file using the file picker.",
    "The Base64 data URI is generated and displayed in the output field.",
    "Copy the full data URI (including the `data:image/...;base64,` prefix) for use in your code.",
    "To decode, paste a data URI into the input and click 'Decode' to download the image.",
  ],
  faq: [
    {
      question: "When should I embed images as Base64?",
      answer:
        "Base64 is useful for small icons and images to eliminate HTTP requests. Avoid it for large images — Base64 adds ~33% overhead to file size.",
    },
    {
      question: "Does it work with SVG files?",
      answer:
        "Yes. SVG can be Base64-encoded, though for SVG it is often more efficient to embed the raw XML directly in HTML.",
    },
    {
      question: "What is the maximum image size?",
      answer:
        "There is no hard limit, but browsers may struggle with very large files. Keep Base64-embedded images under 100 KB for best performance.",
    },
  ],
  useCases: [
    "Embedding a logo in a single-file HTML email template",
    "Inlining a small icon in a CSS `background-image` property",
    "Storing an image in a JSON configuration file",
    "Creating a self-contained HTML page with no external assets",
  ],
  examples: [
    {
      label: "Small PNG to data URI",
      input: "1×1 red pixel PNG",
      output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==",
    },
  ],
  commonErrors: [
    {
      error: "Image does not display in the browser when using the data URI",
      fix: "Ensure the MIME type in the data URI matches the actual file type (e.g., `data:image/png` for a PNG file).",
    },
    {
      error: "Data URI is too long for the use case",
      fix: "Large images produce very long data URIs. Host the image separately and reference it with a normal URL instead.",
    },
  ],
  alternatives: ["Base64Guru.com", "CyberChef", "CSS-Tricks data URI tool"],
};

const bgRemover: ToolContent = {
  detailedDescription:
    "Remove solid-color backgrounds from images using color-tolerance-based pixel replacement directly in the browser canvas. Best suited for images with a uniform background color (e.g., white product photos). More complex backgrounds may need a dedicated AI tool. No image is uploaded to any server.",
  howTo: [
    "Upload your image using the file picker.",
    "Click the background color (or use the color picker to specify it).",
    "Adjust the color tolerance slider to control how aggressively similar colors are removed.",
    "Preview the result — the removed area is shown as a transparent checkerboard.",
    "Download the image as a PNG (transparency is preserved).",
  ],
  faq: [
    {
      question: "Does this use AI to remove backgrounds?",
      answer:
        "No. The tool uses color-based pixel matching, which works well for uniform backgrounds but not complex or gradient backgrounds. For AI removal, see the alternatives.",
    },
    {
      question: "Why are parts of the subject being removed?",
      answer:
        "The tolerance is too high, removing pixels with colors similar to the background. Reduce the tolerance slider.",
    },
    {
      question: "What output format preserves transparency?",
      answer:
        "Download as PNG. JPEG does not support transparency.",
    },
  ],
  useCases: [
    "Removing the white background from product photos",
    "Isolating a logo from a solid-color background",
    "Preparing images for a transparent overlay on a slide deck",
    "Cleaning up scanned documents with a uniform background",
  ],
  commonErrors: [
    {
      error: "Background partially removed with visible fringe",
      fix: "Increase the tolerance slightly. If fringe persists, use a higher-quality source image with a cleaner background.",
    },
    {
      error: "Subject has the same color as the background",
      fix: "Color-based removal cannot distinguish subject from background in this case. Use an AI background removal tool instead.",
    },
  ],
  alternatives: ["remove.bg", "Adobe Express Background Remover", "Canva Background Remover"],
};

// ─────────────────────────────────────────────────────────────────────────────
// PDF Tools
// ─────────────────────────────────────────────────────────────────────────────

const compressPdf: ToolContent = {
  detailedDescription:
    "Reduce the file size of a PDF by re-encoding it using pdf-lib in the browser. Removes redundant objects and optionally recompresses embedded images. The original file is never uploaded — all processing happens locally in your browser tab.",
  howTo: [
    "Click 'Upload PDF' and select your file.",
    "Choose a compression level (low, medium, high).",
    "Click 'Compress' and wait for processing to complete.",
    "Compare the original and compressed file sizes shown.",
    "Click 'Download' to save the compressed PDF.",
  ],
  faq: [
    {
      question: "How much smaller will the PDF get?",
      answer:
        "Results vary. PDFs with embedded high-resolution images can shrink significantly. Text-only PDFs may see little reduction since text is already compact.",
    },
    {
      question: "Will the compressed PDF look different?",
      answer:
        "At low compression, the visual difference is minimal. At high compression, embedded images may appear softer. Text quality is unaffected.",
    },
    {
      question: "Is the PDF uploaded to a server?",
      answer:
        "No. The PDF is processed entirely in your browser using pdf-lib compiled to WebAssembly. Nothing is transmitted.",
    },
    {
      question: "Does this work with password-protected PDFs?",
      answer:
        "No. Encrypted or password-protected PDFs cannot be processed without the password.",
    },
  ],
  useCases: [
    "Shrinking a large PDF report before emailing it",
    "Reducing a portfolio PDF to meet an upload size limit",
    "Compressing scanned document PDFs for archiving",
    "Preparing a PDF for uploading to a web form with file size restrictions",
  ],
  commonErrors: [
    {
      error: "Compressed file is the same size as the original",
      fix: "The PDF may already be well-optimized. Text-heavy PDFs with minimal images have little room for compression.",
    },
    {
      error: "PDF becomes corrupted after compression",
      fix: "Some PDFs use non-standard structures that pdf-lib cannot safely process. Try with a different PDF or use a desktop tool.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "Ghostscript (CLI)"],
};

const mergePdf: ToolContent = {
  detailedDescription:
    "Combine multiple PDF files into a single document in any order using pdf-lib running in your browser. Drag and drop files to reorder them before merging. No files are sent to a server — merging is entirely local.",
  howTo: [
    "Upload two or more PDF files using the file picker or drag-and-drop.",
    "Drag the files in the list to set the desired page order.",
    "Click 'Merge PDFs'.",
    "Download the merged PDF when processing completes.",
  ],
  faq: [
    {
      question: "Is there a limit on the number of files I can merge?",
      answer:
        "There is no hard limit, but very large or numerous PDFs may exhaust browser memory. Merging up to 20 typical documents is generally reliable.",
    },
    {
      question: "Are bookmarks and links preserved?",
      answer:
        "Internal links may break after merging since page numbers shift. External links and basic content are preserved.",
    },
    {
      question: "Can I merge password-protected PDFs?",
      answer:
        "No. Encrypted PDFs must be unlocked first. Use a PDF reader to remove the password, then merge.",
    },
  ],
  useCases: [
    "Combining multiple invoice PDFs into a single monthly report",
    "Assembling chapters of a document written in separate files",
    "Merging a cover page with a main document",
    "Combining form pages before submission",
  ],
  commonErrors: [
    {
      error: "Some pages are blank in the merged PDF",
      fix: "The source PDF may have blank pages intentionally, or it uses features (like embedded forms) that pdf-lib renders as blank. Inspect the source files.",
    },
    {
      error: "Merge fails with a large number of files",
      fix: "Split the task into two batches. Merge the first half, then merge that result with the second half.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "PDFtk (CLI)"],
};

const splitPdf: ToolContent = {
  detailedDescription:
    "Extract specific pages or page ranges from a PDF to create new, smaller documents. Built on pdf-lib running locally in the browser — your PDF is never uploaded anywhere. Useful for sharing only the relevant pages of a large document.",
  howTo: [
    "Upload your PDF file.",
    "Enter the pages or page ranges to extract (e.g., `1-3, 5, 8-10`).",
    "Click 'Split'.",
    "Download the extracted pages as a new PDF.",
  ],
  faq: [
    {
      question: "Can I split every page into a separate PDF?",
      answer:
        "Yes. Select 'Extract each page' mode to get one PDF file per page, packaged in a ZIP download.",
    },
    {
      question: "Does the page numbering start at 1?",
      answer:
        "Yes. Page numbers in the tool are 1-indexed to match the physical page order.",
    },
    {
      question: "Are annotations and form fields preserved?",
      answer:
        "Basic annotations are preserved. Complex interactive forms may not retain all functionality after splitting.",
    },
  ],
  useCases: [
    "Extracting a single chapter from a large eBook PDF",
    "Sharing specific slides from a PDF presentation",
    "Separating receipts from a merged expense report",
    "Extracting a signed signature page from a contract",
  ],
  commonErrors: [
    {
      error: "Entered page number is out of range",
      fix: "The tool shows the total page count after upload. Ensure your page numbers do not exceed this count.",
    },
    {
      error: "Downloaded ZIP is empty",
      fix: "Check that 'Extract each page' was selected and the PDF loaded correctly. Re-upload and try again.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "PDFtk (CLI)"],
};

const imageToPdf: ToolContent = {
  detailedDescription:
    "Combine one or more images (JPEG, PNG, WebP) into a single PDF document using pdf-lib in the browser. Arrange images in order, choose page orientation, and download the result instantly. No images are uploaded to any server.",
  howTo: [
    "Upload one or more images using the file picker.",
    "Drag images to reorder them as desired.",
    "Choose page size (A4, Letter) and orientation (portrait/landscape).",
    "Click 'Convert to PDF' and download the result.",
  ],
  faq: [
    {
      question: "Each image becomes one page?",
      answer:
        "Yes. Each uploaded image is placed on its own PDF page, scaled to fit the chosen page dimensions.",
    },
    {
      question: "Is image quality reduced in the PDF?",
      answer:
        "Images are embedded at their original resolution. If you chose a page size smaller than the image, it will be scaled down proportionally.",
    },
    {
      question: "Can I add a scanned multi-page document?",
      answer:
        "Yes. Upload each scanned page as a separate image and the tool will compile them into a multi-page PDF.",
    },
  ],
  useCases: [
    "Scanning physical documents by photographing each page",
    "Combining receipt photos into a single PDF for expense reporting",
    "Creating a photo album in PDF format",
    "Submitting multiple images as a single file to a portal",
  ],
  commonErrors: [
    {
      error: "Images appear rotated in the PDF",
      fix: "Rotate the images before uploading, or use an image editor to correct orientation. EXIF rotation data is not always respected.",
    },
    {
      error: "PDF file is very large",
      fix: "Compress the source images first using the Image Compress tool before converting to PDF.",
    },
  ],
  alternatives: ["ilovepdf.com", "Smallpdf.com", "Adobe Acrobat"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Calculators
// ─────────────────────────────────────────────────────────────────────────────

const emiCalculator: ToolContent = {
  detailedDescription:
    "Calculate the monthly Equated Monthly Installment (EMI) for any loan given the principal amount, annual interest rate, and loan tenure. Also shows a full amortisation schedule breaking down principal and interest per month. All calculations run in the browser.",
  howTo: [
    "Enter the loan principal amount.",
    "Enter the annual interest rate as a percentage.",
    "Enter the loan tenure in months or years.",
    "Click 'Calculate' to see the monthly EMI, total interest paid, and total repayment.",
    "Scroll down to view the month-by-month amortisation table.",
  ],
  faq: [
    {
      question: "What formula is used?",
      answer:
        "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P = principal, r = monthly interest rate (annual rate / 12 / 100), n = tenure in months.",
    },
    {
      question: "Does this account for processing fees or prepayment?",
      answer:
        "The standard EMI formula does not include fees. Add the fee to the principal to approximate the total cost.",
    },
    {
      question: "Can I compare multiple loan options?",
      answer:
        "Run the calculator multiple times with different inputs and compare the results side by side.",
    },
  ],
  useCases: [
    "Estimating monthly payments before applying for a home loan",
    "Comparing EMIs for different loan tenures to find an affordable option",
    "Understanding how much of each payment goes to interest vs. principal",
    "Planning a car loan budget",
  ],
  commonErrors: [
    {
      error: "EMI seems too high",
      fix: "Double-check that the interest rate is entered as an annual percentage (e.g., 8.5), not a monthly rate.",
    },
    {
      error: "Tenure entered in years but EMI is wrong",
      fix: "Ensure you selected the correct unit (years or months) for the tenure field.",
    },
  ],
  alternatives: ["BankBazaar EMI Calculator", "ET Money Calculator", "Excel PMT function"],
};

const sipCalculator: ToolContent = {
  detailedDescription:
    "Calculate the future value of a Systematic Investment Plan (SIP) with optional annual step-up (increasing the monthly investment by a fixed percentage each year). Shows total invested, estimated returns, and final corpus. Uses standard compound interest formulas — all calculated locally.",
  howTo: [
    "Enter your monthly SIP amount.",
    "Enter the expected annual return rate (e.g., 12 for 12%).",
    "Enter the investment duration in years.",
    "Optionally enable step-up SIP and enter the annual increase percentage.",
    "Click 'Calculate' to see the projected wealth breakdown.",
  ],
  faq: [
    {
      question: "Is the return guaranteed?",
      answer:
        "No. The tool uses a fixed assumed return rate for illustration. Actual mutual fund returns vary and are not guaranteed.",
    },
    {
      question: "What is a step-up SIP?",
      answer:
        "A step-up SIP increases your monthly investment amount by a fixed percentage each year, helping you invest more as your income grows.",
    },
    {
      question: "Does the calculator account for inflation?",
      answer:
        "Not by default. To estimate real returns, subtract the expected inflation rate from your expected return rate.",
    },
    {
      question: "What return rate should I use?",
      answer:
        "Historical Indian equity mutual fund returns have averaged 10–15% annually over long periods. Use 10–12% for a conservative projection.",
    },
  ],
  useCases: [
    "Planning retirement savings with monthly mutual fund investments",
    "Comparing SIP returns at different investment horizons",
    "Understanding the power of compounding over 20+ years",
    "Setting a monthly savings goal to reach a target corpus",
  ],
  commonErrors: [
    {
      error: "Projected corpus seems unrealistically high",
      fix: "Verify the return rate entered. 20%+ is aggressive; use 10–12% for realistic long-term projections.",
    },
    {
      error: "Step-up SIP total differs from manual calculations",
      fix: "Step-up calculations are compounded annually. Each year's monthly amount is increased by the step-up %, which compounds the effect.",
    },
  ],
  alternatives: ["Groww SIP Calculator", "ET Money SIP Calculator", "Zerodha Varsity"],
};

const ageCalculator: ToolContent = {
  detailedDescription:
    "Calculate your exact age in years, months, and days from a birth date to today or any target date. Also shows the day of the week you were born and how many days remain until your next birthday. All calculations are done in the browser.",
  howTo: [
    "Enter your date of birth using the date picker.",
    "Optionally enter a target date (defaults to today).",
    "Click 'Calculate Age' to see the result.",
    "View your age broken down into years, months, and days.",
  ],
  faq: [
    {
      question: "How are months calculated?",
      answer:
        "The tool counts complete calendar months. Partial months are represented by the remaining days.",
    },
    {
      question: "Does it handle leap years?",
      answer:
        "Yes. Leap years are accounted for when counting days, so ages across February 29 are calculated correctly.",
    },
    {
      question: "Can I calculate the age difference between two people?",
      answer:
        "Enter one person's birth date as the 'from' date and the other's birth date as the 'to' date to find the exact difference.",
    },
  ],
  useCases: [
    "Calculating exact age for official forms requiring years, months, and days",
    "Finding the day of the week you were born",
    "Checking how many days until your next birthday",
    "Calculating the age of a pet, document, or building",
  ],
  commonErrors: [
    {
      error: "Age is off by one day",
      fix: "Check whether the target date is set to today's date in the correct timezone. The tool uses the browser's local date.",
    },
    {
      error: "Future birth date entered by mistake",
      fix: "The tool requires the birth date to be earlier than the target date. Entering a future birth date produces an error.",
    },
  ],
  alternatives: ["timeanddate.com Age Calculator", "Calculator.net", "Wolfram Alpha"],
};

const compoundInterest: ToolContent = {
  detailedDescription:
    "Calculate the future value of an investment using the compound interest formula. Supports different compounding frequencies (daily, monthly, quarterly, annually) and an optional regular contribution. Shows a year-by-year growth chart and breakdown. All calculations run locally.",
  howTo: [
    "Enter the principal (initial investment).",
    "Enter the annual interest rate.",
    "Enter the investment period in years.",
    "Choose compounding frequency.",
    "Optionally add a monthly contribution and click 'Calculate'.",
  ],
  faq: [
    {
      question: "What is the formula used?",
      answer:
        "A = P × (1 + r/n)^(n×t), where P = principal, r = annual rate, n = compounding periods per year, t = years.",
    },
    {
      question: "What compounding frequency is best?",
      answer:
        "More frequent compounding yields slightly higher returns. Daily compounding gives marginally more than annual, but the difference diminishes with lower rates.",
    },
    {
      question: "How does a regular contribution affect the result?",
      answer:
        "Regular contributions are compounded from the time they are added, significantly boosting long-term growth — this is the core principle behind SIP investing.",
    },
  ],
  useCases: [
    "Projecting the growth of a fixed deposit or savings account",
    "Comparing compounding frequencies when evaluating financial products",
    "Understanding how reinvesting dividends compounds returns",
    "Setting a savings goal and working backwards to find the required principal",
  ],
  commonErrors: [
    {
      error: "Result doesn't match the bank's stated maturity amount",
      fix: "Banks may use slightly different compounding conventions or charge fees. Use the bank's own calculator for precise figures.",
    },
    {
      error: "Entered rate as a decimal instead of percentage",
      fix: "Enter 8 for 8%, not 0.08. The tool expects a percentage value.",
    },
  ],
  alternatives: ["Investor.gov Compound Interest Calculator", "Excel FV function", "MoneyChimp"],
};

const gstCalculator: ToolContent = {
  detailedDescription:
    "Add GST to a base price or extract (remove) GST from an inclusive price for any Indian GST slab (5%, 12%, 18%, 28%). Shows CGST, SGST, and IGST breakdowns. Useful for invoicing and tax reconciliation. All calculations are local.",
  howTo: [
    "Enter the amount (base price or GST-inclusive price).",
    "Select the GST rate from the dropdown (5%, 12%, 18%, 28%).",
    "Choose 'Add GST' or 'Remove GST'.",
    "View the breakdown: base amount, CGST, SGST (or IGST), and total.",
  ],
  faq: [
    {
      question: "What is the difference between CGST/SGST and IGST?",
      answer:
        "For intrastate transactions (within the same state), GST is split into CGST (central) and SGST (state) at half the rate each. For interstate transactions, the full GST is charged as IGST.",
    },
    {
      question: "How do I reverse-calculate GST from an inclusive price?",
      answer:
        "Select 'Remove GST'. For example, a ₹118 inclusive amount at 18% GST has a base price of ₹100 (₹118 / 1.18).",
    },
    {
      question: "Is cess included in the calculation?",
      answer:
        "No. Cess (e.g., compensation cess on luxury goods) is not included. Add it manually on top of the calculated GST.",
    },
  ],
  useCases: [
    "Calculating the GST amount to add on a client invoice",
    "Finding the pre-GST price from a GST-inclusive bill",
    "Verifying the GST breakdown on a purchase receipt",
    "Computing CGST and SGST split for state-level filings",
  ],
  commonErrors: [
    {
      error: "GST amount seems too high",
      fix: "Ensure you selected the correct GST slab. Common slabs are 5% for essentials, 12%/18% for goods and services, and 28% for luxury items.",
    },
    {
      error: "Result differs slightly from the invoice",
      fix: "Invoices may round amounts differently. The tool uses standard rounding — minor differences of ₹0.01 are normal.",
    },
  ],
  alternatives: ["GST.gov.in calculator", "ClearTax GST Calculator", "Zoho GST Calculator"],
};

const percentageCalculator: ToolContent = {
  detailedDescription:
    "A versatile percentage calculator covering the most common percentage operations: percentage of a number, percentage change between two values, and finding what percentage one number is of another. Results are instant and displayed with working steps for clarity.",
  howTo: [
    "Select the type of calculation from the tabs.",
    "Enter the required values in the input fields.",
    "The result is calculated and displayed instantly.",
    "Use the 'Show steps' toggle to see the formula and working.",
  ],
  faq: [
    {
      question: "How do I calculate a percentage increase?",
      answer:
        "Use the 'Percentage Change' tab. Enter the original value and the new value. The tool calculates ((new - original) / original) × 100.",
    },
    {
      question: "What is 'X is what % of Y'?",
      answer:
        "This answers questions like 'What percentage of 200 is 50?' The answer is (50 / 200) × 100 = 25%.",
    },
    {
      question: "How do I find Y% of X?",
      answer:
        "Use the 'Percentage Of' tab. Enter X as the base and Y as the percentage. The result is (Y / 100) × X.",
    },
  ],
  useCases: [
    "Calculating a percentage discount on a purchase",
    "Finding the percentage increase in monthly sales",
    "Computing the percentage of marks scored in an exam",
    "Splitting a tip as a percentage of a restaurant bill",
  ],
  commonErrors: [
    {
      error: "Result is multiplied by 100 when it shouldn't be",
      fix: "Ensure you're using the correct tab. 'Percentage of' gives the raw number; 'What percent is X of Y' gives the percentage figure.",
    },
  ],
  alternatives: ["Calculator.net Percent Calculator", "RapidTables.com", "Wolfram Alpha"],
};

const salaryCalculator: ToolContent = {
  detailedDescription:
    "Break down an Indian CTC (Cost to Company) package into its take-home components: basic salary, HRA, PF, professional tax, income tax (new regime), and net monthly in-hand salary. Uses standard Indian payroll formulas. All calculations are local — no data is sent anywhere.",
  howTo: [
    "Enter your annual CTC in the input field.",
    "Optionally enter your city type (metro/non-metro) for the HRA calculation.",
    "Select the tax regime (old or new) if applicable.",
    "Click 'Calculate' to see the full salary breakdown.",
    "Download or share the breakdown if needed.",
  ],
  faq: [
    {
      question: "Is this calculation accurate for all employers?",
      answer:
        "The tool uses typical CTC structures. Actual figures may vary by company HR policy, state-specific professional tax rates, and benefits structure.",
    },
    {
      question: "What is included in CTC?",
      answer:
        "CTC includes basic salary, HRA, special allowances, and employer PF contribution. Actual take-home excludes the employer PF and deducts employee PF, professional tax, and income tax.",
    },
    {
      question: "Which tax regime is used by default?",
      answer:
        "The new tax regime (introduced under Finance Act 2020, updated in 2023 Budget) is often used as the default. You can switch to the old regime to compare.",
    },
  ],
  useCases: [
    "Understanding your take-home from a job offer",
    "Comparing two job offers with different CTC structures",
    "Estimating income tax liability before filing a return",
    "Explaining salary components to a new employee",
  ],
  commonErrors: [
    {
      error: "Calculated in-hand is much lower than expected",
      fix: "Verify that your CTC input is the annual figure, not the monthly figure. Also check that the PF and PT deductions are correctly set.",
    },
    {
      error: "Tax deduction seems too high",
      fix: "The old tax regime applies deductions and exemptions. Switch to the new regime or add exemptions (80C, HRA) to reduce taxable income.",
    },
  ],
  alternatives: ["ET Money Salary Calculator", "ClearTax Salary Calculator", "AmbitionBox CTC Calculator"],
};

const currencyConverter: ToolContent = {
  detailedDescription:
    "Convert between world currencies using live exchange rates fetched from a public API. Supports 150+ currencies including INR, USD, EUR, GBP, JPY, and AED. The rates are updated periodically and the conversion itself runs in your browser.",
  howTo: [
    "Select the source currency from the 'From' dropdown.",
    "Select the target currency from the 'To' dropdown.",
    "Enter the amount to convert.",
    "The converted amount and the current exchange rate are displayed instantly.",
    "Click the swap icon to reverse the conversion.",
  ],
  faq: [
    {
      question: "How current are the exchange rates?",
      answer:
        "Rates are fetched from a live API and are typically updated every few hours. For financial transactions, always verify with your bank or broker.",
    },
    {
      question: "Are mid-market rates used?",
      answer:
        "Yes. The tool uses mid-market (interbank) rates. Actual conversion rates at banks or money exchanges include a margin.",
    },
    {
      question: "Does it work offline?",
      answer:
        "No. The tool requires an internet connection to fetch current rates. Cached rates may be shown if the API is unreachable.",
    },
  ],
  useCases: [
    "Checking the equivalent cost of a foreign product in INR",
    "Converting travel expenses for reimbursement reports",
    "Comparing prices across countries for international purchases",
    "Quick reference during international money transfers",
  ],
  commonErrors: [
    {
      error: "Rate differs from the bank or money exchange",
      fix: "Banks add a spread of 1–3% to the mid-market rate. This tool shows the mid-market rate only.",
    },
    {
      error: "Currency not found in the list",
      fix: "Some exotic or restricted currencies may not be available. Use the search in the dropdown to verify the currency code.",
    },
  ],
  alternatives: ["XE.com", "Google currency conversion", "OANDA"],
};

const unitConverter: ToolContent = {
  detailedDescription:
    "Convert units across categories including length, weight, volume, temperature, speed, area, and time. All conversion factors are hard-coded and accurate — no internet connection required. Conversion is instant and runs entirely in the browser.",
  howTo: [
    "Select the unit category (e.g., Length, Weight, Temperature).",
    "Enter the value to convert in the left input.",
    "Select the source unit and the target unit from the dropdowns.",
    "The converted value updates instantly.",
  ],
  faq: [
    {
      question: "Does it support metric and imperial units?",
      answer:
        "Yes. Both metric (km, kg, L, °C) and imperial (mi, lb, fl oz, °F) units are supported across all categories.",
    },
    {
      question: "How is temperature conversion handled?",
      answer:
        "Temperature uses additive formulas (e.g., °C to °F: multiply by 9/5 and add 32), not a simple multiplication factor.",
    },
    {
      question: "Can I convert cooking measurements?",
      answer:
        "Yes. Volume conversion includes cups, tablespoons, teaspoons, fl oz, mL, and L.",
    },
  ],
  useCases: [
    "Converting recipe measurements from US cups to millilitres",
    "Converting a vehicle speed from mph to km/h",
    "Checking a running pace in minutes per kilometre vs. per mile",
    "Converting property area from square feet to square metres",
  ],
  examples: [
    {
      label: "Miles to kilometres",
      input: "5 miles",
      output: "8.047 km",
    },
    {
      label: "Fahrenheit to Celsius",
      input: "98.6 °F",
      output: "37 °C",
    },
  ],
  commonErrors: [
    {
      error: "Temperature conversion gives a nonsensical result",
      fix: "Temperature is not a multiplicative conversion. Ensure you selected the Temperature category, not a generic multiplier.",
    },
    {
      error: "Result has many decimal places",
      fix: "Round to the required precision. The tool displays full precision to avoid rounding errors in chained conversions.",
    },
  ],
  alternatives: ["UnitConverters.net", "Google unit conversion", "Wolfram Alpha"],
};

const dateCalculator: ToolContent = {
  detailedDescription:
    "Add or subtract days, weeks, months, or years from a given date, or calculate the exact difference between two dates in multiple units. Handles daylight saving transitions and leap years correctly. Useful for deadline calculations, project planning, and scheduling.",
  howTo: [
    "To find a future or past date: enter the start date, select an operation (add/subtract), and enter the number of days/weeks/months/years.",
    "To find the difference between two dates: enter both dates in the 'Date Difference' tab.",
    "The result is displayed in days, weeks, months, and years.",
  ],
  faq: [
    {
      question: "Does it account for leap years?",
      answer:
        "Yes. JavaScript's Date object, which powers the tool, handles leap years and varying month lengths automatically.",
    },
    {
      question: "Can I add business days only (excluding weekends)?",
      answer:
        "Yes, if the tool has a 'business days' mode. Enable it to skip Saturdays and Sundays when adding or subtracting days.",
    },
    {
      question: "Are public holidays excluded?",
      answer:
        "Public holidays are not excluded by default as they vary by country. Use the business-days mode for weekend exclusion only.",
    },
  ],
  useCases: [
    "Finding the deadline date N days from today",
    "Calculating how many days until a project delivery",
    "Determining someone's age in total days",
    "Computing the number of days between two contract dates",
  ],
  examples: [
    {
      label: "Add 90 days to today",
      input: "2026-05-07 + 90 days",
      output: "2026-08-05",
    },
  ],
  commonErrors: [
    {
      error: "Date result is off by one day",
      fix: "This may be a timezone issue. The tool uses the browser's local timezone. Dates near midnight may shift in UTC.",
    },
    {
      error: "Adding months gives an unexpected end date",
      fix: "Adding a month to January 31 gives February 28/29 (the last day of the month), which is the standard behaviour.",
    },
  ],
  alternatives: ["timeanddate.com Date Calculator", "Calculator.net", "Wolfram Alpha"],
};

const discountCalculator: ToolContent = {
  detailedDescription:
    "Calculate the sale price after applying a percentage discount, the percentage discount from original and sale prices, or the original price from a sale price and discount percentage. Also shows total savings. All calculations run instantly in the browser.",
  howTo: [
    "Select the calculation mode: 'Final Price', 'Discount %', or 'Original Price'.",
    "Enter the known values.",
    "The missing value and total savings are displayed immediately.",
  ],
  faq: [
    {
      question: "Can I apply multiple discounts?",
      answer:
        "Apply them sequentially: calculate the price after the first discount, then apply the second discount to that result. The total is not the sum of both percentages.",
    },
    {
      question: "How do I find the original price from a sale price?",
      answer:
        "Use the 'Original Price' mode. Enter the sale price and the discount percentage and the tool back-calculates: Original = Sale / (1 - Discount/100).",
    },
  ],
  useCases: [
    "Checking the final price of a product during a sale",
    "Calculating how much you save with a coupon code",
    "Finding the original price of a clearance item",
    "Comparing two sales offers to find the better deal",
  ],
  examples: [
    {
      label: "30% off ₹2,500",
      input: "Original: ₹2500, Discount: 30%",
      output: "Sale price: ₹1750, Savings: ₹750",
    },
  ],
  commonErrors: [
    {
      error: "Combined discounts don't add up to the sum of percentages",
      fix: "Stacked discounts are multiplicative, not additive. A 20% then 10% discount is equivalent to a 28% total discount, not 30%.",
    },
    {
      error: "Result is the discount amount, not the final price",
      fix: "Ensure you are viewing the 'Final Price' field, not the 'Savings' field.",
    },
  ],
  alternatives: ["Calculator.net Discount Calculator", "Omni Calculator", "Google search ('X% of Y')"],
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO Tools
// ─────────────────────────────────────────────────────────────────────────────

const slugGenerator: ToolContent = {
  detailedDescription:
    "Convert any page title or phrase into a clean, SEO-friendly URL slug. Removes special characters, converts spaces to hyphens, lowercases everything, and strips common stop words optionally. Generates slugs instantly in the browser — no server required.",
  howTo: [
    "Type or paste your page title into the input field.",
    "The slug is generated instantly below.",
    "Toggle 'Remove stop words' to strip common words (the, a, an, in, etc.) for a shorter slug.",
    "Copy the slug and use it in your CMS or URL structure.",
  ],
  faq: [
    {
      question: "Why should I use hyphens instead of underscores?",
      answer:
        "Google treats hyphens as word separators and underscores as word joiners. Use hyphens for SEO-friendly URLs.",
    },
    {
      question: "What characters are removed?",
      answer:
        "All characters that are not alphanumeric or hyphens are removed. Accented characters (é, ñ, ü) are transliterated to ASCII equivalents.",
    },
    {
      question: "Should I include stop words in the slug?",
      answer:
        "Short, descriptive slugs are preferred. Removing stop words (the, is, of) makes slugs shorter and cleaner without losing keyword value.",
    },
  ],
  useCases: [
    "Generating a URL slug for a new blog post",
    "Creating consistent URL patterns for a product catalogue",
    "Converting user-submitted titles to safe URL components",
    "Batch-generating slugs for an imported content library",
  ],
  examples: [
    {
      label: "Blog post title to slug",
      input: "10 Tips for Better SEO in 2025!",
      output: "10-tips-for-better-seo-in-2025",
    },
    {
      label: "Title with accents",
      input: "Café au Lait Recipe",
      output: "cafe-au-lait-recipe",
    },
  ],
  commonErrors: [
    {
      error: "Slug contains consecutive hyphens",
      fix: "The tool should collapse multiple hyphens into one. If not, remove special characters from the source title before generating.",
    },
    {
      error: "Slug starts or ends with a hyphen",
      fix: "Leading and trailing hyphens are trimmed automatically. If they persist, check for leading/trailing spaces in the input.",
    },
  ],
  alternatives: ["Slugify.online", "SEOBook Slug Generator", "Yoast SEO plugin (WordPress)"],
};

const metaTags: ToolContent = {
  detailedDescription:
    "Generate complete HTML meta tag markup for a web page including title, description, Open Graph, Twitter Card, and basic SEO tags. Preview how the tags will appear in search results and social media shares. Copy the generated HTML and paste it into your page's `<head>`.",
  howTo: [
    "Fill in the page title, description, URL, and optional image URL.",
    "Select the content type (website, article, product).",
    "Preview the search snippet and social media card previews.",
    "Click 'Copy HTML' to copy all meta tags ready to paste.",
  ],
  faq: [
    {
      question: "What is the ideal meta description length?",
      answer:
        "Google typically displays up to 155–160 characters. Keep descriptions between 120–155 characters for best display across devices.",
    },
    {
      question: "Do meta keywords still matter for SEO?",
      answer:
        "No. Google, Bing, and other major search engines have ignored the `keywords` meta tag for many years. Focus on title and description.",
    },
    {
      question: "What is the difference between og:image and twitter:image?",
      answer:
        "They serve the same purpose but for different platforms. Twitter Card tags take precedence on Twitter; og: tags are used by Facebook, LinkedIn, and others.",
    },
  ],
  useCases: [
    "Adding Open Graph tags to a new landing page",
    "Generating Twitter Card markup for article pages",
    "Creating consistent meta tags across a site",
    "Auditing what meta tags a page currently has before adding more",
  ],
  examples: [
    {
      label: "Basic page meta tags",
      input: 'Title: "KaruviLab Tools", Desc: "Free browser-based tools for developers"',
      output: '<meta name="description" content="Free browser-based tools for developers">\n<meta property="og:title" content="KaruviLab Tools">',
    },
  ],
  commonErrors: [
    {
      error: "og:image not showing on social media",
      fix: "The image must be an absolute URL (starting with https://). Local or relative paths do not work. Also ensure the image is at least 1200×630 pixels.",
    },
    {
      error: "Title is truncated in search results",
      fix: "Keep the title under 60 characters. Google truncates titles longer than approximately 580px wide.",
    },
  ],
  alternatives: ["Metatags.io", "HeyMeta.com", "Yoast SEO"],
};

const ogPreview: ToolContent = {
  detailedDescription:
    "Simulate how a URL's Open Graph (og:) meta tags will appear when shared on Facebook, Twitter, LinkedIn, and WhatsApp. Enter a URL or paste og: tags directly to see the social media card preview. All rendering is done in the browser — the tool fetches the URL via a proxy or reads pasted tags.",
  howTo: [
    "Enter the URL of the page you want to preview, or paste your og: meta tags directly.",
    "Select the platform tab (Facebook, Twitter, LinkedIn, WhatsApp).",
    "The rendered preview card is displayed.",
    "Adjust your meta tags based on the preview and regenerate.",
  ],
  faq: [
    {
      question: "Why does the preview look different from the actual shared card?",
      answer:
        "Social platforms cache og: data. After updating tags, use the platform's own debugging tool (e.g., Facebook Sharing Debugger) to force a cache refresh.",
    },
    {
      question: "What image size does Facebook recommend?",
      answer:
        "Facebook recommends 1200×630 pixels for the best display across desktop and mobile.",
    },
    {
      question: "What is the og:type tag?",
      answer:
        "`og:type` describes the content type (e.g., `website`, `article`, `product`). The correct type affects how the card is rendered on some platforms.",
    },
  ],
  useCases: [
    "Previewing a blog post's share card before publishing",
    "Testing Open Graph tags for a product page",
    "Verifying that og:image loads correctly at the correct aspect ratio",
    "Comparing card appearance across different platforms",
  ],
  commonErrors: [
    {
      error: "Preview shows no image",
      fix: "Check that `og:image` contains an absolute HTTPS URL to an accessible image. Images behind authentication or on localhost will not load.",
    },
    {
      error: "Old image or description still shows",
      fix: "Use the platform's cache-clearing tool (Facebook Sharing Debugger, LinkedIn Post Inspector) to force a refresh of the cached og: data.",
    },
  ],
  alternatives: ["Facebook Sharing Debugger", "LinkedIn Post Inspector", "Twitter Card Validator"],
};

const sitemapGenerator: ToolContent = {
  detailedDescription:
    "Build a standards-compliant XML sitemap by entering your URLs along with priority, change frequency, and last modification date. Download the ready-to-upload `sitemap.xml` file. The sitemap is generated entirely in the browser — no crawling or server-side processing required.",
  howTo: [
    "Enter your website's base URL.",
    "Add URLs one by one using the form, or paste a list of URLs.",
    "For each URL, set the priority (0.1 to 1.0) and change frequency.",
    "Click 'Generate Sitemap' to produce the XML.",
    "Download `sitemap.xml` and upload it to your website's root directory.",
  ],
  faq: [
    {
      question: "Does Google require a sitemap?",
      answer:
        "Not strictly, but a sitemap helps Google discover all pages on your site, especially for large or new sites with few inbound links.",
    },
    {
      question: "What is the priority attribute used for?",
      answer:
        "Priority (0.1–1.0) indicates the relative importance of pages on your site. It only affects how Google prioritizes crawling your own pages — it has no impact on ranking.",
    },
    {
      question: "How do I submit the sitemap to Google?",
      answer:
        "Upload `sitemap.xml` to your site root, then submit the URL (e.g., `https://yourdomain.com/sitemap.xml`) via Google Search Console under Sitemaps.",
    },
    {
      question: "What is the maximum number of URLs in a sitemap?",
      answer:
        "A single sitemap file can contain up to 50,000 URLs and must be under 50 MB uncompressed. For larger sites, use a sitemap index file.",
    },
  ],
  useCases: [
    "Creating a sitemap for a new website before launch",
    "Regenerating a sitemap after adding new pages",
    "Submitting additional URLs to Google Search Console",
    "Building a sitemap for a static site that has no CMS plugin",
  ],
  commonErrors: [
    {
      error: "Google rejects the sitemap with 'Could not fetch'",
      fix: "Ensure the sitemap file is uploaded to the website's root at the exact URL you submitted. Also check that the file is publicly accessible.",
    },
    {
      error: "URLs with query strings are not indexing",
      fix: "Canonicalize parameterized URLs and include only the canonical version in the sitemap. Use `<link rel='canonical'>` on the pages themselves.",
    },
  ],
  alternatives: ["XML-Sitemaps.com", "Screaming Frog (crawl-based)", "Yoast SEO (WordPress)"],
};

const robotsTxt: ToolContent = {
  detailedDescription:
    "Generate a valid `robots.txt` file using a visual rule builder. Add allow/disallow rules for specific user agents (Googlebot, Bingbot, or all bots), set the sitemap URL, and set crawl delay. Download the ready-to-deploy file. All generation happens in the browser.",
  howTo: [
    "Add user agent rules using the form (choose 'All' or a specific bot).",
    "Add disallow and allow paths for each user agent.",
    "Optionally set a crawl delay and sitemap URL.",
    "Click 'Generate' to preview the `robots.txt` content.",
    "Download the file and upload it to your website's root directory.",
  ],
  faq: [
    {
      question: "Does robots.txt prevent pages from appearing in search results?",
      answer:
        "Blocking a page in robots.txt prevents crawling but does not always prevent indexing. If other sites link to the page, Google may still index it. Use `noindex` meta tags to prevent indexing.",
    },
    {
      question: "Is robots.txt case-sensitive?",
      answer:
        "The user agent names are case-insensitive, but the paths are case-sensitive on case-sensitive servers (e.g., Linux).",
    },
    {
      question: "Can I block a specific directory?",
      answer:
        "Yes. `Disallow: /private/` blocks all URLs under `/private/`. The trailing slash is important.",
    },
  ],
  useCases: [
    "Blocking search engines from indexing an admin panel",
    "Preventing crawlers from accessing test or staging directories",
    "Adding a sitemap reference to robots.txt",
    "Setting a crawl delay for a resource-constrained server",
  ],
  examples: [
    {
      label: "Block all bots from /admin/",
      input: "User-agent: *, Disallow: /admin/",
      output: "User-agent: *\nDisallow: /admin/",
    },
  ],
  commonErrors: [
    {
      error: "Robots.txt is blocking the entire site",
      fix: "`Disallow: /` blocks all content for the matched user agent. Verify you didn't accidentally use `/` as the disallow path.",
    },
    {
      error: "File is not being respected by a crawler",
      fix: "Ensure the file is at `https://yourdomain.com/robots.txt` (the exact root). Subdomains need their own robots.txt file.",
    },
  ],
  alternatives: ["robots-txt.com", "Google Search Console robots.txt tester", "SEMrush Site Audit"],
};

const seoTitle: ToolContent = {
  detailedDescription:
    "Preview how your page title and meta description will appear in Google Search results with a pixel-accurate SERP snippet simulator. Get real-time character and pixel-width counters to stay within Google's display limits. Runs entirely in the browser.",
  howTo: [
    "Type your page title in the title field.",
    "Type your meta description in the description field.",
    "The SERP preview updates in real time below.",
    "Adjust the text until the preview shows no truncation.",
    "Copy the title and description for use in your CMS.",
  ],
  faq: [
    {
      question: "What is the maximum title length?",
      answer:
        "Google displays titles up to approximately 600 pixels wide (~55–60 characters in a standard font). The tool shows a pixel-width indicator.",
    },
    {
      question: "What is the ideal description length?",
      answer:
        "Descriptions should be 120–155 characters. Google may display up to 920 pixels of description (~155–160 characters) on desktop.",
    },
    {
      question: "Does Google always use my title tag?",
      answer:
        "No. Google may rewrite your title based on the page content if it considers the tag misleading or too generic. Write accurate, descriptive titles.",
    },
    {
      question: "Do special characters in titles cause issues?",
      answer:
        "Most characters are fine. Pipes (`|`), dashes (`–`), and colons (`:`) are commonly used as separators. Avoid ALL CAPS as Google may rewrite the title.",
    },
  ],
  useCases: [
    "Optimising a page title to fit within Google's display limit",
    "Writing a compelling meta description to improve click-through rate",
    "Reviewing titles across a site before a content audit",
    "Training a content team on SERP best practices",
  ],
  examples: [
    {
      label: "Well-formed SERP title",
      input: "Free JSON Formatter & Validator | KaruviLab",
      output: "[SERP preview: full title visible, no truncation]",
    },
  ],
  commonErrors: [
    {
      error: "Title appears truncated in the preview",
      fix: "Shorten the title or move the most important keyword earlier. Truncation happens at the pixel limit, not a fixed character count.",
    },
    {
      error: "Description is being rewritten by Google",
      fix: "Ensure the description accurately summarises the page content. Google rewrites descriptions it deems irrelevant to the search query.",
    },
  ],
  alternatives: ["Portent SERP Preview Tool", "Moz Title Tag Preview", "Yoast SEO plugin"],
};

const urlCleaner: ToolContent = {
  detailedDescription:
    "Strip UTM parameters, ad tracking tokens, and other query string clutter from URLs to produce a clean, shareable link. Supports common tracking parameters from Google Analytics, Facebook Ads, MailChimp, and more. Runs entirely in the browser — no URLs are sent to a server.",
  howTo: [
    "Paste the full URL (including query parameters) into the input field.",
    "The cleaned URL with all tracking parameters removed appears instantly.",
    "Review the list of removed parameters shown below.",
    "Copy the clean URL.",
  ],
  faq: [
    {
      question: "Which parameters are removed?",
      answer:
        "By default: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`, `mc_eid`, `ref`, `source`, and dozens more. You can customise the list.",
    },
    {
      question: "Will removing UTM parameters break the destination page?",
      answer:
        "No. UTM parameters are only used for analytics tracking. The destination page content is the same with or without them.",
    },
    {
      question: "Can I keep certain parameters?",
      answer:
        "Yes. Use the exclusion list to specify parameters that should not be removed (e.g., a `?id=` that the page actually needs).",
    },
  ],
  useCases: [
    "Cleaning a URL before sharing it in a chat or email",
    "Removing tracking tokens from URLs before bookmarking",
    "Generating canonical URLs for content without analytics noise",
    "Simplifying affiliate links before sharing publicly",
  ],
  examples: [
    {
      label: "Strip UTM params",
      input: "https://example.com/blog?utm_source=newsletter&utm_medium=email&utm_campaign=may2025",
      output: "https://example.com/blog",
    },
  ],
  commonErrors: [
    {
      error: "Cleaned URL breaks the page",
      fix: "A parameter that looks like a tracker (e.g., `id`, `ref`) may actually be required by the page. Add it to the exclusion list.",
    },
    {
      error: "URL still contains tracking parameters after cleaning",
      fix: "Some platform-specific parameters may not be in the default list. Add them manually in the custom parameters field.",
    },
  ],
  alternatives: ["ClearURLs browser extension", "URLCleaner.com", "uBlock Origin (partial)"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry export
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_CONTENT: Record<string, ToolContent> = {
  // Security / Encoding
  "hash-generator": hashGenerator,
  "password-generator": passwordGenerator,
  "base64": base64,
  "url-encoder": urlEncoder,
  "html-entities": htmlEntities,
  "jwt-decoder": jwtDecoder,

  // Developer
  "json-formatter": jsonFormatter,
  "json-csv": jsonCsv,
  "regex-tester": regexTester,
  "code-minifier": codeMinifier,
  "diff-checker": diffChecker,
  "format": format,

  // Utilities
  "qrcode": qrcode,
  "text-utility": textUtility,
  "split-copy": splitCopy,
  "markdown": markdown,
  "grammar-checker": grammarChecker,
  "task-reminder": taskReminder,

  // Image Tools
  "image-compress": imageCompress,
  "image-converter": imageConverter,
  "image-resizer": imageResizer,
  "image-crop": imageCrop,
  "image-base64": imageBase64,
  "bg-remover": bgRemover,

  // PDF Tools
  "compress-pdf": compressPdf,
  "merge-pdf": mergePdf,
  "split-pdf": splitPdf,
  "image-to-pdf": imageToPdf,

  // Calculators
  "emi-calculator": emiCalculator,
  "sip-calculator": sipCalculator,
  "age-calculator": ageCalculator,
  "compound-interest": compoundInterest,
  "gst-calculator": gstCalculator,
  "percentage-calculator": percentageCalculator,
  "salary-calculator": salaryCalculator,
  "currency-converter": currencyConverter,
  "unit-converter": unitConverter,
  "date-calculator": dateCalculator,
  "discount-calculator": discountCalculator,

  // SEO Tools
  "slug-generator": slugGenerator,
  "meta-tags": metaTags,
  "og-preview": ogPreview,
  "sitemap-generator": sitemapGenerator,
  "robots-txt": robotsTxt,
  "seo-title": seoTitle,
  "url-cleaner": urlCleaner,
};
