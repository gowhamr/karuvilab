/* ===== bg-remover.ts – Offline AI background removal ===== */

declare const imglyRemoveBackground: any;

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const uploadBtn = el('upload-btn') as HTMLButtonElement;
  const fileIn = el('file-in') as HTMLInputElement;
  const origBox = el('orig-box') as HTMLDivElement;
  const resBox = el('res-box') as HTMLDivElement;
  const loading = el('loading') as HTMLDivElement;
  const loadText = el('load-text') as HTMLElement;
  const downloadBtn = el('download-btn') as HTMLButtonElement;
  const clearBtn = el('clear-btn') as HTMLButtonElement;

  let currentBlob: Blob | null = null;

  async function processImage(file: File) {
    // Show original
    origBox.innerHTML = '';
    const origImg = document.createElement('img');
    origImg.src = URL.createObjectURL(file);
    origBox.appendChild(origImg);

    // Prepare result box
    resBox.querySelectorAll('img, span').forEach(n => {
      if (n.tagName !== 'DIV') n.remove();
    });
    loading.style.display = 'flex';
    loadText.textContent = 'Analyzing subject...';
    downloadBtn.disabled = true;

    try {
      // Run AI removal
      const resultBlob = await imglyRemoveBackground(file, {
        progress: (args: any) => {
          if (args.status === 'fetch-model') loadText.textContent = 'Downloading AI model...';
          if (args.status === 'compute') loadText.textContent = 'Removing background...';
        }
      });

      currentBlob = resultBlob;
      const resImg = document.createElement('img');
      resImg.src = URL.createObjectURL(resultBlob);
      resBox.appendChild(resImg);
      
      downloadBtn.disabled = false;
      (window as any).Shell.toast('Background removed successfully!', 'success');
    } catch (e) {
      console.error(e);
      (window as any).Shell.toast('Error processing image. Is your device compatible?', 'error');
      resBox.innerHTML = '<span style="color:var(--error)">Processing failed</span>';
    } finally {
      loading.style.display = 'none';
    }
  }

  uploadBtn.onclick = () => fileIn.click();
  fileIn.onchange = () => {
    if (fileIn.files && fileIn.files[0]) {
      processImage(fileIn.files[0]);
    }
  };

  downloadBtn.onclick = () => {
    if (currentBlob) {
      (window as any).Utils.downloadBlob(currentBlob, 'karuvilab_no_bg.png');
    }
  };

  clearBtn.onclick = () => {
    origBox.innerHTML = '<span style="color:var(--text-4)">No image selected</span>';
    resBox.querySelectorAll('img, span').forEach(n => {
      if (n.tagName !== 'DIV') n.remove();
    });
    resBox.insertAdjacentHTML('beforeend', '<span style="color:var(--text-4)">Result will appear here</span>');
    downloadBtn.disabled = true;
    currentBlob = null;
    fileIn.value = '';
  };
});
