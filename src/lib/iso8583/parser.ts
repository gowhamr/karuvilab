export type FieldType = 'FIXED' | 'LLVAR' | 'LLLVAR';

export interface FieldDef {
  type: FieldType;
  length: number;
}

export const ISO8583_DEFS: Record<number, FieldDef> = {
  2: { type: 'LLVAR', length: 19 },
  3: { type: 'FIXED', length: 6 },
  4: { type: 'FIXED', length: 12 },
  5: { type: 'FIXED', length: 12 },
  6: { type: 'FIXED', length: 12 },
  7: { type: 'FIXED', length: 10 },
  8: { type: 'FIXED', length: 8 },
  9: { type: 'FIXED', length: 8 },
  10: { type: 'FIXED', length: 8 },
  11: { type: 'FIXED', length: 6 },
  12: { type: 'FIXED', length: 6 },
  13: { type: 'FIXED', length: 4 },
  14: { type: 'FIXED', length: 4 },
  15: { type: 'FIXED', length: 4 },
  16: { type: 'FIXED', length: 4 },
  17: { type: 'FIXED', length: 4 },
  18: { type: 'FIXED', length: 4 },
  19: { type: 'FIXED', length: 3 },
  20: { type: 'FIXED', length: 3 },
  21: { type: 'FIXED', length: 3 },
  22: { type: 'FIXED', length: 3 },
  23: { type: 'FIXED', length: 3 },
  24: { type: 'FIXED', length: 3 },
  25: { type: 'FIXED', length: 2 },
  26: { type: 'FIXED', length: 2 },
  27: { type: 'FIXED', length: 1 },
  28: { type: 'FIXED', length: 8 },
  29: { type: 'FIXED', length: 8 },
  30: { type: 'FIXED', length: 8 },
  31: { type: 'FIXED', length: 8 },
  32: { type: 'LLVAR', length: 11 },
  33: { type: 'LLVAR', length: 11 },
  34: { type: 'LLVAR', length: 28 },
  35: { type: 'LLVAR', length: 37 },
  36: { type: 'LLLVAR', length: 104 },
  37: { type: 'FIXED', length: 12 },
  38: { type: 'FIXED', length: 6 },
  39: { type: 'FIXED', length: 2 },
  40: { type: 'FIXED', length: 3 },
  41: { type: 'FIXED', length: 8 },
  42: { type: 'FIXED', length: 15 },
  43: { type: 'FIXED', length: 40 },
  44: { type: 'LLVAR', length: 25 },
  45: { type: 'LLVAR', length: 76 },
  46: { type: 'LLLVAR', length: 999 },
  47: { type: 'LLLVAR', length: 999 },
  48: { type: 'LLLVAR', length: 999 },
  49: { type: 'FIXED', length: 3 },
  50: { type: 'FIXED', length: 3 },
  51: { type: 'FIXED', length: 3 },
  52: { type: 'FIXED', length: 16 },
  53: { type: 'FIXED', length: 16 },
  54: { type: 'LLLVAR', length: 120 },
  55: { type: 'LLLVAR', length: 999 },
  56: { type: 'LLLVAR', length: 999 },
  57: { type: 'LLLVAR', length: 999 },
  58: { type: 'LLLVAR', length: 999 },
  59: { type: 'LLLVAR', length: 999 },
  60: { type: 'LLLVAR', length: 999 },
  61: { type: 'LLLVAR', length: 999 },
  62: { type: 'LLLVAR', length: 999 },
  63: { type: 'LLLVAR', length: 999 },
  64: { type: 'FIXED', length: 16 },
  70: { type: 'FIXED', length: 3 },
  90: { type: 'FIXED', length: 42 },
  100: { type: 'LLVAR', length: 11 },
  102: { type: 'LLVAR', length: 28 },
  103: { type: 'LLVAR', length: 28 },
  104: { type: 'LLLVAR', length: 100 },
  111: { type: 'LLLVAR', length: 999 },
  112: { type: 'LLLVAR', length: 999 },
  120: { type: 'LLLVAR', length: 999 },
  121: { type: 'LLLVAR', length: 999 },
  122: { type: 'LLLVAR', length: 999 },
  123: { type: 'LLLVAR', length: 999 },
  124: { type: 'LLLVAR', length: 999 },
  125: { type: 'LLLVAR', length: 999 },
  126: { type: 'LLLVAR', length: 999 },
  127: { type: 'LLLVAR', length: 999 },
  128: { type: 'FIXED', length: 16 }
};

