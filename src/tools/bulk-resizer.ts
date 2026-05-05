/* ===== bulk-resizer.ts – Process multiple images at once ===== */

declare const JSZip: any;

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const dropZone = el('drop-zone') as HTMLDivElement;
  const fileIn = el('file-in') as HTMLInputElement;
  const imageList = el('image-list') as HTMLDivElement;
  const processBtn = el('process-btn') as HTMLButtonElement;
  const clearBtn = el('clear-btn') as HTMLButtonElement;
  
  const targetWidth = el('target-width') as HTMLInputElement;
  const outputFormat = el('output-format') as HTMLSelectElement;
  const qualityIn = el('quality') as HTMLInputElement;
  
  const progressCard = el('progress-card') as HTMLDivElement;
  const progressBar = el('progress-bar') as HTMLDivElement;
  const progressPercent = el('progress-percent') as HTMLElement;
  const progressLabel = el('progress-label') as HTMLElement;

  let files: File[] = [];

  function updateUI() {
    processBtn.disabled = files.length === 0;
    imageList.innerHTML = '';
    files.forEach((file, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'image-thumb';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);
      
      const remove = document.createElement('div');
      remove.className = 'remove-btn';
      remove.innerHTML = '×';
      remove.onclick = (e) => {
        e.stopPropagation();
        files.splice(idx, 1);
        updateUI();
      };
      thumb.appendChild(remove);
      imageList.appendChild(thumb);
    });
  }

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i].type.startsWith('image/')) {
        files.push(newFiles[i]);
      }
    }
    updateUI();
  }

  dropZone.onclick = () => fileIn.click();
  fileIn.onchange = () => handleFiles(fileIn.files);

  dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('dragover'); };
  dropZone.ondragleave = () => dropZone.classList.remove('dragover');
  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer?.files || null);
  };

  clearBtn.onclick = () => { files = []; updateUI(); progressCard.style.display = 'none'; };

  async function processAll() {
    if (files.length === 0) return;
    
    progressCard.style.display = 'block';
    processBtn.disabled = true;
    const zip = new JSZip();
    const width = parseInt(targetWidth.value) || 1200;
    const format = outputFormat.value;
    const quality = (parseInt(qualityIn.value) || 80) / 100;
    const ext = format.split('/')[1].replace('jpeg', 'jpg');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progressLabel.textContent = `Processing ${file.name}...`;
      const p = Math.round((i / files.length) * 100);
      progressBar.style.width = p + '%';
      progressPercent.textContent = p + '%';

      try {
        const img = await (window as any).Utils.loadImage(URL.createObjectURL(file));
        const canvas = (window as any).Utils.drawResized(img, width, null);
        const blob = await (window as any).Utils.canvasToBlob(canvas, format, quality);
        
        const newName = file.name.split('.')[0] + '_resized.' + ext;
        zip.file(newName, blob);
      } catch (e) {
        console.error('Error processing file:', file.name, e);
      }
    }

    progressLabel.textContent = 'Generating ZIP...';
    progressBar.style.width = '100%';
    progressPercent.textContent = '100%';

    const content = await zip.generateAsync({ type: 'blob' });
    (window as any).Utils.downloadBlob(content, `karuvilab_resized_images_${Date.now()}.zip`);
    
    progressLabel.textContent = 'Done!';
    processBtn.disabled = false;
    (window as any).Shell.toast('All images processed and downloaded!', 'success');
  }

  processBtn.onclick = processAll;
});
