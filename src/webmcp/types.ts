export interface ToolContract<TInput = any, TOutput = any> {
  name: string;
  description: string;
  /**
   * JSON Schema for the tool's input
   */
  schema: Record<string, any>;
  /**
   * The pure execution function mapping input to deterministic output.
   * Supports AbortSignal for cancellation.
   */
  execute: (input: TInput, signal?: AbortSignal) => Promise<TOutput> | TOutput;
}