export const ISO8583_FIELD_NAMES: Record<number, string> = {
  1: "Secondary Bitmap Indicator",
  2: "Primary Account Number (PAN)",
  3: "Processing Code",
  4: "Amount, Transaction",
  5: "Amount, Settlement",
  6: "Amount, Cardholder Billing",
  7: "Transmission Date & Time",
  11: "System Trace Audit Number (STAN)",
  12: "Local Transaction Time (hhmmss)",
  13: "Local Transaction Date (MMDD)",
  14: "Expiration Date (YYMM)",
  15: "Settlement Date",
  18: "Merchant Type / Category Code",
  22: "Point of Service (POS) Entry Mode",
  23: "Card Sequence Number",
  25: "POS Condition Code",
  28: "Amount, Transaction Fee",
  32: "Acquiring Institution ID Code",
  35: "Track 2 Data",
  37: "Retrieval Reference Number (RRN)",
  38: "Authorization ID Response",
  39: "Response Code",
  41: "Card Acceptor Terminal ID",
  42: "Card Acceptor ID Code",
  43: "Card Acceptor Name / Location",
  48: "Additional Data - Private",
  49: "Currency Code, Transaction",
  52: "Personal ID Number (PIN) Data",
  53: "Security Related Control Information",
  54: "Additional Amounts",
  55: "ICC Data - EMV Tags",
  60: "Private Use - Self-Defined",
  64: "Message Authentication Code (MAC)",
  70: "Network Management Information Code",
  90: "Original Data Elements",
  102: "Account Identification 1",
  103: "Account Identification 2",
  128: "Secondary MAC",
};

export interface ParsedISOField {
  field: number;
  name: string;
  value: string;
}

export function parseIso8583(msgInput: string) {
  const cleaned = msgInput.replace(/\s/g, "");
  if (cleaned.length < 20) {
    throw new Error("Input string too short for valid ISO 8583 MTI + Bitmap");
  }

  // MTI: First 4 characters
  const mti = cleaned.substring(0, 4);

  // Bitmap: Next 16 chars (or 32 if secondary)
  let bmapHex = cleaned.substring(4, 20);
  const firstByte = parseInt(bmapHex.substring(0, 2), 16);
  if (firstByte & 0x80) { // Field 1 bit set -> 32 hex chars bitmap
    bmapHex = cleaned.substring(4, 36);
  }

  // Remaining payload parse
  const payload = cleaned.substring(4 + bmapHex.length);
  const parsedFields: ParsedISOField[] = [];

  // Extract present field numbers from bitmap
  const bytes: number[] = [];
  for (let i = 0; i < bmapHex.length; i += 2) {
    bytes.push(parseInt(bmapHex.substring(i, i + 2), 16));
  }

  const presentFields: number[] = [];
  bytes.forEach((b, byteIdx) => {
    for (let bit = 7; bit >= 0; bit--) {
      if (b & (1 << bit)) {
        const fieldNum = byteIdx * 8 + (8 - bit);
        if (fieldNum > 1) {
          presentFields.push(fieldNum);
        }
      }
    }
  });

  let offset = 0;
  for (const fieldNum of presentFields) {
    const def = ISO8583_DEFS[fieldNum];
    const name = ISO8583_FIELD_NAMES[fieldNum] || `Field ${fieldNum}`;
    let val = "";

    if (!def) {
      // If we don't know the definition, we can't parse further because we don't know the length.
      throw new Error(`Unknown field definition for Field ${fieldNum}. Parsing halted.`);
    }

    if (def.type === 'FIXED') {
      if (offset + def.length > payload.length) {
        throw new Error(`Unexpected end of data at Field ${fieldNum}`);
      }
      val = payload.substring(offset, offset + def.length);
      offset += def.length;
    } else if (def.type === 'LLVAR') {
      if (offset + 2 > payload.length) throw new Error(`Unexpected end of data at Field ${fieldNum} length indicator`);
      const lenStr = payload.substring(offset, offset + 2);
      const len = parseInt(lenStr, 10);
      if (isNaN(len)) throw new Error(`Invalid LLVAR length '${lenStr}' at Field ${fieldNum}`);
      offset += 2;
      
      if (offset + len > payload.length) throw new Error(`Unexpected end of data at Field ${fieldNum} content`);
      val = payload.substring(offset, offset + len);
      offset += len;
    } else if (def.type === 'LLLVAR') {
      if (offset + 3 > payload.length) throw new Error(`Unexpected end of data at Field ${fieldNum} length indicator`);
      const lenStr = payload.substring(offset, offset + 3);
      const len = parseInt(lenStr, 10);
      if (isNaN(len)) throw new Error(`Invalid LLLVAR length '${lenStr}' at Field ${fieldNum}`);
      offset += 3;
      
      if (offset + len > payload.length) throw new Error(`Unexpected end of data at Field ${fieldNum} content`);
      val = payload.substring(offset, offset + len);
      offset += len;
    }

    parsedFields.push({
      field: fieldNum,
      name,
      value: val,
    });
  }

  return { mti, bitmapHex: bmapHex, fields: parsedFields, rawRemaining: payload.substring(offset) };
}
