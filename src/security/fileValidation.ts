// src/security/fileValidation.ts

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Map of common file extensions to their valid Magic Bytes (hex signatures)
const MAGIC_NUMBERS: Record<string, string[]> = {
  png:  ["89504e47"],
  jpg:  ["ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"],
  jpeg: ["ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"],
  gif:  ["47494638"],
  pdf:  ["25504446"],
  zip:  ["504b0304"], // Zip format (standard for docx/xlsx as well)
};

/**
 * Validates file extension against allowed list.
 */
export function validateExtension(fileName: string, allowedExtensions: string[]): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext ? allowedExtensions.map(e => e.toLowerCase()).includes(ext) : false;
}

/**
 * Validates file size.
 */
export function validateFileSize(fileSize: number, maxMB: number): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return fileSize <= maxBytes;
}

/**
 * Verifies magic bytes of a file against known signatures to prevent MIME spoofing.
 */
export async function verifyMagicBytes(file: File): Promise<boolean> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !MAGIC_NUMBERS[ext]) {
    // If we don't have a signature rule for this type, pass it but warn
    return true; 
  }

  const expectedSignatures = MAGIC_NUMBERS[ext]!;
  
  // Read first 4 bytes of the file
  const blob = file.slice(0, 4);
  const buffer = await blob.arrayBuffer();
  const arr = new Uint8Array(buffer);
  
  let header = "";
  for (let i = 0; i < arr.length; i++) {
    header += arr[i]!.toString(16).padStart(2, "0");
  }

  // Check if header matches any signature
  return expectedSignatures.some((sig) => header.startsWith(sig));
}

/**
 * Comprehensive client-side file pre-processing validation.
 */
export async function validateImportedFile(
  file: File,
  allowedExtensions: string[],
  maxMB: number
): Promise<FileValidationResult> {
  // 1. Validate size
  if (!validateFileSize(file.size, maxMB)) {
    return { valid: false, error: `File exceeds maximum size of ${maxMB}MB` };
  }

  // 2. Validate extension
  if (!validateExtension(file.name, allowedExtensions)) {
    return { valid: false, error: `Invalid file extension. Allowed: ${allowedExtensions.join(", ")}` };
  }

  // 3. Verify magic bytes to counter spoofing
  try {
    const verified = await verifyMagicBytes(file);
    if (!verified) {
      return { valid: false, error: `Security check failed: File header does not match extension ${file.name}.` };
    }
  } catch (err) {
    return { valid: false, error: `Security error: Unable to read file header signatures.` };
  }

  return { valid: true };
}
