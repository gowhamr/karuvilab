const encoder = new TextEncoder();
const decoder = new TextDecoder();

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptData(data: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Import the password as a raw key
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  // Derive the AES key
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 600000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  
  // Encrypt the content
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    encoder.encode(data)
  );
  
  const payload = {
    v: 1,
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(encrypted)
  };
  
  return "KVSECURE:" + window.btoa(JSON.stringify(payload));
}

export async function decryptData(encryptedString: string, password: string): Promise<string> {
  if (!encryptedString.startsWith("KVSECURE:")) {
    throw new Error("Invalid secure note format. Must start with 'KVSECURE:'");
  }
  
  const base64Payload = encryptedString.substring("KVSECURE:".length);
  let payload;
  try {
    payload = JSON.parse(window.atob(base64Payload));
  } catch (e) {
    throw new Error("Failed to parse secure note payload. Make sure you copied the entire code.");
  }
  
  if (payload.v !== 1) {
    throw new Error("Unsupported secure note version.");
  }
  
  const salt = base64ToArrayBuffer(payload.salt);
  const iv = base64ToArrayBuffer(payload.iv);
  const ciphertext = base64ToArrayBuffer(payload.ciphertext);
  
  // Import the password
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  // Derive the AES key
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 600000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  
  // Decrypt the content
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv)
    },
    aesKey,
    ciphertext
  );
  
  return decoder.decode(decrypted);
}
