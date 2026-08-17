export const numeralConverter = {
    detailedDescription: "A comprehensive Numeral and Text Converter for Binary, Hexadecimal, Decimal, Octal, ASCII, Base64, URL encoding, HTML entities, and developer escape sequences. This professional-grade utility supports multiple powerful modes: Smart Mode for instant auto-detection and multi-format output, Single Number mode for custom base conversion (base 2 to 36) with an interactive IEEE 754 float visualizer and 8-bit visualizer, Encode/Decode mode for direct translation, Text/Bytes mode for multi-byte array breakdown, and a local-first JWT Decoder. All computations run 100% locally in your browser for absolute privacy and security.",
    howTo: [
        "Choose your mode from the tabs: 'Smart Converter' for auto-detection, 'Single Number' for bases/bits/floats, 'Encode/Decode' for format translation, 'Text/Bytes' for multi-byte details, or 'JWT' to decode tokens.",
        "In Smart Converter mode, paste any value (hex, binary, base64, URL encoded, HTML entities, Morse, etc.). The tool auto-detects the format and converts it to all other encodings instantly.",
        "Use the override dropdown in Smart mode if the auto-detected format needs correction.",
        "In Single Number mode, convert numbers across bases 2 to 36, view their two's complement, and interact with the IEEE 754 float visualizer by toggling bits.",
        "In JWT mode, paste a JSON Web Token to decode and format the header and payload segments instantly without sending any data to a server."
    ],
    faq: [
        {
            question: "How do I convert hex to text?",
            answer: "Paste your hex value (e.g., '48 65 6C 6C 6F') directly into the input field. The tool automatically detects it as hexadecimal and shows the plain text result ('Hello') alongside binary, Base64, URL-encoded, and all other formats instantly."
        },
        {
            question: "How do I decode Base64?",
            answer: "Paste your Base64 string into the input. The tool detects it automatically and shows the decoded text plus all other encoding formats. It supports standard Base64, URL-safe Base64, and MIME Base64."
        },
        {
            question: "What is the difference between URL encoding and Base64?",
            answer: "URL encoding (percent encoding) replaces unsafe URL characters with %XX hex codes. Base64 encodes binary data as printable ASCII text. URL encoding is for web addresses; Base64 is for transmitting binary data in text-based systems like email and APIs."
        },
        {
            question: "Can I convert emoji or Chinese characters?",
            answer: "Yes. All text is processed as UTF-8, which supports all Unicode characters including emoji, CJK ideographs, Arabic, and any other script. The tool shows the exact byte representation for each character."
        },
        {
            question: "Is my data safe when using this tool?",
            answer: "Completely. All conversion happens inside your browser using local JavaScript. Your text, files, and encoded values never leave your device and are never sent to any server."
        },
        {
            question: "How do I decode a JWT token?",
            answer: "Select the JWT tab and paste your JWT token. The tool decodes the header and payload sections and displays them as formatted JSON. Note: signature verification requires the secret key and cannot be done client-side."
        },
        {
            question: "What encoding formats are supported?",
            answer: "Binary, Octal, Decimal bytes, Hexadecimal, UTF-8, UTF-16, UTF-32, ASCII, Latin-1, Windows-1252, Base64, Base64 URL-safe, Base32, URL encoding, HTML entities, Unicode escapes (JS/Python/CSS/Java/C/Rust/Go), Morse code, ROT13, Caesar cipher, Atbash, and JWT decode."
        }
    ],
    useCases: [
        "Encoding and decoding developer strings (HTML entities, URL params, Base64, Unicode escapes)",
        "Converting memory addresses and pointer values across binary/hex formats",
        "Decoding JSON Web Tokens (JWT) locally to inspect header and payload data safely",
        "Analyzing text files or inputs down to the raw byte level (UTF-8/UTF-16/UTF-32/CP1252)",
        "Learning number representations, including custom bases (2-36) and IEEE 754 floating points"
    ],
    alternatives: ["BinaryHexConverter", "CyberChef", "RapidTables", "JWT.io", "Base64Decode.org"]
};
