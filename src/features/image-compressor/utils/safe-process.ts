/**
 * Utility for safe processing of image worker tasks.
 * Prevents raw exceptions from reaching the UI and provides consistent error reporting.
 */

export interface ProcessResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Wraps an async image processing operation in a safety boundary.
 */
export async function safeImageProcess<T>(
  operation: () => Promise<T>,
  context: string = 'image-processing'
): Promise<ProcessResult<T>> {
  try {
    const data = await operation();
    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error(`[${context}] Runtime failure:`, err);
    
    // Normalize error message
    let message = "The tool encountered an unexpected error while processing.";
    let code = "UNKNOWN_ERROR";

    if (err.message) {
      if (err.message.includes("cancelled") || err.message.includes("aborted")) {
        code = "CANCELLED";
        message = "Operation was cancelled.";
      } else if (err.message.includes("memory") || err.message.includes("allocation")) {
        code = "MEMORY_EXHAUSTION";
        message = "The image is too large to process on this device.";
      } else if (err.message.includes("format") || err.message.includes("MIME")) {
        code = "INVALID_FORMAT";
        message = "The image format is invalid or corrupted.";
      } else {
        code = "RUNTIME_EXCEPTION";
        message = err.message;
      }
    }

    return {
      success: false,
      error: {
        code,
        message,
        details: err,
      },
    };
  }
}
