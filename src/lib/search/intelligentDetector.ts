/**
 * KaruviLab Intelligent Search - P1 Content & Clipboard Pattern Detector
 * Analyzes pasted or typed strings and suggests the most relevant tool.
 */

export interface DetectedToolSuggestion {
  toolId: string;
  confidence: number;
  reason: string;
}

export function detectContentToolSuggestion(input: string): DetectedToolSuggestion | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length < 3) return null;

  // 1. JWT Token Detection (eyJ...)
  if (/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/.test(trimmed)) {
    return { toolId: "jwt-decoder", confidence: 0.99, reason: "Pasted payload matches JWT token structure" };
  }

  // 2. JSON Payload Detection
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      JSON.parse(trimmed);
      return { toolId: "json-formatter", confidence: 0.98, reason: "Pasted text is valid JSON payload" };
    } catch {
      // Could be partial JSON
      return { toolId: "json-formatter", confidence: 0.85, reason: "Pasted text resembles JSON structure" };
    }
  }

  // 3. X.509 Certificate Detection
  if (trimmed.includes("-----BEGIN CERTIFICATE-----")) {
    return { toolId: "x509-viewer", confidence: 0.99, reason: "Pasted content contains X.509 PEM Certificate" };
  }

  // 4. PEM Public / Private Key Detection
  if (trimmed.includes("-----BEGIN PUBLIC KEY-----") || trimmed.includes("-----BEGIN RSA PUBLIC KEY-----")) {
    return { toolId: "public-key-inspector", confidence: 0.99, reason: "Pasted content is a PEM Public Key" };
  }
  if (trimmed.includes("-----BEGIN PRIVATE KEY-----") || trimmed.includes("-----BEGIN RSA PRIVATE KEY-----")) {
    return { toolId: "private-key-checker", confidence: 0.99, reason: "Pasted content is a PEM Private Key" };
  }

  // 5. SSH Public Key
  if (trimmed.startsWith("ssh-rsa ") || trimmed.startsWith("ssh-ed25519 ")) {
    return { toolId: "public-key-inspector", confidence: 0.95, reason: "Pasted content is an SSH Public Key" };
  }

  // 6. ISO 8583 Message Payload Detection (Starts with MTI e.g. 0100, 0200, 0400, 0800 followed by 16 hex chars)
  if (/^(0100|0110|0200|0210|0400|0410|0800|0810)[0-9A-Fa-f]{16,}/.test(trimmed)) {
    return { toolId: "iso8583-message-parser", confidence: 0.98, reason: "Pasted string matches ISO 8583 payment MTI & Bitmap" };
  }

  // 6b. EMV TLV / APDU Detection (e.g. 9F26, 9F27, 9F10 or APDU 00A40400)
  if (/^(9F[0-7][0-9A-F]|[5-9][0-9A-F]{3})[0-9A-Fa-f]{4,}/i.test(trimmed) || /^(00A40400|80A80000|00B2)/i.test(trimmed)) {
    return { toolId: "emv-tlv-parser", confidence: 0.96, reason: "Pasted payload matches EMV TLV or APDU command structure" };
  }

  // 6c. SWIFT MT / MX Detection
  if (/^\{1:F01|\:20:|\:32A:|\:50K:/m.test(trimmed)) {
    return { toolId: "swift-mt-viewer", confidence: 0.98, reason: "Pasted text matches SWIFT MT message block syntax" };
  }
  if (trimmed.includes("pacs.008") || trimmed.includes("camt.053") || trimmed.includes("pain.001") || trimmed.includes("<AppHdr>")) {
    return { toolId: "swift-mx-viewer", confidence: 0.98, reason: "Pasted XML matches SWIFT MX ISO 20022 message" };
  }

  // 6d. IBAN Detection (Country code + 2 digits + up to 30 alphanumeric)
  if (/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i.test(trimmed.replace(/\s+/g, ""))) {
    return { toolId: "iban-validator", confidence: 0.97, reason: "Pasted text matches International Bank Account Number (IBAN)" };
  }

  // 6e. BIC / SWIFT Code Detection (8 or 11 alphanumeric characters)
  if (/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(trimmed)) {
    return { toolId: "swift-bic-decoder", confidence: 0.95, reason: "Pasted string matches SWIFT / BIC institution code" };
  }

  // 6f. Card PAN / Luhn Check (13 to 19 digits)
  if (/^[0-9]{13,19}$/.test(trimmed.replace(/[\s-]/g, ""))) {
    return { toolId: "luhn-validator", confidence: 0.92, reason: "Pasted sequence resembles Payment Card Number (PAN)" };
  }

  // 7. SQL Query Detection
  if (/^\s*(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE)\b/i.test(trimmed)) {
    return { toolId: "sql-formatter", confidence: 0.98, reason: "Pasted string is an SQL Query" };
  }

  // 8. XML Payload Detection
  if (trimmed.startsWith("<?xml") || (/^<[A-Za-z0-9_-]+.*>$/.test(trimmed) && trimmed.endsWith(">"))) {
    return { toolId: "xml-formatter", confidence: 0.95, reason: "Pasted string is XML content" };
  }

  // 9. YAML Config Detection
  if (/^\s*(apiVersion:|kind:|services:|version:|name:)/m.test(trimmed)) {
    return { toolId: "yaml-json-converter", confidence: 0.92, reason: "Pasted content matches YAML configuration" };
  }

  // 10. SAML Request/Assertion Detection
  if (trimmed.includes("samlp:AuthnRequest") || trimmed.includes("samlp:Response") || trimmed.includes("SAMLRequest=")) {
    return { toolId: "saml-decoder", confidence: 0.98, reason: "Pasted content matches SAML Request/Response" };
  }

  // 11. Base64 String Detection
  if (trimmed.length > 20 && /^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0) {
    return { toolId: "base64-encoder", confidence: 0.88, reason: "Pasted string matches Base64 encoded structure" };
  }

  // 12. Hex String Detection
  if (trimmed.length > 16 && /^[0-9A-Fa-f\s]+$/.test(trimmed) && trimmed.replace(/\s/g, "").length % 2 === 0) {
    return { toolId: "hex-viewer", confidence: 0.85, reason: "Pasted string contains valid Hex bytes" };
  }

  return null;
}
