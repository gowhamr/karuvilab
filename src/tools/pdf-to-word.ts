/* ===== pdf-to-word.ts – PDF Text extraction to .docx ===== */

declare const pdfjsLib: any;
declare const docx: any;

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const dropZone = el('drop-zone') as HTMLDivElement;
  const fileIn = el('file-in') as HTMLInputElement;
  const convertBtn = el('convert-btn') as HTMLButtonElement;
  const clearBtn = el('clear-btn') as HTMLButtonElement;
  const log = el('log') as HTMLDivElement;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let currentFile: File | null = null;

  function addLog(msg: string, type: 'info' | 'success' | 'error' = 'info') {
    log.style.display = 'block';
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${msg}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  dropZone.onclick = () => fileIn.click();
  fileIn.onchange = () => {
    if (fileIn.files && fileIn.files[0]) {
      currentFile = fileIn.files[0];
      addLog(`Selected: ${currentFile.name} (${(currentFile.size / 1024 / 1024).toFixed(2)} MB)`);
      convertBtn.disabled = false;
    }
  };

  async function convert() {
    if (!currentFile) return;
    convertBtn.disabled = true;
    addLog('Reading PDF structure...');

    try {
      const arrayBuffer = await currentFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      addLog(`PDF loaded. Total pages: ${pdf.numPages}`);

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        addLog(`Extracting text from page ${i}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      addLog('Text extraction complete. Building .docx file...');

      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: fullText.split('\n').map((line: string) => {
            return new docx.Paragraph({
              children: [new docx.TextRun(line)],
            });
          }),
        }],
      });

      const blob = await docx.Packer.toBlob(doc);
      (window as any).Utils.downloadBlob(blob, currentFile.name.replace('.pdf', '') + '_extracted.docx');
      
      addLog('Success! Your Word document is ready.', 'success');
      (window as any).Shell.toast('Conversion complete!', 'success');
    } catch (e) {
      console.error(e);
      addLog('Error during conversion. The PDF might be corrupted or protected.', 'error');
    } finally {
      convertBtn.disabled = false;
    }
  }

  convertBtn.onclick = convert;

  clearBtn.onclick = () => {
    currentFile = null;
    fileIn.value = '';
    convertBtn.disabled = true;
    log.innerHTML = '';
    log.style.display = 'none';
  };
});
