export const codeMinifier = {
    detailedDescription: "Minify CSS, JavaScript, and HTML to reduce file sizes for faster web page loading. The tool strips comments, whitespace, and unnecessary characters while preserving functionality. All minification happens client-side — your source code is never sent to a server.",
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
            answer: "For standard, well-formed code, no. However, code that relies on `arguments.caller`, `Function.name`, or specific whitespace formatting may behave differently after minification.",
        },
        {
            question: "What is the difference between minification and uglification?",
            answer: "Minification removes whitespace and comments. Uglification also renames variables to shorter names, providing a greater size reduction (and minor obfuscation).",
        },
        {
            question: "Should I minify my development files?",
            answer: "No. Minify only for production. Keep original source files for development. Use source maps if you need to debug minified code.",
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
