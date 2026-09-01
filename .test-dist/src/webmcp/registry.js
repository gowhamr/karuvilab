class WebMCPRegistry {
    tools = new Map();
    /**
     * Registers a tool contract both internally and with the browser's Model Context Protocol (if available).
     */
    register(contract) {
        if (this.tools.has(contract.name)) {
            console.warn(`[WebMCP] Tool ${contract.name} is already registered.`);
            return;
        }
        this.tools.set(contract.name, contract);
        // Progressive enhancement: Register with browser if supported
        if (typeof document !== 'undefined' && document.modelContext && typeof document.modelContext.registerTool === 'function') {
            try {
                document.modelContext.registerTool({
                    name: contract.name,
                    description: contract.description,
                    schema: contract.schema,
                    readOnlyHint: true, // Calculators are pure, read-only tools
                    execute: async (input, { signal } = {}) => {
                        return await contract.execute(input, signal);
                    }
                });
                console.info(`[WebMCP] Registered tool with browser: ${contract.name}`);
            }
            catch (error) {
                console.error(`[WebMCP] Failed to register tool ${contract.name}:`, error);
            }
        }
    }
    /**
     * Returns all internally registered tools.
     */
    getTools() {
        return Array.from(this.tools.values());
    }
}
export const webmcpRegistry = new WebMCPRegistry();
