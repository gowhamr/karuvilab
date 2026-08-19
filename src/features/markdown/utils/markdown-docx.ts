import { marked } from "marked";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

function parseInlineTokens(tokens: any[]): TextRun[] {
  const runs: TextRun[] = [];
  if (!tokens) return runs;

  for (const token of tokens) {
    if (token.type === "text") {
      runs.push(new TextRun({ text: token.text }));
    } else if (token.type === "strong") {
      runs.push(new TextRun({ text: token.text, bold: true }));
    } else if (token.type === "em") {
      runs.push(new TextRun({ text: token.text, italics: true }));
    } else if (token.type === "del") {
      runs.push(new TextRun({ text: token.text, strike: true }));
    } else if (token.type === "codespan") {
      runs.push(
        new TextRun({
          text: token.text,
          font: "Consolas",
          color: "D97706",
          shading: { fill: "F3F4F6" },
        })
      );
    } else if (token.type === "link") {
      runs.push(
        new TextRun({
          text: token.text || token.href,
          color: "2563EB",
          underline: {},
        })
      );
    } else if (token.type === "image") {
      runs.push(new TextRun({ text: `[Image: ${token.text || token.href}]`, italics: true }));
    } else if (token.text) {
      runs.push(new TextRun({ text: token.text }));
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text: "" }));
  }

  return runs;
}

export function convertMarkdownToDocx(markdown: string, title: string = "Document"): Document {
  const tokens = marked.lexer(markdown);
  const children: (Paragraph | Table)[] = [];

  const headingLevelMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };

  for (const token of tokens) {
    if (token.type === "heading") {
      children.push(
        new Paragraph({
          heading: headingLevelMap[token.depth] || HeadingLevel.HEADING_1,
          children: parseInlineTokens(token.tokens || [{ type: "text", text: token.text }]),
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (token.type === "paragraph") {
      children.push(
        new Paragraph({
          children: parseInlineTokens(token.tokens || [{ type: "text", text: token.text }]),
          spacing: { after: 160 },
        })
      );
    } else if (token.type === "list") {
      token.items.forEach((item: any, idx: number) => {
        const prefix = token.ordered ? `${idx + 1}. ` : "";
        const itemRuns = parseInlineTokens(item.tokens || [{ type: "text", text: item.text }]);
        if (prefix) {
          itemRuns.unshift(new TextRun({ text: prefix, bold: true }));
        }
        const paragraphOpts: {
          children: TextRun[];
          spacing: { after: number };
          bullet?: { level: number };
        } = {
          children: itemRuns,
          spacing: { after: 80 },
        };
        if (!token.ordered) {
          paragraphOpts.bullet = { level: 0 };
        }
        children.push(new Paragraph(paragraphOpts));
      });
    } else if (token.type === "code") {
      const codeLines = token.text.split("\n");
      for (const line of codeLines) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line || " ",
                font: "Consolas",
                size: 20,
              }),
            ],
            shading: { fill: "F8FAFC" },
            spacing: { after: 40 },
          })
        );
      }
    } else if (token.type === "blockquote") {
      const bqTokens = token.tokens || [{ type: "text", text: token.text }];
      children.push(
        new Paragraph({
          children: parseInlineTokens(bqTokens),
          indent: { left: 720 },
          spacing: { before: 100, after: 160 },
        })
      );
    } else if (token.type === "table") {
      const headerRow = new TableRow({
        children: token.header.map((cell: any) =>
          new TableCell({
            children: [
              new Paragraph({
                children: parseInlineTokens(
                  cell.tokens || [{ type: "text", text: cell.text, bold: true }]
                ),
              }),
            ],
            shading: { fill: "F1F5F9" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
            },
          })
        ),
      });

      const tableRows = [headerRow];
      for (const row of token.rows) {
        tableRows.push(
          new TableRow({
            children: row.map((cell: any) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: parseInlineTokens(cell.tokens || [{ type: "text", text: cell.text }]),
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                  right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                },
              })
            ),
          })
        );
      }

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    } else if (token.type === "hr") {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "────────────────────────────────────────", color: "CBD5E1" })],
          spacing: { before: 160, after: 160 },
        })
      );
    }
  }

  if (children.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  return new Document({
    title,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}
