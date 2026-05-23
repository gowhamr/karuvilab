export type Language = "json" | "html" | "css" | "sql" | "markdown" | "xml" | "javascript" | "typescript";

export function formatJSON(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch (e) {
    return code;
  }
}

export function formatHTML(html: string): string {
  let indent = 0;
  const voids = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  return html
    .replace(/>\s+</g, "><")
    .replace(/(<\/?[^>]+>)/g, "\n$1\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      if (/^<\//.test(line)) { indent = Math.max(0, indent - 1); }
      const out = "  ".repeat(indent) + line;
      const tag = line.match(/^<([a-zA-Z]+)/)?.[1]?.toLowerCase() ?? "";
      if (/^<[^/]/.test(line) && !/\/>$/.test(line) && !voids.has(tag)) { indent++; }
      return out;
    })
    .join("\n");
}

export function formatXML(xml: string): string {
  // XML formatting is very similar to HTML but without voids
  let indent = 0;
  return xml
    .replace(/>\s+</g, "><")
    .replace(/(<\/?[^>]+>)/g, "\n$1\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      if (/^<\//.test(line)) { indent = Math.max(0, indent - 1); }
      const out = "  ".repeat(indent) + line;
      if (/^<[^/]/.test(line) && !/\/>$/.test(line) && !/<\/[^>]+>$/.test(line)) { 
        indent++; 
      }
      return out;
    })
    .join("\n");
}

export function formatCSS(css: string): string {
  return css
    .replace(/\s*\{\s*/g, " {\n  ")
    .replace(/\s*;\s*/g, ";\n  ")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/  \n}/g, "\n}")
    .replace(/,\s*/g, ",\n")
    .split("\n")
    .map(l => l.trimEnd())
    .filter(l => l.trim() !== "")
    .join("\n");
}

export function formatSQL(sql: string): string {
  const keywords = ["SELECT","FROM","WHERE","AND","OR","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE","CREATE TABLE","DROP TABLE","ALTER TABLE","ON","AS"];
  let result = sql.replace(/\s+/g, " ").trim();
  keywords.forEach(kw => {
    result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw}`);
  });
  return result.trim().split("\n").map(l => l.trim()).filter(Boolean).join("\n");
}

export function formatMarkdown(md: string): string {
  return md
    .split("\n")
    .map(l => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function beautify(content: string, language: string): string {
  switch (language.toLowerCase()) {
    case 'json':
      return formatJSON(content);
    case 'html':
      return formatHTML(content);
    case 'xml':
      return formatXML(content);
    case 'css':
      return formatCSS(content);
    case 'sql':
      return formatSQL(content);
    case 'markdown':
      return formatMarkdown(content);
    default:
      return content;
  }
}
