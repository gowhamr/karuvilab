document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const dropZone = el("drop-zone");
  const fileIn = el("file-in");
  const imageList = el("image-list");
  const processBtn = el("process-btn");
  const clearBtn = el("clear-btn");
  const targetWidth = el("target-width");
  const outputFormat = el("output-format");
  const qualityIn = el("quality");
  const progressCard = el("progress-card");
  const progressBar = el("progress-bar");
  const progressPercent = el("progress-percent");
  const progressLabel = el("progress-label");
  let files = [];
  function updateUI() {
    processBtn.disabled = files.length === 0;
    imageList.innerHTML = "";
    files.forEach((file, idx) => {
      const thumb = document.createElement("div");
      thumb.className = "image-thumb";
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);
      const remove = document.createElement("div");
      remove.className = "remove-btn";
      remove.innerHTML = "\xD7";
      remove.onclick = (e) => {
        e.stopPropagation();
        files.splice(idx, 1);
        updateUI();
      };
      thumb.appendChild(remove);
      imageList.appendChild(thumb);
    });
  }
  function handleFiles(newFiles) {
    if (!newFiles) return;
    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i].type.startsWith("image/")) {
        files.push(newFiles[i]);
      }
    }
    updateUI();
  }
  dropZone.onclick = () => fileIn.click();
  fileIn.onchange = () => handleFiles(fileIn.files);
  dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  };
  dropZone.ondragleave = () => dropZone.classList.remove("dragover");
  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    handleFiles(e.dataTransfer?.files || null);
  };
  clearBtn.onclick = () => {
    files = [];
    updateUI();
    progressCard.style.display = "none";
  };
  async function processAll() {
    if (files.length === 0) return;
    progressCard.style.display = "block";
    processBtn.disabled = true;
    const zip = new JSZip();
    const width = parseInt(targetWidth.value) || 1200;
    const format = outputFormat.value;
    const quality = (parseInt(qualityIn.value) || 80) / 100;
    const ext = format.split("/")[1].replace("jpeg", "jpg");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progressLabel.textContent = `Processing ${file.name}...`;
      const p = Math.round(i / files.length * 100);
      progressBar.style.width = p + "%";
      progressPercent.textContent = p + "%";
      try {
        const img = await window.Utils.loadImage(URL.createObjectURL(file));
        const canvas = window.Utils.drawResized(img, width, null);
        const blob = await window.Utils.canvasToBlob(canvas, format, quality);
        const newName = file.name.split(".")[0] + "_resized." + ext;
        zip.file(newName, blob);
      } catch (e) {
        console.error("Error processing file:", file.name, e);
      }
    }
    progressLabel.textContent = "Generating ZIP...";
    progressBar.style.width = "100%";
    progressPercent.textContent = "100%";
    const content = await zip.generateAsync({ type: "blob" });
    window.Utils.downloadBlob(content, `karuvilab_resized_images_${Date.now()}.zip`);
    progressLabel.textContent = "Done!";
    processBtn.disabled = false;
    window.Shell.toast("All images processed and downloaded!", "success");
  }
  processBtn.onclick = processAll;
});
