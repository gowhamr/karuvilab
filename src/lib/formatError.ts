export function formatError(error: unknown): string {
  // Generic safe fallback
  const fallbackMessage = "An unexpected error occurred. Please try again.";

  if (!error) return fallbackMessage;

  // Handle standard JS Errors
  if (error instanceof Error) {
    // Suppress raw stack traces or obscure technical messages
    if (error.message.includes("Unexpected token") || error.message.includes("JSON at position")) {
      return "The provided input is not a valid format. Please check your data.";
    }
    
    if (error.message.includes("Failed to fetch") || error.name === "NetworkError") {
      return "Network connection issue. Please check your internet connection.";
    }

    if (error.name === "AbortError") {
      return "The operation was cancelled.";
    }

    if (error.message.includes("memory") || error.message.includes("quota")) {
      return "The file is too large to process. Please try a smaller file.";
    }

    // Default to the error message if it seems relatively human-readable, 
    // otherwise fallback. We assume custom errors thrown in our logic are friendly.
    return error.message || fallbackMessage;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle standard response formats (e.g. from fetch APIs)
  if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string") {
    return (error as any).message;
  }

  return fallbackMessage;
}
