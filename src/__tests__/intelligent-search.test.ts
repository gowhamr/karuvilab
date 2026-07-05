import { describe, it, expect } from "vitest";
import { searchTools } from "../lib/search/searchEngine";
import { detectContentToolSuggestion } from "../lib/search/intelligentDetector";

describe("KaruviLab Intelligent Search QA Specification Audit", () => {
  describe("P0 - Search Accuracy & Keyword Test Matrix", () => {
    const testCases = [
      { input: "json", expectedIds: ["json-formatter", "json-csv"] },
      { input: "Json", expectedIds: ["json-formatter", "json-csv"] },
      { input: "jso", expectedIds: ["json-formatter", "json-csv"] },
      { input: "jsson", expectedIds: ["json-formatter", "json-csv", "yaml-json-converter"] },
      { input: "sha", expectedIds: ["hash-generator"] },
      { input: "md5", expectedIds: ["hash-generator", "data-calculator"] },
      { input: "rsa", expectedIds: ["rsa-key-generator"] },
      { input: "qr", expectedIds: ["qrcode", "wifi-qr-code"] },
      { input: "iban", expectedIds: ["iban-validator"] },
      { input: "bitmap", expectedIds: ["iso8583-bitmap-decoder"] },
      { input: "tlv", expectedIds: ["tlv-parser"] },
      { input: "regex", expectedIds: ["regex-tester"] },
      { input: "yaml", expectedIds: ["yaml-json-converter", "yaml-validator"] },
      { input: "xml", expectedIds: ["xml-formatter"] },
    ];

    testCases.forEach(({ input, expectedIds }) => {
      it(`should return expected tool for query '${input}'`, () => {
        const results = searchTools(input);
        expect(results.length).toBeGreaterThan(0);
        const topResult = results[0]?.tool;
        expect(expectedIds).toContain(topResult?.id);
      });
    });
  });

  describe("P1 - Intelligent Content & Paste Pattern Detection", () => {
    it("detects JWT tokens", () => {
      const suggestion = detectContentToolSuggestion("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.sig");
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("jwt-decoder");
    });

    it("detects JSON payloads", () => {
      const suggestion = detectContentToolSuggestion('{"name":"KV","version":"2.1"}');
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("json-formatter");
    });

    it("detects ISO 8583 payment messages", () => {
      const suggestion = detectContentToolSuggestion("0200722464010880000016411111111111111111000000000010");
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("iso8583-message-parser");
    });

    it("detects X.509 PEM certificates", () => {
      const suggestion = detectContentToolSuggestion("-----BEGIN CERTIFICATE-----\nMIIF...");
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("x509-viewer");
    });

    it("detects SQL queries", () => {
      const suggestion = detectContentToolSuggestion("SELECT * FROM users WHERE status = 'active'");
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("sql-formatter");
    });

    it("detects YAML configuration files", () => {
      const suggestion = detectContentToolSuggestion("apiVersion: apps/v1\nkind: Deployment");
      expect(suggestion).not.toBeNull();
      expect(suggestion?.toolId).toBe("yaml-json-converter");
    });
  });
});
