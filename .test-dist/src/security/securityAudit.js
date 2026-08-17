// src/security/securityAudit.ts
import * as fs from "fs";
import * as path from "path";
const FORBIDDEN_PATTERNS = [
    {
        regex: /\beval\s*\(/g,
        severity: "high",
        description: "Forbidden use of eval() which exposes the application to remote code execution (RCE).",
    },
    {
        regex: /\bnew\s+Function\s*\(/g,
        severity: "high",
        description: "Forbidden use of Function constructor which compiles strings into executable javascript.",
    },
    {
        regex: /dangerouslySetInnerHTML/g,
        severity: "medium",
        description: "Use of dangerouslySetInnerHTML detected. Ensure dompurify wraps this node.",
    },
    {
        regex: /localStorage\.(getItem|setItem)/g,
        severity: "low",
        description: "Direct access to localStorage. Prefer using secureStorage to ensure namespace safety.",
    }
];
/**
 * Scans directories recursively for security violations.
 */
export function runSecurityAudit(dirToScan, fileExtensions = [".ts", ".tsx", ".js", ".jsx"]) {
    const issues = [];
    function scanDirectory(currentDir) {
        // Skip build folders and node modules
        const baseName = path.basename(currentDir);
        if (baseName === "node_modules" || baseName === ".next" || baseName === "dist" || baseName === ".git") {
            return;
        }
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            }
            else if (fileExtensions.includes(path.extname(fullPath))) {
                auditFile(fullPath);
            }
        }
    }
    function auditFile(filePath) {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");
        lines.forEach((lineText, index) => {
            FORBIDDEN_PATTERNS.forEach((pattern) => {
                // Reset regex index
                pattern.regex.lastIndex = 0;
                if (pattern.regex.test(lineText)) {
                    issues.push({
                        filePath: path.relative(process.cwd(), filePath),
                        line: index + 1,
                        pattern: pattern.regex.source,
                        severity: pattern.severity,
                        description: pattern.description,
                    });
                }
            });
        });
    }
    scanDirectory(dirToScan);
    return issues;
}
