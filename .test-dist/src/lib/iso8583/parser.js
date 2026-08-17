// Full ISO 8583:1987 / ISO 8583:1993 Standard Field Definitions (Fields 1 - 128)
export const ISO8583_DEFS = {
    1: { type: 'FIXED', length: 16 },
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
    65: { type: 'FIXED', length: 16 },
    66: { type: 'FIXED', length: 1 },
    67: { type: 'FIXED', length: 2 },
    68: { type: 'FIXED', length: 3 },
    69: { type: 'FIXED', length: 3 },
    70: { type: 'FIXED', length: 3 },
    71: { type: 'FIXED', length: 4 },
    72: { type: 'FIXED', length: 4 },
    73: { type: 'FIXED', length: 6 },
    74: { type: 'FIXED', length: 10 },
    75: { type: 'FIXED', length: 10 },
    76: { type: 'FIXED', length: 10 },
    77: { type: 'FIXED', length: 10 },
    78: { type: 'FIXED', length: 10 },
    79: { type: 'FIXED', length: 10 },
    80: { type: 'FIXED', length: 10 },
    81: { type: 'FIXED', length: 10 },
    82: { type: 'FIXED', length: 12 },
    83: { type: 'FIXED', length: 12 },
    84: { type: 'FIXED', length: 12 },
    85: { type: 'FIXED', length: 12 },
    86: { type: 'FIXED', length: 16 },
    87: { type: 'FIXED', length: 16 },
    88: { type: 'FIXED', length: 16 },
    89: { type: 'FIXED', length: 16 },
    90: { type: 'FIXED', length: 42 },
    91: { type: 'FIXED', length: 1 },
    92: { type: 'FIXED', length: 2 },
    93: { type: 'FIXED', length: 5 },
    94: { type: 'FIXED', length: 7 },
    95: { type: 'FIXED', length: 42 },
    96: { type: 'FIXED', length: 8 },
    97: { type: 'FIXED', length: 16 },
    98: { type: 'FIXED', length: 25 },
    99: { type: 'LLVAR', length: 11 },
    100: { type: 'LLVAR', length: 11 },
    101: { type: 'LLVAR', length: 17 },
    102: { type: 'LLVAR', length: 28 },
    103: { type: 'LLVAR', length: 28 },
    104: { type: 'LLLVAR', length: 100 },
    105: { type: 'LLLVAR', length: 999 },
    106: { type: 'LLLVAR', length: 999 },
    107: { type: 'LLLVAR', length: 999 },
    108: { type: 'LLLVAR', length: 999 },
    109: { type: 'LLLVAR', length: 999 },
    110: { type: 'LLLVAR', length: 999 },
    111: { type: 'LLLVAR', length: 999 },
    112: { type: 'LLLVAR', length: 999 },
    113: { type: 'LLLVAR', length: 999 },
    114: { type: 'LLLVAR', length: 999 },
    115: { type: 'LLLVAR', length: 999 },
    116: { type: 'LLLVAR', length: 999 },
    117: { type: 'LLLVAR', length: 999 },
    118: { type: 'LLLVAR', length: 999 },
    119: { type: 'LLLVAR', length: 999 },
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
// Complete Field Names Registry for ISO 8583 Data Elements 1 to 128
export const ISO8583_FIELD_NAMES = {
    1: "Secondary Bitmap Indicator",
    2: "Primary Account Number (PAN)",
    3: "Processing Code",
    4: "Amount, Transaction",
    5: "Amount, Settlement",
    6: "Amount, Cardholder Billing",
    7: "Transmission Date & Time",
    8: "Amount, Cardholder Billing Fee",
    9: "Conversion Rate, Settlement",
    10: "Conversion Rate, Cardholder Billing",
    11: "System Trace Audit Number (STAN)",
    12: "Local Transaction Time (hhmmss)",
    13: "Local Transaction Date (MMDD)",
    14: "Expiration Date (YYMM)",
    15: "Settlement Date",
    16: "Conversion Date",
    17: "Capture Date",
    18: "Merchant Category Code (MCC)",
    19: "Acquiring Institution Country Code",
    20: "PAN Extended Country Code",
    21: "Forwarding Institution Country Code",
    22: "Point of Service (POS) Entry Mode",
    23: "Card Sequence Number",
    24: "Network International Identifier (NII)",
    25: "POS Condition Code",
    26: "POS Capture Code",
    27: "Authorization ID Response Length",
    28: "Amount, Transaction Fee",
    29: "Amount, Settlement Fee",
    30: "Amount, Transaction Processing Fee",
    31: "Amount, Settlement Processing Fee",
    32: "Acquiring Institution ID Code",
    33: "Forwarding Institution ID Code",
    34: "Primary Account Number, Extended",
    35: "Track 2 Data",
    36: "Track 3 Data",
    37: "Retrieval Reference Number (RRN)",
    38: "Authorization ID Response",
    39: "Response Code",
    40: "Service Restriction Code",
    41: "Card Acceptor Terminal ID",
    42: "Card Acceptor ID Code",
    43: "Card Acceptor Name / Location",
    44: "Additional Response Data",
    45: "Track 1 Data",
    46: "Additional Data - ISO",
    47: "Additional Data - National",
    48: "Additional Data - Private",
    49: "Currency Code, Transaction",
    50: "Currency Code, Settlement",
    51: "Currency Code, Cardholder Billing",
    52: "Personal ID Number (PIN) Data",
    53: "Security Related Control Information",
    54: "Additional Amounts",
    55: "ICC Data - EMV Tags",
    56: "Original Data Elements",
    57: "Reserved National",
    58: "Reserved National",
    59: "Reserved National",
    60: "Private Use - Self-Defined",
    61: "Private Use - Self-Defined",
    62: "Private Use - Self-Defined",
    63: "Private Use - Self-Defined",
    64: "Message Authentication Code (MAC)",
    65: "Bit Map, Tertiary",
    66: "Settlement Code",
    67: "Extended Payment Code",
    68: "Receiving Institution Country Code",
    69: "Settlement Institution Country Code",
    70: "Network Management Information Code",
    71: "Message Number",
    72: "Message Number Last",
    73: "Action Date",
    74: "Credits Number",
    75: "Credits Reversal Number",
    76: "Debits Number",
    77: "Debits Reversal Number",
    78: "Transfer Number",
    79: "Transfer Reversal Number",
    80: "Inquiries Number",
    81: "Authorizations Number",
    82: "Credits Processing Fee Amount",
    83: "Credits Transaction Fee Amount",
    84: "Debits Processing Fee Amount",
    85: "Debits Transaction Fee Amount",
    86: "Credits Amount",
    87: "Credits Reversal Amount",
    88: "Debits Amount",
    89: "Debits Reversal Amount",
    90: "Original Data Elements",
    91: "File Update Code",
    92: "File Security Code",
    93: "Response Indicator",
    94: "Service Indicator",
    95: "Replacement Amounts",
    96: "Message Security Code",
    97: "Net Settlement Amount",
    98: "Payee",
    99: "Settlement Institution ID Code",
    100: "Receiving Institution ID Code",
    101: "File Name",
    102: "Account Identification 1",
    103: "Account Identification 2",
    104: "Transaction Description",
    105: "Reserved ISO",
    106: "Reserved ISO",
    107: "Reserved ISO",
    108: "Reserved ISO",
    109: "Reserved ISO",
    110: "Reserved ISO",
    111: "Reserved Private",
    112: "Reserved Private",
    113: "Reserved Private",
    114: "Reserved Private",
    115: "Reserved Private",
    116: "Reserved Private",
    117: "Reserved Private",
    118: "Reserved Private",
    119: "Reserved Private",
    120: "Reserved Private",
    121: "Reserved Private",
    122: "Reserved Private",
    123: "Reserved Private",
    124: "Reserved Private",
    125: "Reserved Private",
    126: "Reserved Private",
    127: "Reserved Private",
    128: "Secondary MAC"
};
export const ISO8583_RESPONSE_CODES = {
    "00": "Approved / Successful",
    "01": "Refer to Card Issuer",
    "02": "Refer to Card Issuer (Special Condition)",
    "03": "Invalid Merchant",
    "04": "Pick-up Card",
    "05": "Do Not Honor",
    "06": "Error / General Failure",
    "07": "Pick-up Card (Special Condition)",
    "08": "Honor with Identification",
    "12": "Invalid Transaction",
    "13": "Invalid Amount",
    "14": "Invalid Card Number (No Such Number)",
    "15": "No Such Issuer",
    "30": "Format Error",
    "41": "Lost Card (Pick Up)",
    "43": "Stolen Card (Pick Up)",
    "51": "Insufficient Funds",
    "54": "Expired Card",
    "55": "Incorrect Personal Identification Number (PIN)",
    "57": "Transaction Not Permitted to Cardholder",
    "58": "Transaction Not Permitted to Terminal",
    "61": "Exceeds Withdrawal Amount Limit",
    "62": "Restricted Card",
    "65": "Exceeds Withdrawal Frequency Limit",
    "91": "Issuer or Switch Unavailable",
    "96": "System Malfunction / Processing Error"
};
export function decodeMTI(mti) {
    if (mti.length !== 4) {
        return { version: "Unknown", class: "Unknown", function: "Unknown", originator: "Unknown", fullDesc: "Invalid MTI Length" };
    }
    const versions = {
        "0": "ISO 8583-1:1987",
        "1": "ISO 8583-2:1993",
        "2": "ISO 8583-1:2003",
        "9": "Private / Proprietary"
    };
    const classes = {
        "1": "Authorization",
        "2": "Financial Transaction",
        "3": "File Actions",
        "4": "Reversal / Chargeback",
        "5": "Reconciliation",
        "6": "Administrative",
        "7": "Fee Collection",
        "8": "Network Management"
    };
    const functions = {
        "0": "Request",
        "1": "Response",
        "2": "Advice",
        "3": "Advice Response",
        "4": "Notification",
        "5": "Notification Ack"
    };
    const originators = {
        "0": "Acquirer",
        "1": "Acquirer Repeat",
        "2": "Card Issuer",
        "3": "Card Issuer Repeat",
        "4": "Other"
    };
    const v = versions[mti[0]] || `Version ${mti[0]}`;
    const c = classes[mti[1]] || `Class ${mti[1]}`;
    const f = functions[mti[2]] || `Function ${mti[2]}`;
    const o = originators[mti[3]] || `Originator ${mti[3]}`;
    return {
        version: v,
        class: c,
        function: f,
        originator: o,
        fullDesc: `${v} ${c} ${f} (${o})`
    };
}
export function decodeProcessingCode(code) {
    if (code.length !== 6)
        return null;
    const txnType = code.substring(0, 2);
    const fromAcc = code.substring(2, 4);
    const toAcc = code.substring(4, 6);
    const txnNames = {
        "00": "Goods / Services Purchase",
        "01": "Cash Advance / ATM Withdrawal",
        "09": "Purchase with Cashback",
        "20": "Refund / Return Credit",
        "30": "Balance Inquiry",
        "31": "Account Details Inquiry",
        "40": "Account Transfer"
    };
    const accNames = {
        "00": "Default",
        "10": "Savings Account",
        "20": "Checking Account",
        "30": "Credit Account"
    };
    const tName = txnNames[txnType] || `Txn Type ${txnType}`;
    const fName = accNames[fromAcc] || `From ${fromAcc}`;
    const tAccName = accNames[toAcc] || `To ${toAcc}`;
    return `${tName} (From: ${fName}, To: ${tAccName})`;
}
export function parseIso8583(msgInput) {
    const cleaned = msgInput.replace(/\s/g, "");
    if (cleaned.length < 20) {
        throw new Error("Input string too short for valid ISO 8583 MTI + Bitmap (min 20 chars)");
    }
    // MTI: First 4 characters
    const mti = cleaned.substring(0, 4);
    // Bitmap: Next 16 chars (or 32 if secondary bit set)
    let bmapHex = cleaned.substring(4, 20);
    const firstByte = parseInt(bmapHex.substring(0, 2), 16);
    if (firstByte & 0x80) { // Field 1 bit set -> 32 hex chars bitmap
        if (cleaned.length < 36) {
            throw new Error("Payload contains secondary bitmap indicator but is missing full 32-character hex bitmap");
        }
        bmapHex = cleaned.substring(4, 36);
    }
    // Remaining payload parse
    const payload = cleaned.substring(4 + bmapHex.length);
    const parsedFields = [];
    // Extract present field numbers from bitmap
    const bytes = [];
    for (let i = 0; i < bmapHex.length; i += 2) {
        bytes.push(parseInt(bmapHex.substring(i, i + 2), 16));
    }
    const presentFields = [];
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
        const def = ISO8583_DEFS[fieldNum] || { type: 'LLLVAR', length: 999 };
        const name = ISO8583_FIELD_NAMES[fieldNum] || `Field ${fieldNum}`;
        let val = "";
        if (def.type === 'FIXED') {
            if (offset + def.length > payload.length) {
                throw new Error(`Unexpected end of data at Field ${fieldNum} (expected ${def.length} chars, remaining: ${payload.length - offset})`);
            }
            val = payload.substring(offset, offset + def.length);
            offset += def.length;
        }
        else if (def.type === 'LLVAR') {
            if (offset + 2 > payload.length)
                throw new Error(`Unexpected end of data at Field ${fieldNum} length indicator`);
            const lenStr = payload.substring(offset, offset + 2);
            const len = parseInt(lenStr, 10);
            if (isNaN(len))
                throw new Error(`Invalid LLVAR length '${lenStr}' at Field ${fieldNum}`);
            offset += 2;
            if (offset + len > payload.length)
                throw new Error(`Unexpected end of data at Field ${fieldNum} content (expected ${len} chars, remaining: ${payload.length - offset})`);
            val = payload.substring(offset, offset + len);
            offset += len;
        }
        else if (def.type === 'LLLVAR') {
            if (offset + 3 > payload.length)
                throw new Error(`Unexpected end of data at Field ${fieldNum} length indicator`);
            const lenStr = payload.substring(offset, offset + 3);
            const len = parseInt(lenStr, 10);
            if (isNaN(len))
                throw new Error(`Invalid LLLVAR length '${lenStr}' at Field ${fieldNum}`);
            offset += 3;
            if (offset + len > payload.length)
                throw new Error(`Unexpected end of data at Field ${fieldNum} content (expected ${len} chars, remaining: ${payload.length - offset})`);
            val = payload.substring(offset, offset + len);
            offset += len;
        }
        // Add extra contextual information for special fields
        let decodedInfo = undefined;
        if (fieldNum === 3) {
            decodedInfo = decodeProcessingCode(val) || undefined;
        }
        else if (fieldNum === 39) {
            decodedInfo = ISO8583_RESPONSE_CODES[val] ? `Response: ${ISO8583_RESPONSE_CODES[val]}` : undefined;
        }
        else if (fieldNum === 4 && val.length === 12 && /^\d+$/.test(val)) {
            const amt = (parseInt(val, 10) / 100).toFixed(2);
            decodedInfo = `Formatted Amount: ${amt}`;
        }
        parsedFields.push({
            field: fieldNum,
            name,
            value: val,
            type: def.type,
            decodedInfo
        });
    }
    return { mti, bitmapHex: bmapHex, fields: parsedFields, rawRemaining: payload.substring(offset) };
}
