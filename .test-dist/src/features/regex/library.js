export const REGEX_CATEGORIES = [
    { id: "email", label: "Email" },
    { id: "url", label: "URL & Links" },
    { id: "phone", label: "Phone Numbers" },
    { id: "date", label: "Date & Time" },
    { id: "ip", label: "IP & Network" },
    { id: "password", label: "Passwords" },
    { id: "indian", label: "Indian Formats" },
    { id: "dev", label: "Developer & Text" }
];
export const REGEX_LIBRARY = [
    // ── EMAIL CATEGORY (10 items) ──────────────────────────────────────────────
    {
        id: "email-simple",
        label: "Simple Email Validation",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "g",
        description: "Standard email matching. Suitable for 99% of web forms. Requires a username, @ symbol, domain name, and TLD of at least 2 characters.",
        example: "john.doe@example.com"
    },
    {
        id: "email-rfc5322",
        label: "RFC 5322 Compliant Email",
        category: "email",
        pattern: "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
        flags: "gi",
        description: "Extremely strict email standard matching, covering special characters permitted in RFC 5322. Recommended for server-side validation.",
        example: "dev_team+alerts@hq.company.io"
    },
    {
        id: "email-gmail-plus",
        label: "Gmail Plus addressing",
        category: "email",
        pattern: "[a-zA-Z0-9._%\\-]+(\\+[a-zA-Z0-9.\\-]+)?@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "g",
        description: "Matches email addresses that use Gmail-style '+' sign addressing (useful for routing/sorting filters).",
        example: "user+newsletter@gmail.com"
    },
    {
        id: "email-subdomain",
        label: "Subdomain Email",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "g",
        description: "Specifically matches emails sent from subdomains (e.g. user@sales.company.com).",
        example: "support@mail.business.net"
    },
    {
        id: "email-numeric",
        label: "Numeric Username Email",
        category: "email",
        pattern: "\\d+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "g",
        description: "Matches emails where the username consists entirely of numbers, common in student portals and corporate IDs.",
        example: "1284792@university.edu"
    },
    {
        id: "email-corporate",
        label: "Corporate/Tighter Domains",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.(?:com|org|net|edu|gov|co|io)",
        flags: "gi",
        description: "Filters email addresses to check for standard top-level domains (.com, .org, .net, .edu, .gov, .co, .io) and excludes obscure ones.",
        example: "ceo@startup.io"
    },
    {
        id: "email-no-tld",
        label: "Local Intranet Email",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9\\-]+",
        flags: "g",
        description: "Matches local intranet email addresses that lack a top-level domain extension.",
        example: "admin@localhost"
    },
    {
        id: "email-quotes",
        label: "Quoted Email Username",
        category: "email",
        pattern: "\"[^\"]+\"@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "g",
        description: "Matches RFC-compliant emails that wrap special characters or spaces in double quotes in the username part.",
        example: "\"john smith\"@firm.com"
    },
    {
        id: "email-domain-specific",
        label: "Specific Domain Email",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@gmail\\.com",
        flags: "gi",
        description: "Matches emails only belonging to a specific domain (in this case, gmail.com). Useful for single-domain login validations.",
        example: "test.user@gmail.com"
    },
    {
        id: "email-disposable",
        label: "Block Mailinator/Disposable",
        category: "email",
        pattern: "[a-zA-Z0-9._%+\\-]+@(?!mailinator\\.com|yopmail\\.com|dispostable\\.com)[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        flags: "gi",
        description: "Validates email format but rejects registration from known disposable email services like Mailinator or Yopmail.",
        example: "realuser@company.com"
    },
    // ── URL CATEGORY (12 items) ────────────────────────────────────────────────
    {
        id: "url-standard",
        label: "Standard URL Validation",
        category: "url",
        pattern: "https?://[^\\s/$.?#].[^\\s]*",
        flags: "gi",
        description: "Standard web URL matching. Supports http, https, domains, paths, query variables, and fragment identifiers.",
        example: "https://www.example.com/shop/item?id=102#reviews"
    },
    {
        id: "url-secure",
        label: "Secure HTTPS Only",
        category: "url",
        pattern: "https://[^\\s/$.?#].[^\\s]*",
        flags: "gi",
        description: "Strict HTTPS URL validation. Rejects insecure HTTP protocol links.",
        example: "https://secure-login.bank.com"
    },
    {
        id: "url-domain-only",
        label: "Domain Name Only",
        category: "url",
        pattern: "^(?:https?://)?(?:www\\.)?([a-zA-Z0-9\\-]+(?:\\.[a-zA-Z0-9\\-]+)+)",
        flags: "gi",
        description: "Extracts or matches raw hostname/domain name from a URL, stripping path prefixes.",
        example: "https://api.github.com"
    },
    {
        id: "url-ip",
        label: "IP-Based URL",
        category: "url",
        pattern: "https?://(?:\\d{1,3}\\.){3}\\d{1,3}(?::\\d+)?(?:/[^\\s]*)?",
        flags: "g",
        description: "Matches web URLs that navigate directly via an IP address (with or without a custom port) instead of a domain.",
        example: "http://192.168.1.1:8080/admin"
    },
    {
        id: "url-query-params",
        label: "URL with Query Parameters",
        category: "url",
        pattern: "https?://[^\\s?#]+\\?[^\\s#]+",
        flags: "gi",
        description: "Matches only URLs that contain query parameter strings (e.g. containing ?key=value).",
        example: "https://google.com/search?q=regex+tester"
    },
    {
        id: "url-path-only",
        label: "Absolute Relative Paths",
        category: "url",
        pattern: "^/[a-zA-Z0-9\\-_/]*$",
        flags: "g",
        description: "Matches relative internal website paths starting with a single forward slash.",
        example: "/assets/images/logo.png"
    },
    {
        id: "url-youtube",
        label: "YouTube Video Links",
        category: "url",
        pattern: "(?:https?:)?//(?:www\\.)?(?:youtube\\.com|youtu\\.be)/(?:watch\\?v=)?([^\\s&]+)",
        flags: "gi",
        description: "Captures YouTube video ID from standard watch pages or shortened links.",
        example: "https://youtu.be/dQw4w9WgXcQ"
    },
    {
        id: "url-github",
        label: "GitHub Repository URL",
        category: "url",
        pattern: "https?://(?:www\\.)?github\\.com/([a-zA-Z0-9\\-_]+)/([a-zA-Z0-9\\-_\\.]+)",
        flags: "gi",
        description: "Matches and parses GitHub repository paths, capturing the owner username and repo name.",
        example: "https://github.com/gowhamr/karuvilab"
    },
    {
        id: "url-subdomain",
        label: "Strict Subdomain URL",
        category: "url",
        pattern: "https?://[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,}",
        flags: "gi",
        description: "Matches web links that must contain at least one subdomain (e.g. app.domain.com).",
        example: "https://dashboard.stripe.com"
    },
    {
        id: "url-ftp",
        label: "FTP Protocol Links",
        category: "url",
        pattern: "ftps?://[^\\s/$.?#].[^\\s]*",
        flags: "gi",
        description: "Matches FTP or SFTP file transfer protocol links.",
        example: "sftp://files.backup-server.org/data/"
    },
    {
        id: "url-image",
        label: "Image URL Extension",
        category: "url",
        pattern: "https?://[^\\s]+\\.(?:png|jpg|jpeg|gif|webp|svg)(?:\\?[^\\s]*)?",
        flags: "gi",
        description: "Matches URLs that resolve directly to image files (png, jpg, gif, webp, svg), supporting query parameters.",
        example: "https://images.unsplash.com/photo.jpg?auto=format"
    },
    {
        id: "url-port",
        label: "URL with Custom Port",
        category: "url",
        pattern: "https?://[^\\s/:]+:\\d+(?:/[^\\s]*)?",
        flags: "gi",
        description: "Matches web URLs that explicitly specify a custom port number.",
        example: "http://localhost:3000/settings"
    },
    // ── PHONE NUMBERS (15 items) ───────────────────────────────────────────────
    {
        id: "phone-us",
        label: "US Phone Number",
        category: "phone",
        pattern: "\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}",
        flags: "g",
        description: "Matches US formats. Handles parentheses, spaces, dots, and hyphens.",
        example: "(555) 123-4567"
    },
    {
        id: "phone-us-ext",
        label: "US Phone with Extension",
        category: "phone",
        pattern: "\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}(?:\\s*(?:ext|x|ext\\.)\\s*\\d{1,5})?",
        flags: "gi",
        description: "Matches US phone formats and optionally captures extensions (e.g. ext. 402 or x123).",
        example: "555-123-4567 ext. 402"
    },
    {
        id: "phone-in-mobile",
        label: "Indian Mobile Number",
        category: "phone",
        pattern: "(?:\\+91|91|0)?[6-9]\\d{9}",
        flags: "g",
        description: "Matches standard Indian mobile phone numbers. Supports prefixes (+91, 91, or 0) and requires mobile digits starting with 6, 7, 8, or 9.",
        example: "+91 9876543210"
    },
    {
        id: "phone-intl",
        label: "International Standard (E.164)",
        category: "phone",
        pattern: "\\+\\d{1,3}\\s?\\d{4,14}",
        flags: "g",
        description: "Matches global E.164 compliance formats. Must start with a '+' followed by a country code and phone number (4 to 14 digits).",
        example: "+44 2079460958"
    },
    {
        id: "phone-uk",
        label: "UK Phone Number",
        category: "phone",
        pattern: "(?:\\+44|0)?[1-9]\\d{8,9}",
        flags: "g",
        description: "Matches UK numbers, including mobile and landline formats, stripping +44 or leading 0.",
        example: "07911123456"
    },
    {
        id: "phone-in-landline",
        label: "Indian Landline Number",
        category: "phone",
        pattern: "0\\d{2,4}-\\d{6,8}",
        flags: "g",
        description: "Matches standard Indian landline numbers. Validates area STD code followed by a hyphen and subscriber number.",
        example: "044-22541234"
    },
    {
        id: "phone-de",
        label: "German Phone Number",
        category: "phone",
        pattern: "(?:\\+49|0)[1-9]\\d{1,4}[\\s\\-]?\\d{3,10}",
        flags: "g",
        description: "Matches German mobile and landline formats with optional space/hyphen separation.",
        example: "+49 170 1234567"
    },
    {
        id: "phone-fr",
        label: "French Phone Number",
        category: "phone",
        pattern: "(?:\\+33|0)[1-9](?:[\\s.-]?\\d{2}){4}",
        flags: "g",
        description: "Matches French numbers (mobile & landline) separated by spaces, dots, or hyphens.",
        example: "06 12 34 56 78"
    },
    {
        id: "phone-au",
        label: "Australian Mobile",
        category: "phone",
        pattern: "(?:\\+61|0)4\\d{2}\\s?\\d{3}\\s?\\d{3}",
        flags: "g",
        description: "Matches standard Australian mobile phone numbers (starting with 04 or +61 4).",
        example: "0412 345 678"
    },
    {
        id: "phone-e164-tight",
        label: "E.164 Strict No-Spaces",
        category: "phone",
        pattern: "^\\+[1-9]\\d{1,14}$",
        flags: "g",
        description: "Matches E.164 E.164-formatted phone numbers strictly with NO spaces, dashes, or parentheses.",
        example: "+15551234567"
    },
    {
        id: "phone-nanp",
        label: "Strict NANP Format",
        category: "phone",
        pattern: "^\\+1-[2-9]\\d{2}-[2-9]\\d{2}-\\d{4}$",
        flags: "g",
        description: "Strict North American Numbering Plan formatting. Restricts area codes and exchange codes to start with digits 2-9.",
        example: "+1-212-555-0199"
    },
    {
        id: "phone-numeric-only",
        label: "Clean Digit Extraction",
        category: "phone",
        pattern: "\\d{10,15}",
        flags: "g",
        description: "Helper pattern to match or extract strings of 10 to 15 raw numeric digits from scrambled text fields.",
        example: "5551234567"
    },
    {
        id: "phone-emergency",
        label: "Emergency Numbers",
        category: "phone",
        pattern: "\\b(911|999|112|100)\\b",
        flags: "g",
        description: "Matches standard international emergency shortcuts (911, 999, 112, 100).",
        example: "Call 911 immediately"
    },
    {
        id: "phone-toll-free",
        label: "Toll-Free Numbers (US)",
        category: "phone",
        pattern: "1?[-.\\s]?(800|888|877|866|855|844|833)[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
        flags: "g",
        description: "Matches standard US toll-free service codes (800, 888, 877, etc.).",
        example: "1-800-555-0199"
    },
    {
        id: "phone-singapore",
        label: "Singapore Phone Number",
        category: "phone",
        pattern: "(?:\\+65|0)?[3689]\\d{7}",
        flags: "g",
        description: "Matches Singapore mobile (8, 9) and landline (3, 6) formats.",
        example: "+65 91234567"
    },
    // ── DATE & TIME (15 items) ─────────────────────────────────────────────────
    {
        id: "date-yyyy-mm-dd",
        label: "Date (YYYY-MM-DD)",
        category: "date",
        pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
        flags: "g",
        description: "Matches standard ISO date format. Validates 4-digit year, 2-digit month (01-12), and 2-digit day (01-31).",
        example: "2026-06-11"
    },
    {
        id: "date-dd-mm-yyyy",
        label: "Date (DD/MM/YYYY)",
        category: "date",
        pattern: "(?:0[1-9]|[12]\\d|3[01])/(?:0[1-9]|1[0-2])/\\d{4}",
        flags: "g",
        description: "Matches standard UK/EU date format separated by forward slashes.",
        example: "11/06/2026"
    },
    {
        id: "date-mm-dd-yyyy",
        label: "Date (MM-DD-YYYY)",
        category: "date",
        pattern: "(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])-\\d{4}",
        flags: "g",
        description: "Matches standard US date format separated by hyphens.",
        example: "06-11-2026"
    },
    {
        id: "date-iso8601",
        label: "ISO 8601 Timestamp",
        category: "date",
        pattern: "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:?\\d{2})",
        flags: "g",
        description: "Full ISO 8601 datetime timestamp matching, supporting millisecond fractions and UTC or timezone offsets.",
        example: "2026-06-11T13:05:06.128Z"
    },
    {
        id: "time-24h",
        label: "Time (24 Hour Format)",
        category: "date",
        pattern: "\\b(?:[01]?\\d|2[0-3]):[0-5]\\d\\b",
        flags: "g",
        description: "Matches 24-hour clock formats (HH:MM) from 00:00 to 23:59.",
        example: "14:30"
    },
    {
        id: "time-24h-secs",
        label: "Time (24h with Seconds)",
        category: "date",
        pattern: "\\b(?:[01]?\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\b",
        flags: "g",
        description: "Matches 24-hour clock formats including seconds (HH:MM:SS).",
        example: "23:59:59"
    },
    {
        id: "time-12h",
        label: "Time (12 Hour Format)",
        category: "date",
        pattern: "\\b(?:0?[1-9]|1[0-2]):[0-5]\\d\\s?(?:AM|PM|am|pm)\\b",
        flags: "g",
        description: "Matches 12-hour clock format (HH:MM AM/PM) with optional space.",
        example: "11:05 PM"
    },
    {
        id: "date-leap-year",
        label: "Leap Year validation",
        category: "date",
        pattern: "^(?:(?:19|20)(?:[02468][048]|[13579][26])|2000)-02-29$",
        flags: "g",
        description: "Validates if a date string is exactly February 29th on a valid leap year between 1900 and 2099.",
        example: "2024-02-29"
    },
    {
        id: "date-month-word",
        label: "Date with Month Name",
        category: "date",
        pattern: "\\d{1,2}\\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s\\d{4}",
        flags: "gi",
        description: "Matches dates written with month names or standard abbreviation (e.g. 11 June 2026).",
        example: "11 Jun 2026"
    },
    {
        id: "date-year",
        label: "Year (1900-2099)",
        category: "date",
        pattern: "\\b(?:19\\d\\d|20\\d\\d)\\b",
        flags: "g",
        description: "Matches standard 4-digit years ranging between 1900 and 2099.",
        example: "2026"
    },
    {
        id: "date-unix-timestamp",
        label: "Unix Epoch Timestamp",
        category: "date",
        pattern: "\\b\\d{10}\\b",
        flags: "g",
        description: "Matches standard 10-digit Unix epoch timestamps (in seconds).",
        example: "1781183987"
    },
    {
        id: "time-timezone-offset",
        label: "Timezone Offset",
        category: "date",
        pattern: "[+-](?:0\\d|1[0-4]):?[0-5]\\d",
        flags: "g",
        description: "Matches standard UTC timezone offset formats (e.g. +05:30 or -08:00).",
        example: "+05:30"
    },
    {
        id: "date-html-datetime",
        label: "HTML Datetime Input",
        category: "date",
        pattern: "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}",
        flags: "g",
        description: "Matches native HTML datetime-local input value patterns.",
        example: "2026-06-11T13:05"
    },
    {
        id: "date-american-words",
        label: "American Date in Words",
        category: "date",
        pattern: "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s\\d{1,2},\\s\\d{4}",
        flags: "gi",
        description: "Matches standard US written date formats (e.g. June 11, 2026).",
        example: "June 11, 2026"
    },
    {
        id: "date-month-day-tight",
        label: "Strict MM/DD Check",
        category: "date",
        pattern: "^(0[1-9]|1[0-2])/(0[1-9]|[12]\\d|3[01])$",
        flags: "g",
        description: "Matches a simple month/day configuration (MM/DD) between 01/01 and 12/31.",
        example: "12/25"
    },
    // ── IP & NETWORKING (12 items) ──────────────────────────────────────────────
    {
        id: "ip-v4",
        label: "IPv4 Address",
        category: "ip",
        pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b",
        flags: "g",
        description: "Matches standard IPv4 addresses. Checks octet ranges from 0 to 255.",
        example: "192.168.1.1"
    },
    {
        id: "ip-v6",
        label: "IPv6 Address",
        category: "ip",
        pattern: "\\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b|\\b(?:[0-9a-fA-F]{1,4}:){1,7}:\\b|\\b::(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}\\b",
        flags: "g",
        description: "Matches full, standard, or compressed IPv6 network address structures.",
        example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
    },
    {
        id: "ip-mac",
        label: "MAC Address",
        category: "ip",
        pattern: "\\b(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}\\b",
        flags: "gi",
        description: "Matches physical hardware MAC addresses separated by colons or hyphens.",
        example: "00:1A:2B:3C:4D:5E"
    },
    {
        id: "ip-cidr",
        label: "IPv4 CIDR Subnet",
        category: "ip",
        pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)/(?:[0-9]|[12]\\d|3[0-2])\\b",
        flags: "g",
        description: "Matches IPv4 addresses coupled with a slash and subnet CIDR mask (0-32).",
        example: "10.0.0.0/24"
    },
    {
        id: "ip-port",
        label: "Port Number",
        category: "ip",
        pattern: "\\b(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])\\b",
        flags: "g",
        description: "Matches network port number ranges from 0 to 65535.",
        example: "5432"
    },
    {
        id: "ip-hostname",
        label: "Hostname Standard",
        category: "ip",
        pattern: "^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,63}$",
        flags: "g",
        description: "Validates fully qualified RFC-compliant hostnames/domain labels.",
        example: "sub-domain.services.co.uk"
    },
    {
        id: "ip-localhost",
        label: "Localhost loopback",
        category: "ip",
        pattern: "\\b127\\.(?:\\d{1,3}\\.){2}\\d{1,3}\\b",
        flags: "g",
        description: "Matches loopback IP addresses belonging to the 127.0.0.0/8 network.",
        example: "127.0.0.1"
    },
    {
        id: "ip-mac-cisco",
        label: "MAC Address (Cisco format)",
        category: "ip",
        pattern: "[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}",
        flags: "gi",
        description: "Matches Cisco-style dot-separated hardware addresses (e.g. hhhh.hhhh.hhhh).",
        example: "0123.4567.89ab"
    },
    {
        id: "ip-subnet-mask",
        label: "Subnet Mask Validation",
        category: "ip",
        pattern: "^(?:128|192|224|240|248|252|254|255)\\.0\\.0\\.0$|^(?:255\\.)(?:0|128|192|224|240|248|252|254|255)\\.0\\.0$|^(?:255\\.){2}(?:0|128|192|224|240|248|252|254|255)\\.0$|^(?:255\\.){3}(?:0|128|192|224|240|248|252|254|255)$",
        flags: "g",
        description: "Validates if a string is a mathematically valid IPv4 Subnet Mask.",
        example: "255.255.255.0"
    },
    {
        id: "ip-private",
        label: "Private IPv4 Ranges",
        category: "ip",
        pattern: "(?:10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})|(?:172\\.(?:1[6-9]|2\\d|3[01])\\.\\d{1,3}\\.\\d{1,3})|(?:192\\.168\\.\\d{1,3}\\.\\d{1,3})",
        flags: "g",
        description: "Detects local LAN private IPv4 address blocks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).",
        example: "192.168.0.105"
    },
    {
        id: "ip-url-extract",
        label: "Extract IPs from URL",
        category: "ip",
        pattern: "(?:[0-9]{1,3}\\.){3}[0-9]{1,3}",
        flags: "g",
        description: "Helper pattern to find and extract raw IPv4 host octets from bulk log text.",
        example: "Connection from 10.0.0.15 on port 80"
    },
    {
        id: "ip-v6-compressed",
        label: "IPv6 compressed check",
        category: "ip",
        pattern: "::[fF]{4}:(?:[0-9]{1,3}\\.){3}[0-9]{1,3}",
        flags: "gi",
        description: "Matches IPv4-mapped IPv6 compressed transit address formats.",
        example: "::ffff:192.0.2.128"
    },
    // ── PASSWORDS (10 items) ───────────────────────────────────────────────────
    {
        id: "pass-basic",
        label: "Basic (Letter + Number)",
        category: "password",
        pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
        flags: "g",
        description: "Validates a minimum of 8 characters, requiring at least one letter and one number.",
        example: "pass1234"
    },
    {
        id: "pass-medium",
        label: "Medium Strength Rules",
        category: "password",
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$",
        flags: "g",
        description: "Minimum 8 characters. Requires at least one uppercase letter, one lowercase letter, and one number.",
        example: "SecurePass1"
    },
    {
        id: "pass-strong",
        label: "Strong Password Rules",
        category: "password",
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        flags: "g",
        description: "Minimum 8 characters. Requires at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
        example: "P@ssw0rd123!"
    },
    {
        id: "pass-length-only",
        label: "Length bounds (8 to 32)",
        category: "password",
        pattern: "^.{8,32}$",
        flags: "g",
        description: "Simple length boundaries enforcement. Rejects entries shorter than 8 or longer than 32 characters.",
        example: "mysecretkey"
    },
    {
        id: "pass-no-spaces",
        label: "Exclude Spaces",
        category: "password",
        pattern: "^[^\\s]*$",
        flags: "g",
        description: "Validates that the input contains zero space, tab, or whitespace characters.",
        example: "NoSpacesHere"
    },
    {
        id: "pass-special-char",
        label: "Has Special Character",
        category: "password",
        pattern: "[!@#$%^&*(),.?\":{}|<>]",
        flags: "g",
        description: "Validates that the input contains at least one special punctuation symbol.",
        example: "hello!"
    },
    {
        id: "pass-alpha-only",
        label: "Alphabetic Characters Only",
        category: "password",
        pattern: "^[a-zA-Z]+$",
        flags: "g",
        description: "Matches inputs that consist entirely of upper and lower case letters (rejects numbers/special characters).",
        example: "OnlyLetters"
    },
    {
        id: "pass-numeric-only",
        label: "Numeric PIN Code",
        category: "password",
        pattern: "^\\d{4,6}$",
        flags: "g",
        description: "Enforces a numeric PIN code pattern consisting of exactly 4 to 6 digits.",
        example: "9283"
    },
    {
        id: "pass-very-strong",
        label: "Very Strong (12+ chars)",
        category: "password",
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$",
        flags: "g",
        description: "Enforces high-security rules: minimum 12 characters, requiring lowercase, uppercase, digits, and special characters.",
        example: "SuperSecureP@ss12!"
    },
    {
        id: "pass-blacklist-words",
        label: "Ban 'admin' / 'password'",
        category: "password",
        pattern: "^(?!password$|admin$|123456$)[\\s\\S]+$",
        flags: "gi",
        description: "Validates string inputs but rejects common lazy entries like 'admin', 'password', or '123456'.",
        example: "my_custom_password"
    },
    // ── INDIAN FORMATS (16 items) ──────────────────────────────────────────────
    {
        id: "in-pan",
        label: "PAN Card Number",
        category: "indian",
        pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        flags: "g",
        description: "Validates Indian Permanent Account Number (PAN). Matches 5 uppercase alphabetic characters, followed by 4 digits, followed by 1 alphabet.",
        example: "ABCDE1234F"
    },
    {
        id: "in-aadhaar-formatted",
        label: "Aadhaar Card (Formatted)",
        category: "indian",
        pattern: "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$",
        flags: "g",
        description: "Matches a standard 12-digit Aadhaar UID number formatted with space separations. Aadhaar cannot start with 0 or 1.",
        example: "3829 4810 5928"
    },
    {
        id: "in-aadhaar-raw",
        label: "Aadhaar Card (Raw)",
        category: "indian",
        pattern: "^[2-9]{1}[0-9]{11}$",
        flags: "g",
        description: "Matches a raw 12-digit Aadhaar UID number with no spaces. Rejects numbers beginning with 0 or 1.",
        example: "382948105928"
    },
    {
        id: "in-ifsc",
        label: "IFSC Code (Bank Transfer)",
        category: "indian",
        pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
        flags: "gi",
        description: "Validates Indian Financial System Code. Must have 4 alphabets representing the bank name, then a constant 0 (fifth char), and 6 alphanumeric branch codes.",
        example: "HDFC0001234"
    },
    {
        id: "in-gstin",
        label: "GSTIN (GST ID)",
        category: "indian",
        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        flags: "gi",
        description: "Validates Indian Goods and Services Tax Identification Number. Verifies state code (first 2 digits), PAN (next 10 chars), entity code, Z constant, and checksum.",
        example: "22AAAAA1111A1Z1"
    },
    {
        id: "in-pincode",
        label: "Postal Pincode",
        category: "indian",
        pattern: "^[1-9][0-9]{5}$",
        flags: "g",
        description: "Validates Indian Postal Index Number. Requires exactly 6 digits, and the first digit must range from 1 to 9 (no leading zeros).",
        example: "600036"
    },
    {
        id: "in-vehicle",
        label: "Vehicle Registration",
        category: "indian",
        pattern: "^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$",
        flags: "gi",
        description: "Matches Indian vehicle registration number format (e.g. TN-05-AB-1234). Matches state code, district code, series alphabets, and 4-digit vehicle number.",
        example: "KA03MM8293"
    },
    {
        id: "in-voter",
        label: "Voter ID (EPIC)",
        category: "indian",
        pattern: "^[A-Z]{3}[0-9]{7}$",
        flags: "gi",
        description: "Validates Electoral Photo Identity Card (EPIC) format. Matches 3 alphabetic assembly code letters followed by a 7-digit card serial number.",
        example: "WBD1234567"
    },
    {
        id: "in-passport",
        label: "Passport Number",
        category: "indian",
        pattern: "^[A-Z]{1}[0-9]{7}$",
        flags: "gi",
        description: "Validates standard Indian Passport numbers, requiring 1 uppercase letter followed by exactly 7 digits.",
        example: "Z8765432"
    },
    {
        id: "in-dl",
        label: "Driving License",
        category: "indian",
        pattern: "^[A-Z]{2}[0-9]{2}[\\s\\-]?[0-9]{11}$",
        flags: "gi",
        description: "Validates standard Indian Driving License (DL) numbers. Matches state code, licensing authority code, and unique license digits.",
        example: "DL1420110068765"
    },
    {
        id: "in-ration",
        label: "Ration Card Number",
        category: "indian",
        pattern: "^[a-zA-Z0-9]{8,16}$",
        flags: "g",
        description: "Matches standard Indian Ration Card formats. Fits general alphanumeric lengths ranging from 8 to 16 characters.",
        example: "TND128479215"
    },
    {
        id: "in-tan",
        label: "TAN (Tax Account Number)",
        category: "indian",
        pattern: "^[A-Z]{4}[0-9]{5}[A-Z]{1}$",
        flags: "gi",
        description: "Matches Tax Deduction and Collection Account Number (TAN). Consists of 4 alphabetic characters, 5 numeric digits, and 1 final check letter.",
        example: "CHEP12345A"
    },
    {
        id: "in-din",
        label: "DIN (Director ID)",
        category: "indian",
        pattern: "^[0-9]{8}$",
        flags: "g",
        description: "Matches Director Identification Number issued by Ministry of Corporate Affairs, consisting of exactly 8 numeric digits.",
        example: "01827364"
    },
    {
        id: "in-udyam",
        label: "Udyam MSME Registration",
        category: "indian",
        pattern: "^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$",
        flags: "gi",
        description: "Matches official Udyam MSME registration code schema (e.g. UDYAM-UD-00-1234567).",
        example: "UDYAM-TN-08-0123456"
    },
    {
        id: "in-bank-ac",
        label: "Bank Account Number",
        category: "indian",
        pattern: "^[0-9]{9,18}$",
        flags: "g",
        description: "Matches standard Indian bank account numbers. Restricts numeric lengths from 9 to 18 digits.",
        example: "123456789012"
    },
    {
        id: "in-mobile-alt",
        label: "Mobile (+91 Space/Dash)",
        category: "indian",
        pattern: "^(?:\\+91|91)?[\\-\\s]?[6-9]\\d{9}$",
        flags: "g",
        description: "Flexible validation for Indian mobile numbers including optional dashes or space separations after country codes.",
        example: "+91-9876543210"
    },
    // ── DEVELOPER & TEXT (20 items) ────────────────────────────────────────────
    {
        id: "dev-uuid",
        label: "UUID v4",
        category: "dev",
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        flags: "gi",
        description: "Matches standard RFC 4122 version-4 Universally Unique Identifier strings.",
        example: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    },
    {
        id: "dev-hex-color",
        label: "Hex Color (3 or 6 chars)",
        category: "dev",
        pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
        flags: "g",
        description: "Matches CSS hex color codes starting with a '#' (3 or 6 hex digits).",
        example: "#38bdf8"
    },
    {
        id: "dev-hex-alpha",
        label: "Hex Color with Alpha (4 or 8)",
        category: "dev",
        pattern: "#(?:[0-9a-fA-F]{4}){1,2}\\b",
        flags: "g",
        description: "Matches hex color codes including transparency opacity values (4 or 8 hex digits).",
        example: "#38bdf8aa"
    },
    {
        id: "dev-html-tag",
        label: "HTML Tag",
        category: "dev",
        pattern: "<[^>]+>",
        flags: "g",
        description: "Matches standard HTML markup tags, including closing tags and parameters.",
        example: "<div class=\"active\">"
    },
    {
        id: "dev-html-comment",
        label: "HTML Comments",
        category: "dev",
        pattern: "<!--[\\s\\S]*?-->",
        flags: "g",
        description: "Matches XML or HTML block comments.",
        example: "<!-- todo: refactor later -->"
    },
    {
        id: "dev-md-link",
        label: "Markdown Links",
        category: "dev",
        pattern: "\\[([^\\]]+)\\]\\(([^\\)]+)\\)",
        flags: "g",
        description: "Extracts or matches Markdown links, separating text anchor and URL href inside captures.",
        example: "[KaruviLab](https://karuvilab.com)"
    },
    {
        id: "dev-semver",
        label: "Semantic Version (SemVer)",
        category: "dev",
        pattern: "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
        flags: "g",
        description: "Validates package versions according to Semantic Versioning specifications (e.g. 1.0.0-beta+exp).",
        example: "2.1.0-alpha.5"
    },
    {
        id: "dev-cron",
        label: "Cron Expression",
        category: "dev",
        pattern: "^((((\\d+,)+\\d+|(\\d+(\\/|-)\\d+)|\\d+|\\*) ?){5,7})$",
        flags: "g",
        description: "Matches standard 5 or 6 field Cron daemon automation job schedule strings.",
        example: "*/5 * * * *"
    },
    {
        id: "dev-base64",
        label: "Base64 String",
        category: "dev",
        pattern: "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
        flags: "g",
        description: "Validates base-64 encoded binary data strings, including correct '=' padding symbols.",
        example: "SGVsbG8gS2FydXZpTGFiIQ=="
    },
    {
        id: "dev-jwt",
        label: "JWT Token",
        category: "dev",
        pattern: "^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$",
        flags: "g",
        description: "Matches structure of JSON Web Tokens, verifying headers, payload, and signatures sections.",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwi"
    },
    {
        id: "dev-css-class",
        label: "CSS Class Names",
        category: "dev",
        pattern: "\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*",
        flags: "g",
        description: "Matches standard CSS class identifiers in selectors (excluding properties).",
        example: ".btn-primary"
    },
    {
        id: "dev-xml-attr",
        label: "XML/HTML Attributes",
        category: "dev",
        pattern: "(\\w+)=([\"'])(.*?)\\2",
        flags: "g",
        description: "Matches HTML element attributes, capturing key-value pairs.",
        example: "class=\"container\""
    },
    {
        id: "dev-double-quotes",
        label: "Double Quote Strings",
        category: "dev",
        pattern: "\"[^\"]*\"",
        flags: "g",
        description: "Matches double-quoted string literals.",
        example: "\"hello world\""
    },
    {
        id: "dev-single-quotes",
        label: "Single Quote Strings",
        category: "dev",
        pattern: "'[^']*'",
        flags: "g",
        description: "Matches single-quoted string literals.",
        example: "'hello world'"
    },
    {
        id: "dev-trailing-spaces",
        label: "Trailing Whitespaces",
        category: "dev",
        pattern: "[ \\t]+$",
        flags: "gm",
        description: "Matches trailing spaces or tabs at the end of text lines. Useful for linters/formatters.",
        example: "line of code with spaces    "
    },
    {
        id: "dev-empty-lines",
        label: "Multiple Empty Lines",
        category: "dev",
        pattern: "(?:\\r?\\n){3,}",
        flags: "g",
        description: "Detects three or more consecutive linebreaks (multiple empty lines) in code scripts.",
        example: "\n\n\n"
    },
    {
        id: "dev-int",
        label: "Integer Numbers",
        category: "dev",
        pattern: "^-?\\d+$",
        flags: "g",
        description: "Matches both positive and negative integers.",
        example: "-284"
    },
    {
        id: "dev-float",
        label: "Floating Numbers",
        category: "dev",
        pattern: "^-?\\d*\\.\\d+$",
        flags: "g",
        description: "Matches positive and negative floating-point decimal numbers.",
        example: "3.14159"
    },
    {
        id: "dev-price",
        label: "Currency Prices",
        category: "dev",
        pattern: "^\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$",
        flags: "g",
        description: "Matches formatted financial currencies (e.g. $1,280.50). Includes comma thousands separators.",
        example: "$1,250.00"
    },
    {
        id: "dev-slug",
        label: "URL Slug",
        category: "dev",
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        flags: "g",
        description: "Validates standard SEO-friendly slugs containing lowercase letters, numbers, and dashes.",
        example: "regex-tester-online"
    }
];
