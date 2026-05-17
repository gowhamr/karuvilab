/**
 * FIX-1: Worker exception safety boundary.
 * Every worker call in the image compressor feature goes through this.
 */

export interface ProcessResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function safeProcessor<T>(
  operation: () => Promise<T>,
  context: string = 'image-compressor'
): Promise<ProcessResult<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (err: any) {
    console.error(`[${context}] Critical failure:`, err);
    
    let message = "An unexpected error occurred.";
    if (err.message) {
      if (err.message.includes("cancelled") || err.message.includes("aborted")) {
        message = "Operation was cancelled.";
      } else if (err.message.includes("memory") || err.message.includes("allocation")) {
        message = "Image is too large for this device's memory.";
      } else if (err.message.includes("format") || err.message.includes("MIME")) {
        message = "Unsupported or corrupted image format.";
      } else {
        message = err.message;
      }
    }
    
    return { success: false, error: message };
  }
}

/**
 * Backward compatibility alias for safeProcessor.
 */
export const safeImageProcess = safeProcessor;
