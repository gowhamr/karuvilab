/**
 * JWT, OAuth, SAML, and Base64URL Token Processing Utilities
 * 100% Browser-Native & Zero-Dependency
 */
export function base64UrlEncode(str) {
    let b64 = "";
    if (typeof str === "string") {
        b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    }
    else {
        let binary = "";
        for (let i = 0; i < str.length; i++)
            binary += String.fromCharCode(str[i]);
        b64 = btoa(binary);
    }
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
export function base64UrlDecode(b64url) {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0)
        b64 += "=";
    const binary = atob(b64);
    try {
        return decodeURIComponent(Array.from(binary)
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join(""));
    }
    catch {
        return binary;
    }
}
export function base64UrlToBytes(b64url) {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0)
        b64 += "=";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++)
        bytes[i] = binary.charCodeAt(i);
    return bytes;
}
export function parseJwt(token) {
    const parts = token.trim().split(".");
    if (parts.length < 2 || parts.length > 3) {
        throw new Error("Invalid JWT token format. Must contain 2 or 3 dot-separated parts.");
    }
    const [headerB64, payloadB64, sigB64 = ""] = parts;
    const headerStr = base64UrlDecode(headerB64);
    const payloadStr = base64UrlDecode(payloadB64);
    let header = {};
    let payload = {};
    try {
        header = JSON.parse(headerStr);
    }
    catch {
        throw new Error("Failed to parse JWT Header JSON");
    }
    try {
        payload = JSON.parse(payloadStr);
    }
    catch {
        throw new Error("Failed to parse JWT Payload JSON");
    }
    const sigBytes = base64UrlToBytes(sigB64);
    const sigHex = Array.from(sigBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    const nowSec = Math.floor(Date.now() / 1000);
    let isExpired = undefined;
    let expirationDate = undefined;
    let issuedAtDate = undefined;
    if (typeof payload.exp === "number") {
        isExpired = payload.exp < nowSec;
        expirationDate = new Date(payload.exp * 1000).toISOString();
    }
    if (typeof payload.iat === "number") {
        issuedAtDate = new Date(payload.iat * 1000).toISOString();
    }
    return {
        header,
        payload,
        signatureHex: sigHex,
        signatureB64Url: sigB64,
        rawHeaderB64: headerB64,
        rawPayloadB64: payloadB64,
        signingInput: `${headerB64}.${payloadB64}`,
        isExpired,
        issuedAtDate,
        expirationDate,
    };
}
/**
 * Verifies JWT signature using Web Crypto API natively
 */
export async function verifyJwtSignature(token, secretOrPublicKeyPem) {
    try {
        const { header, signingInput, signatureB64Url } = parseJwt(token);
        const alg = header.alg || "HS256";
        const sigBytes = base64UrlToBytes(signatureB64Url);
        const dataBytes = new TextEncoder().encode(signingInput);
        if (alg.startsWith("HS")) {
            const hashAlgo = alg === "HS256" ? "SHA-256" : alg === "HS384" ? "SHA-384" : "SHA-512";
            const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secretOrPublicKeyPem), { name: "HMAC", hash: hashAlgo }, false, ["verify"]);
            const valid = await crypto.subtle.verify("HMAC", key, sigBytes.buffer, dataBytes.buffer);
            return { valid, algorithm: alg };
        }
        if (alg.startsWith("RS") || alg.startsWith("PS")) {
            const hashAlgo = alg.includes("256") ? "SHA-256" : alg.includes("384") ? "SHA-384" : "SHA-512";
            const pemB64 = secretOrPublicKeyPem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
            const keyBytes = base64ToBytes(pemB64);
            const cryptoAlgo = alg.startsWith("RS")
                ? { name: "RSASSA-PKCS1-v1_5", hash: hashAlgo }
                : { name: "RSA-PSS", hash: hashAlgo };
            const key = await crypto.subtle.importKey("spki", keyBytes.buffer, cryptoAlgo, false, ["verify"]);
            const valid = await crypto.subtle.verify(alg.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : { name: "RSA-PSS", saltLength: 32 }, key, sigBytes.buffer, dataBytes.buffer);
            return { valid, algorithm: alg };
        }
        if (alg.startsWith("ES")) {
            const namedCurve = alg === "ES256" ? "P-256" : alg === "ES384" ? "P-384" : "P-521";
            const hashAlgo = alg === "ES256" ? "SHA-256" : alg === "ES384" ? "SHA-384" : "SHA-512";
            const pemB64 = secretOrPublicKeyPem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
            const keyBytes = base64ToBytes(pemB64);
            const key = await crypto.subtle.importKey("spki", keyBytes.buffer, { name: "ECDSA", namedCurve }, false, ["verify"]);
            const valid = await crypto.subtle.verify({ name: "ECDSA", hash: hashAlgo }, key, sigBytes.buffer, dataBytes.buffer);
            return { valid, algorithm: alg };
        }
        return { valid: false, algorithm: alg, error: `Unsupported algorithm: ${alg}` };
    }
    catch (err) {
        return { valid: false, algorithm: "UNKNOWN", error: err instanceof Error ? err.message : String(err) };
    }
}
function base64ToBytes(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++)
        bytes[i] = binary.charCodeAt(i);
    return bytes;
}
export function parseSaml(input) {
    let cleaned = input.trim();
    if (cleaned.startsWith("SAMLRequest=") || cleaned.startsWith("SAMLResponse=")) {
        cleaned = decodeURIComponent(cleaned.split("=")[1]);
    }
    let xmlStr = "";
    if (cleaned.startsWith("<")) {
        xmlStr = cleaned;
    }
    else {
        try {
            xmlStr = base64UrlDecode(cleaned);
        }
        catch {
            xmlStr = atob(cleaned.replace(/\s/g, ""));
        }
    }
    // Parse XML elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xml");
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
        throw new Error(`SAML XML Parsing Error: ${parserError.textContent}`);
    }
    const isResponse = Boolean(doc.querySelector("Response, samlp\\:Response, saml\\:Response"));
    const isRequest = Boolean(doc.querySelector("AuthnRequest, samlp\\:AuthnRequest, LogoutRequest, samlp\\:LogoutRequest"));
    const issuerEl = doc.querySelector("Issuer, saml\\:Issuer");
    const nameIdEl = doc.querySelector("NameID, saml\\:NameID");
    const rootEl = doc.documentElement;
    const issuer = issuerEl?.textContent?.trim() || undefined;
    const nameId = nameIdEl?.textContent?.trim() || undefined;
    const destination = rootEl?.getAttribute("Destination") || undefined;
    const issueInstant = rootEl?.getAttribute("IssueInstant") || undefined;
    const attributes = {};
    const attrEls = doc.querySelectorAll("Attribute, saml\\:Attribute");
    attrEls.forEach((el) => {
        const name = el.getAttribute("Name") || el.getAttribute("FriendlyName") || "Attribute";
        const valEl = el.querySelector("AttributeValue, saml\\:AttributeValue");
        if (valEl) {
            attributes[name] = valEl.textContent?.trim() || "";
        }
    });
    return {
        rawInput: input,
        decodedXml: formatXml(xmlStr),
        issuer,
        nameId,
        destination,
        issueInstant,
        attributes,
        isResponse,
        isRequest,
    };
}
function formatXml(xml) {
    let formatted = "";
    const reg = /(>)(<)(\/*)/g;
    const xmlCleaned = xml.replace(reg, "$1\r\n$2$3");
    let pad = 0;
    xmlCleaned.split("\r\n").forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        }
        else if (node.match(/^<\/\w/)) {
            if (pad !== 0)
                pad -= 1;
        }
        else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        }
        formatted += "  ".repeat(pad) + node + "\n";
        pad += indent;
    });
    return formatted.trim();
}
