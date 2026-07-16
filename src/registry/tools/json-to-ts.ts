import { ToolEntry } from '../types';

export const jsonToTs: ToolEntry = {
  id: "json-to-ts",
  name: "JSON to TypeScript",
  desc: "Generate TypeScript interfaces from JSON",
  href: "developer-tools/json-to-ts/",
  category: "developer",
  "subCategory": "Converters",
  input: "json",
  output: "code",
  keywords: ["json", "typescript", "ts", "interface", "types", "generator", "converter"],
  sampleAssetKey: "jsonToTs",
  popular: false,
  difficulty: "beginner",
  searchIntent: "informational",
  priority: 0.8,
  icon: "",
  related: ["json-formatter", "base64"],
  status: "stable",
  schemaType: "SoftwareApplication",
  lastUpdated: "2026-07-14"
};
