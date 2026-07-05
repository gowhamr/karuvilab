/**
 * Lightweight ASN.1 DER Parser & Encoder for X.509, CSR, PEM & Key Inspection
 * 100% Browser-Native & Zero-Dependency
 */

export interface ASN1Node {
  tag: number;
  tagClass: number; // 0: Universal, 1: Application, 2: Context-Specific, 3: Private
  isConstructed: boolean;
  typeHex: string;
  length: number;
  headerLength: number;
  raw: Uint8Array;
  value: Uint8Array;
  children: ASN1Node[];
}

export const KNOWN_OIDS: Record<string, string> = {
  "2.5.4.3": "Common Name (CN)",
  "2.5.4.6": "Country Name (C)",
  "2.5.4.7": "Locality Name (L)",
  "2.5.4.8": "State or Province (ST)",
  "2.5.4.10": "Organization Name (O)",
  "2.5.4.11": "Organizational Unit (OU)",
  "2.5.4.9": "Street Address",
  "1.2.840.113549.1.1.1": "rsaEncryption",
  "1.2.840.113549.1.1.5": "sha1WithRSAEncryption",
  "1.2.840.113549.1.1.11": "sha256WithRSAEncryption",
  "1.2.840.113549.1.1.12": "sha384WithRSAEncryption",
  "1.2.840.113549.1.1.13": "sha512WithRSAEncryption",
  "1.2.840.113549.1.1.8": "pkcs1-MGF1",
  "1.2.840.113549.1.1.7": "id-RSAES-OAEP",
  "1.2.840.113549.1.1.10": "id-RSASSA-PSS",
  "1.2.840.10045.2.1": "ecPublicKey",
  "1.2.840.10045.3.1.7": "prime256v1 (P-256)",
  "1.3.132.0.34": "secp384r1 (P-384)",
  "1.3.132.0.35": "secp521r1 (P-521)",
  "1.2.840.10045.4.3.2": "ecdsa-with-SHA256",
  "1.2.840.10045.4.3.3": "ecdsa-with-SHA384",
  "1.2.840.10045.4.3.4": "ecdsa-with-SHA512",
  "2.5.29.14": "Subject Key Identifier",
  "2.5.29.15": "Key Usage",
  "2.5.29.17": "Subject Alternative Name",
  "2.5.29.19": "Basic Constraints",
  "2.5.29.35": "Authority Key Identifier",
  "2.5.29.37": "Extended Key Usage",
  "1.3.6.1.5.5.7.3.1": "Server Authentication",
  "1.3.6.1.5.5.7.3.2": "Client Authentication",
  "1.3.6.1.5.5.7.3.3": "Code Signing",
  "1.3.6.1.5.5.7.3.4": "Email Protection",
};

/**
 * Parses DER Uint8Array into ASN.1 tree structure
 */
export function parseASN1(data: Uint8Array, offset = 0): ASN1Node {
  if (offset >= data.length) {
    throw new Error("Invalid DER data offset out of bounds");
  }

  const startOffset = offset;
  const tagByte = data[offset++]!;
  const tagClass = (tagByte & 0xc0) >> 6;
  const isConstructed = Boolean(tagByte & 0x20);
  const tag = tagByte & 0x1f;

  let length = 0;
  const lenByte = data[offset++]!;

  if (lenByte & 0x80) {
    const numLenBytes = lenByte & 0x7f;
    if (numLenBytes === 0) {
      throw new Error("Indefinite length encoding not supported");
    }
    for (let i = 0; i < numLenBytes; i++) {
      length = (length << 8) | data[offset++]!;
    }
  } else {
    length = lenByte;
  }

  const headerLength = offset - startOffset;
  const valueEnd = offset + length;
  const value = data.subarray(offset, Math.min(valueEnd, data.length));
  const raw = data.subarray(startOffset, Math.min(valueEnd, data.length));

  const children: ASN1Node[] = [];
  if (isConstructed) {
    let childOffset = 0;
    while (childOffset < value.length) {
      try {
        const child = parseASN1(value, childOffset);
        children.push(child);
        childOffset += child.headerLength + child.length;
      } catch {
        break;
      }
    }
  }

  return {
    tag,
    tagClass,
    isConstructed,
    typeHex: tagByte.toString(16).padStart(2, "0").toUpperCase(),
    length,
    headerLength,
    raw,
    value,
    children,
  };
}

/**
 * Converts DER OID bytes to dot-separated string (e.g. 1.2.840.113549.1.1.1)
 */
export function decodeOID(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";
  const first = bytes[0]!;
  const components = [Math.floor(first / 40), first % 40];

  let val = 0;
  for (let i = 1; i < bytes.length; i++) {
    const b = bytes[i]!;
    val = (val << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) {
      components.push(val);
      val = 0;
    }
  }
  return components.join(".");
}

