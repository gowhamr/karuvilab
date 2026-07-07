import * as Comlink from "comlink";
import { DiffLine } from "./types";

const api = {
  async mergePdfs(files: (Blob | ArrayBuffer)[], onProgress: any) {
    const totalSize = files.reduce((acc, f) => acc + (f instanceof ArrayBuffer ? f.byteLength : f.size), 0);
    if (totalSize > 250 * 1024 * 1024) { 
      throw new Error("Total PDF size too large (max 250MB)");
    }
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    const total = files.length;
    
    for (let i = 0; i < total; i++) {
      const file = files[i]!;
      if (onProgress) onProgress({ percent: (i / total) * 80, message: `Merging PDF ${i + 1}/${total}` });
      
      const bytes = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
      (doc as any) = null;
    }
    
    if (onProgress) onProgress({ percent: 90, message: "Saving merged PDF..." });
    const result = await merged.save();
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  
  async extractImagesFromPdf(file: any, onProgress: any) {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof (pdfjsLib as any).GlobalWorkerOptions !== 'undefined') {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    const extracted: Array<{ arrayBuffer: ArrayBuffer; width: number; height: number; page: number; index: number }> = [];
    let imgIndex = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      if (onProgress) {
        onProgress({ percent: (pageNum / pdf.numPages) * 100, message: `Scanning page ${pageNum} of ${pdf.numPages}…` });
      }
      const page = await pdf.getPage(pageNum);
      const ops = await page.getOperatorList();
      const fns = ops.fnArray;
      const args = ops.argsArray;

      for (let i = 0; i < fns.length; i++) {
        const OPS = (pdfjsLib as any).OPS;
        if (fns[i] === OPS.paintImageXObject || fns[i] === OPS.paintImageXObjectRepeat) {
          const imgName = args[i][0];
          try {
            const imgData = await new Promise<any>((res, rej) => {
              page.objs.get(imgName, (img: any) => img ? res(img) : rej(new Error("not found")));
            });

            const canvas = new OffscreenCanvas(imgData.width, imgData.height);
            const ctx = canvas.getContext("2d")!;
            const imageData = ctx.createImageData(imgData.width, imgData.height);

            if (imgData.data && imgData.data.length) {
              const src = imgData.data;
              const dst = imageData.data;
              if (src.length === imgData.width * imgData.height * 3) {
                for (let p = 0; p < imgData.width * imgData.height; p++) {
                  dst[p * 4] = src[p * 3];
                  dst[p * 4 + 1] = src[p * 3 + 1];
                  dst[p * 4 + 2] = src[p * 3 + 2];
                  dst[p * 4 + 3] = 255;
                }
              } else {
                dst.set(src.slice(0, dst.length));
              }
            }

            ctx.putImageData(imageData, 0, 0);
            const blob = await canvas.convertToBlob({ type: "image/png" });
            const arrayBuffer = await blob.arrayBuffer();
            extracted.push({
              arrayBuffer,
              width: imgData.width,
              height: imgData.height,
              page: pageNum,
              index: imgIndex++
            });
          } catch (err) {
            console.error("Failed to extract image object:", err);
          }
        }
      }
    }
    return extracted;
  },

  async extractTextFromPdf(file: any, onProgress: any) {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof (pdfjsLib as any).GlobalWorkerOptions !== 'undefined') {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    const allText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      if (onProgress) {
        onProgress({ percent: (i / pdf.numPages) * 100, message: `Extracting page ${i} of ${pdf.numPages}…` });
      }
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      let lastY = -1;
      const pageLines: string[] = [];
      let currentLine: string[] = [];

      for (const item of (content.items as any[])) {
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
          pageLines.push(currentLine.join(" "));
          currentLine = [];
        }
        currentLine.push(item.str);
        lastY = item.transform[5];
      }
      if (currentLine.length > 0) pageLines.push(currentLine.join(" "));

      allText.push(pageLines.join("\n"));
    }

    return allText.join("\n\n--- Page Break ---\n\n");
  },

  async extractRawTextFromDocx(file: any, onProgress: any) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: file });
    return result.value;
  },

  async convertDocxToPdf(file: any, onProgress: any) {
    const mammoth = await import("mammoth");
    const PDFLib = await import("pdf-lib");

    const { value: text } = await mammoth.extractRawText({ arrayBuffer: file });
    if (!text.trim()) {
      throw new Error("The document seems to be empty or unreadable.");
    }

    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
    const pageSize = { width: 595.28, height: 841.89 }; // A4
    let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const maxWidth = width - margin * 2;
    let y = height - margin;
    const lines = text.split("\n");

    for (let k = 0; k < lines.length; k++) {
      const line = lines[k]!;
      if (onProgress) {
        onProgress({ percent: (k / lines.length) * 100, message: `Writing page...` });
      }

      if (!line.trim()) {
        y -= fontSize;
        continue;
      }

      const words = line.split(" ");
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
        if (textWidth > maxWidth) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
          y -= fontSize * 1.2;
          currentLine = word;
          if (y < margin) {
            page = pdfDoc.addPage([pageSize.width, pageSize.height]);
            y = height - margin;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
        y -= fontSize * 1.2;
      }

      if (y < margin) {
        page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        y = height - margin;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Uint8Array(pdfBytes);
  },

  async createDocx(text: string, onProgress: any) {
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const sections = text.split("\n\n--- Page Break ---\n\n").map(pageContent => ({
      properties: {},
      children: pageContent.split("\n").map(line => 
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 200 }
        })
      ),
    }));

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return Comlink.transfer(bytes, [bytes.buffer]);
  }
};

Comlink.expose(api);
export type DocumentWorkerAPI = typeof api;
