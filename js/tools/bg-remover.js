document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const uploadBtn = el("upload-btn");
  const fileIn = el("file-in");
  const origBox = el("orig-box");
  const resBox = el("res-box");
  const loading = el("loading");
  const loadText = el("load-text");
  const downloadBtn = el("download-btn");
  const clearBtn = el("clear-btn");
  let currentBlob = null;
  async function processImage(file) {
    origBox.innerHTML = "";
    const origImg = document.createElement("img");
    origImg.src = URL.createObjectURL(file);
    origBox.appendChild(origImg);
    resBox.querySelectorAll("img, span").forEach((n) => {
      if (n.tagName !== "DIV") n.remove();
    });
    loading.style.display = "flex";
    loadText.textContent = "Analyzing subject...";
    downloadBtn.disabled = true;
    try {
      const resultBlob = await imglyRemoveBackground(file, {
        progress: (args) => {
          if (args.status === "fetch-model") loadText.textContent = "Downloading AI model...";
          if (args.status === "compute") loadText.textContent = "Removing background...";
        }
      });
      currentBlob = resultBlob;
      const resImg = document.createElement("img");
      resImg.src = URL.createObjectURL(resultBlob);
      resBox.appendChild(resImg);
      downloadBtn.disabled = false;
      window.Shell.toast("Background removed successfully!", "success");
    } catch (e) {
      console.error(e);
      window.Shell.toast("Error processing image. Is your device compatible?", "error");
      resBox.innerHTML = '<span style="color:var(--error)">Processing failed</span>';
    } finally {
      loading.style.display = "none";
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
      window.Utils.downloadBlob(currentBlob, "karuvilab_no_bg.png");
    }
  };
  clearBtn.onclick = () => {
    origBox.innerHTML = '<span style="color:var(--text-4)">No image selected</span>';
    resBox.querySelectorAll("img, span").forEach((n) => {
      if (n.tagName !== "DIV") n.remove();
    });
    resBox.insertAdjacentHTML("beforeend", '<span style="color:var(--text-4)">Result will appear here</span>');
    downloadBtn.disabled = true;
    currentBlob = null;
    fileIn.value = "";
  };
});