/**
 * Encodes dot OID string to DER bytes
 */
export function encodeOID(oid: string): Uint8Array {
  const parts = oid.split(".").map(Number);
  if (parts.length < 2) throw new Error("Invalid OID format");
  const bytes: number[] = [parts[0]! * 40 + parts[1]!];

  for (let i = 2; i < parts.length; i++) {
    let num = parts[i]!;
    const stack: number[] = [];
    stack.push(num & 0x7f);
    num >>= 7;
    while (num > 0) {
      stack.push((num & 0x7f) | 0x80);
      num >>= 7;
    }
    stack.reverse();
    bytes.push(...stack);
  }
  return new Uint8Array(bytes);
}

/**
 * Converts ASN.1 PrintableString/UTF8String/IA5String bytes to text
 */
export function decodeASN1String(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join("");
  }
}

/**
 * Converts DER INTEGER or OCTET STRING bytes to Hex string
 */
export function bytesToHex(bytes: Uint8Array, separator = ""): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(separator)
    .toUpperCase();
}

/**
 * Converts Base64 or Hex to Uint8Array
 */
export function parseBinaryInput(input: string): Uint8Array {
  const cleaned = input.trim();
  if (cleaned.startsWith("-----BEGIN")) {
    const b64 = cleaned.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
    return base64ToBytes(b64);
  }
  if (/^[0-9a-fA-F\s:]+$/.test(cleaned) && cleaned.length > 8) {
    const hex = cleaned.replace(/[\s:]/g, "");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }
  try {
    return base64ToBytes(cleaned.replace(/\s/g, ""));
  } catch {
    return new TextEncoder().encode(input);
  }
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export function formatPem(type: string, bytes: Uint8Array): string {
  const b64 = bytesToBase64(bytes);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}

export interface PemBlock {
  type: string;
  bytes: Uint8Array;
  b64: string;
}

export function parsePemBlocks(input: string): PemBlock[] {
  const regex = /-----BEGIN ([^-]+)-----\s*([\s\S]*?)\s*-----END \1-----/g;
  const blocks: PemBlock[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const type = match[1]!.trim();
    const b64 = match[2]!.replace(/\s/g, "");
    try {
      const bytes = base64ToBytes(b64);
      blocks.push({ type, bytes, b64 });
    } catch {
      // invalid block
    }
  }

  if (blocks.length === 0 && input.trim()) {
    try {
      const bytes = parseBinaryInput(input);
      blocks.push({ type: "UNKNOWN / BINARY", bytes, b64: bytesToBase64(bytes) });
    } catch {
      // unable to parse
    }
  }

  return blocks;
}

// ─── X.509 CERTIFICATE PARSER ───────────────────────────────────────────────

export interface X509CertificateInfo {
  version: number;
  serialNumber: string;
  issuer: Record<string, string>;
  issuerString: string;
  validFrom: string;
  validTo: string;
  subject: Record<string, string>;
  subjectString: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  keySizeBits?: number | undefined;
  fingerprintSha256: string;
  fingerprintSha1: string;
  extensions: Array<{ oid: string; name: string; critical: boolean; valueHex: string }>;
  rawDer: Uint8Array;
}

export function parseX509Certificate(der: Uint8Array): X509CertificateInfo {
  const root = parseASN1(der);
  if (root.children.length < 3) throw new Error("Invalid X.509 Certificate DER structure");

  const tbsCert = root.children[0]!;
  const sigAlgoNode = root.children[1]!;
  const sigValueNode = root.children[2]!;

  // TBSCert fields
  let idx = 0;
  let version = 1;
  if (tbsCert.children[idx]?.tag === 0) { // Context [0] EXPLICIT
    version = (tbsCert.children[idx]?.children[0]?.value[0] ?? 0) + 1;
    idx++;
  }

  const serialBytes = tbsCert.children[idx]?.value ?? new Uint8Array();
  const serialNumber = bytesToHex(serialBytes, ":");
  idx++;

  const certSigAlgoOid = decodeOID(tbsCert.children[idx]?.children[0]?.value ?? new Uint8Array());
  idx++;

  const issuerNode = tbsCert.children[idx]!;
  const issuer = parseDistinguishedName(issuerNode);
  idx++;

  const validityNode = tbsCert.children[idx]!;
  const validFrom = parseASN1Time(validityNode.children[0]?.value ?? new Uint8Array());
  const validTo = parseASN1Time(validityNode.children[1]?.value ?? new Uint8Array());
  idx++;

  const subjectNode = tbsCert.children[idx]!;
  const subject = parseDistinguishedName(subjectNode);
  idx++;

  const subjectPublicKeyInfo = tbsCert.children[idx]!;
  const pkAlgoOid = decodeOID(subjectPublicKeyInfo.children[0]?.children[0]?.value ?? new Uint8Array());
  const publicKeyAlgorithm = KNOWN_OIDS[pkAlgoOid] ?? pkAlgoOid;

  let keySizeBits: number | undefined;
  if (subjectPublicKeyInfo.children[1]) {
    const bitStringBytes = subjectPublicKeyInfo.children[1].value;
    // Skip padding bit count (1st byte)
    const pubKeyBytes = bitStringBytes.subarray(1);
    try {
      const pubKeyAsn1 = parseASN1(pubKeyBytes);
      if (pubKeyAsn1.children[0]?.tag === 2) { // INTEGER modulus
        keySizeBits = (pubKeyAsn1.children[0].value.length - (pubKeyAsn1.children[0].value[0] === 0 ? 1 : 0)) * 8;
      }
    } catch {
      keySizeBits = pubKeyBytes.length * 8;
    }
  }

  // Extensions
  idx++;
  const extensions: Array<{ oid: string; name: string; critical: boolean; valueHex: string }> = [];
  if (tbsCert.children[idx]?.tag === 3) {
    const extSeq = tbsCert.children[idx]?.children[0];
    if (extSeq) {
      extSeq.children.forEach((ext) => {
        const extOid = decodeOID(ext.children[0]?.value ?? new Uint8Array());
        let critical = false;
        let valIdx = 1;
        if (ext.children[1]?.tag === 1) { // BOOLEAN
          critical = Boolean(ext.children[1].value[0]);
          valIdx = 2;
        }
        const valOctets = ext.children[valIdx]?.value ?? new Uint8Array();
        extensions.push({
          oid: extOid,
          name: KNOWN_OIDS[extOid] ?? extOid,
          critical,
          valueHex: bytesToHex(valOctets, " "),
        });
      });
    }
  }

  const signatureAlgorithm = KNOWN_OIDS[certSigAlgoOid] ?? certSigAlgoOid;

  return {
    version,
    serialNumber,
    issuer,
    issuerString: formatDNString(issuer),
    validFrom,
    validTo,
    subject,
    subjectString: formatDNString(subject),
    signatureAlgorithm,
    publicKeyAlgorithm,
    keySizeBits,
    fingerprintSha256: "", // calculated asynchronously in UI or caller
    fingerprintSha1: "",
    extensions,
    rawDer: der,
  };
}

function parseDistinguishedName(node: ASN1Node): Record<string, string> {
  const result: Record<string, string> = {};
  if (!node.children) return result;

  node.children.forEach((setNode) => {
    setNode.children?.forEach((seqNode) => {
      if (seqNode.children?.length >= 2) {
        const oid = decodeOID(seqNode.children[0]!.value);
        const valStr = decodeASN1String(seqNode.children[1]!.value);
        const name = KNOWN_OIDS[oid] ?? oid;
        result[name] = valStr;
      }
    });
  });
  return result;
}

function formatDNString(dn: Record<string, string>): string {
  return Object.entries(dn)
    .map(([k, v]) => `${k.replace(/\s*\([^)]*\)/, "")}=${v}`)
    .join(", ");
}

function parseASN1Time(bytes: Uint8Array): string {
  const str = decodeASN1String(bytes);
  let year = 0;
  let month = 0;
  let day = 0;
  let hour = 0;
  let min = 0;
  let sec = 0;

  if (str.length >= 12) {
    if (str.length === 13 || str.length === 15) { // UTCTime (YYMMDDhhmmssZ) or GeneralizedTime (YYYYMMDDhhmmssZ)
      if (str.length <= 13) {
        let yy = parseInt(str.substring(0, 2), 10);
        year = yy >= 50 ? 1900 + yy : 2000 + yy;
        month = parseInt(str.substring(2, 4), 10) - 1;
        day = parseInt(str.substring(4, 6), 10);
        hour = parseInt(str.substring(6, 8), 10);
        min = parseInt(str.substring(8, 10), 10);
        sec = parseInt(str.substring(10, 12), 10);
      } else {
        year = parseInt(str.substring(0, 4), 10);
        month = parseInt(str.substring(4, 6), 10) - 1;
        day = parseInt(str.substring(6, 8), 10);
        hour = parseInt(str.substring(8, 10), 10);
        min = parseInt(str.substring(10, 12), 10);
        sec = parseInt(str.substring(12, 14), 10);
      }
      return new Date(Date.UTC(year, month, day, hour, min, sec)).toISOString();
    }
  }
  return str;
}
