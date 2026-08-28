type WebMCPToolInputSchema = {
  type: "object";
  additionalProperties?: boolean;
  properties?: Record<string, unknown>;
  required?: ReadonlyArray<string>;
};

interface WebMCPToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

interface WebMCPTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: WebMCPToolInputSchema;
  annotations?: WebMCPToolAnnotations;
  execute: (inputObject: unknown, options: { signal: AbortSignal }) => unknown | Promise<unknown>;
}

interface WebMCPModelContext {
  registerTool: (tool: WebMCPTool, options?: { signal?: AbortSignal }) => Promise<void>;
  getTools?: () => Promise<unknown[]>;
  executeTool?: (tool: unknown, inputArguments: string, options?: { signal?: AbortSignal }) => Promise<unknown>;
}

interface Document {
  /**
   * Experimental WebMCP page API. Standard DOM typings do not include this yet.
   */
  modelContext?: WebMCPModelContext;
}
