export interface TLVNode {
  tag: string;
  name: string;
  length: number;
  value: string;
  constructed: boolean;
  children?: TLVNode[];
}

export const EMV_TAG_DICT: Record<string, string> = {
  "4F": "Application Identifier (AID)",
  "50": "Application Label",
  "57": "Track 2 Equivalent Data",
  "5A": "Application Primary Account Number (PAN)",
  "5F20": "Cardholder Name",
  "5F24": "Application Expiration Date",
  "5F25": "Application Effective Date",
  "5F28": "Issuer Country Code",
  "5F2A": "Transaction Currency Code",
  "5F2D": "Language Preference",
  "5F30": "Service Code",
  "5F34": "Application PAN Sequence Number",
  "70": "EMV Proprietary Template",
  "71": "Issuer Script Template 1",
  "72": "Issuer Script Template 2",
  "73": "Directory Discretionary Template",
  "77": "Response Message Template Format 2",
  "80": "Response Message Template Format 1",
  "81": "Amount, Authorised (Binary)",
  "82": "Application Interchange Profile",
  "83": "Command Template",
  "84": "Dedicated File (DF) Name",
  "86": "Issuer Script Command",
  "87": "Application Priority Indicator",
  "88": "Short File Identifier (SFI)",
  "89": "Authorisation Code",
  "8A": "Authorisation Response Code",
  "8C": "Card Risk Management Data Object List 1 (CDOL1)",
  "8D": "Card Risk Management Data Object List 2 (CDOL2)",
  "8E": "Cardholder Verification Method (CVM) List",
  "8F": "Certification Authority Public Key Index",
  "90": "Issuer Public Key Certificate",
  "91": "Issuer Authentication Data",
  "92": "Issuer Public Key Remainder",
  "93": "Signed Static Application Data",
  "94": "Application File Locator (AFL)",
  "95": "Terminal Verification Results (TVR)",
  "97": "Transaction Certificate Data Object List (TDOL)",
  "98": "Transaction Certificate (TC) Hash Value",
  "99": "Transaction Personal Identification Number (PIN) Data",
  "9A": "Transaction Date",
  "9B": "Transaction Status Information",
  "9C": "Transaction Type",
  "9D": "Directory Definition File (DDF) Name",
  "9F01": "Acquirer Identifier",
  "9F02": "Amount, Authorised (Numeric)",
  "9F03": "Amount, Other (Numeric)",
  "9F04": "Amount, Other (Binary)",
  "9F05": "Application Discretionary Data",
  "9F06": "Application Identifier (AID) - terminal",
  "9F07": "Application Usage Control",
  "9F08": "Application Version Number",
  "9F09": "Application Version Number (Terminal)",
  "9F0D": "Issuer Action Code - Default",
  "9F0E": "Issuer Action Code - Denial",
  "9F0F": "Issuer Action Code - Online",
  "9F10": "Issuer Application Data",
  "9F11": "Issuer Code Table Index",
  "9F12": "Application Preferred Name",
  "9F1A": "Terminal Country Code",
  "9F1E": "Interface Device (IFD) Serial Number",
  "9F26": "Application Cryptogram",
  "9F27": "Cryptogram Information Data",
  "9F33": "Terminal Capabilities",
  "9F34": "Cardholder Verification Method (CVM) Results",
  "9F35": "Terminal Type",
  "9F36": "Application Transaction Counter (ATC)",
  "9F37": "Unpredictable Number",
  "9F42": "Application Currency Code",
  "9F4C": "ICC Dynamic Number",
  "BF0C": "File Control Information (FCI) Issuer Discretionary Data",
  "A5": "File Control Information (FCI) Proprietary Template",
};

export function parseBERTLV(hexStr: string): TLVNode[] {
  let offset = 0;
  const nodes: TLVNode[] = [];
  
  // Clean string
  const cleaned = hexStr.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (cleaned.length % 2 !== 0) throw new Error("Hex string must have an even length");
  
  const buffer = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16);
  }

  while (offset < buffer.length) {
    if (buffer[offset] === 0x00 || buffer[offset] === 0xFF) {
      // Padding
      offset++;
      continue;
    }

    let tagLen = 1;
    const tagVal = buffer[offset]!;
    let isConstructed = (tagVal & 0x20) !== 0;

    // Check if tag is multi-byte (if lower 5 bits are 11111)
    if ((tagVal & 0x1F) === 0x1F) {
      do {
        tagLen++;
        offset++;
        if (offset >= buffer.length) throw new Error("Unexpected end of data parsing tag");
      } while ((buffer[offset]! & 0x80) !== 0);
    }
    
    const tagHex = Array.from(buffer.slice(offset - tagLen + 1, offset + 1))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join('');
    
    offset++;
    
    if (offset >= buffer.length) throw new Error(`Unexpected end of data after tag ${tagHex}`);
    
    // Parse length
    let len = 0;
    const lenFirst = buffer[offset]!;
    offset++;
    
    if ((lenFirst & 0x80) === 0) {
      // Short form length
      len = lenFirst;
    } else {
      // Long form length
      const lenBytes = lenFirst & 0x7F;
      if (lenBytes === 0) throw new Error("Indefinite length forms not supported in standard EMV");
      if (offset + lenBytes > buffer.length) throw new Error(`Unexpected end of data parsing length for tag ${tagHex}`);
      
      for (let i = 0; i < lenBytes; i++) {
        len = (len << 8) | buffer[offset]!;
        offset++;
      }
    }
    
    if (offset + len > buffer.length) {
      throw new Error(`Tag ${tagHex} indicates length ${len} but only ${buffer.length - offset} bytes remain`);
    }
    
    const valueSlice = buffer.slice(offset, offset + len);
    const valueHex = Array.from(valueSlice)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join('');
      
    let children: TLVNode[] | undefined;
    if (isConstructed) {
      try {
        children = parseBERTLV(valueHex);
      } catch (e) {
        // Fallback if structured parsing fails
        isConstructed = false;
      }
    }
    
    const node: TLVNode = {
      tag: tagHex,
      name: EMV_TAG_DICT[tagHex] || "Unknown Tag",
      length: len,
      value: valueHex,
      constructed: isConstructed,
    };
    if (children) {
      node.children = children;
    }
    nodes.push(node);
    
    offset += len;
  }
  
  return nodes;
}
