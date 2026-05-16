export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const validateFile = (file: File, options: FileValidationOptions): { valid: boolean; error?: string } => {
  if (options.maxSizeMB) {
    const maxBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, error: `File exceeds maximum size of ${options.maxSizeMB}MB` };
    }
  }

  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const isAllowed = options.allowedTypes.some(type => 
      file.type === type || 
      (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '')))
    );
    
    if (!isAllowed) {
      return { valid: false, error: `Invalid file type. Allowed: ${options.allowedTypes.join(', ')}` };
    }
  }

  return { valid: true };
};
