import { type Monaco } from '@monaco-editor/react';
import { apiHeadersSchema, apiRequestSchema } from './api.schemas';

// Example generic schema, but can be loaded dynamically or explicitly passed
const genericSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The name of the entity"
    },
    version: {
      type: "number",
      description: "Version identifier"
    }
  }
};

export function configureJsonLanguageService(monacoInstance: Monaco) {
  // Configure default JSON diagnostics (validation, formatting, schema support)
  monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: "kv://schemas/json/generic.json",
        fileMatch: ["kv://json/*.json"],
        schema: genericSchema,
      },
      {
        uri: "kv://schemas/json/api-headers.json",
        fileMatch: ["kv://api/request-headers.json"],
        schema: apiHeadersSchema,
      },
      {
        uri: "kv://schemas/json/api-request.json",
        fileMatch: ["kv://api/request-body.json", "kv://api/response.json"],
        schema: apiRequestSchema,
      }
    ]
  });
}
