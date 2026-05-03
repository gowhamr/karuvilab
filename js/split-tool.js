(function() {
  const SplitTool = {
    state: {
      parts: [],
      content: "",
      currentMethod: "equal"
    },
    els: null,
    init() {
      this.cacheElements();
      this.bindEvents();
      this.updateUI();
    },
    cacheElements() {
      const g = (id) => document.getElementById(id);
      this.els = {
        input: g("split-input"),
        methodSelect: g("split-method"),
        splitBtn: g("split-btn"),
        clearBtn: g("clear-btn"),
        resultsSection: g("results-section"),
        resultsArea: g("split-results"),
        partsSummary: g("parts-summary"),
        totalCharCount: g("total-char-count"),
        warningBanner: g("large-content-warning"),
        dropZone: g("drop-zone"),
        fileInput: g("file-input"),
        stickyActions: g("sticky-actions"),
        copyAllSeqBtn: g("copy-all-seq-btn"),
        downloadBtn: g("download-btn"),
        paramsContainer: g("method-params-container"),
        partsCount: g("parts-count"),
        maxChars: g("max-chars"),
        delimiterSelect: g("split-delimiter"),
        customDelim: g("custom-delim"),
        customPartsCount: g("custom-parts-count"),
        partsMinus: g("parts-minus"),
        partsPlus: g("parts-plus")
      };
    },
    bindEvents() {
      const { els } = this;
      if (!els) return;
      els.input.addEventListener("input", Utils.debounce(() => {
        this.handleInputChange();
        this.executeSplit();
      }, 400));
      els.methodSelect.addEventListener("change", (e) => {
        this.state.currentMethod = e.target.value;
        this.updateMethodUI();
        this.executeSplit();
      });
      els.splitBtn.addEventListener("click", () => this.executeSplit());
      els.clearBtn.addEventListener("click", () => this.clearAll());
      els.dropZone.addEventListener("click", () => els.fileInput.click());
      els.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
      els.dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        els.dropZone.classList.add("active");
      });
      els.dropZone.addEventListener("dragleave", () => els.dropZone.classList.remove("active"));
      els.dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        els.dropZone.classList.remove("active");
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) this.handleFiles(files);
      });
      els.copyAllSeqBtn.addEventListener("click", () => this.copySequential());
      els.downloadBtn.addEventListener("click", () => this.downloadAsTxt());
      if (els.partsMinus) {
        els.partsMinus.addEventListener("click", () => {
          const v = parseInt(els.partsCount.value, 10);
          if (v > 2) {
            els.partsCount.value = String(v - 1);
            this.executeSplit();
          }
        });
      }
      if (els.partsPlus) {
        els.partsPlus.addEventListener("click", () => {
          const v = parseInt(els.partsCount.value, 10);
          if (v < 50) {
            els.partsCount.value = String(v + 1);
            this.executeSplit();
          }
        });
      }
    },
    handleInputChange() {
      const { els } = this;
      if (!els) return;
      const len = els.input.value.length;
      if (els.totalCharCount) els.totalCharCount.textContent = len.toLocaleString();
      if (els.warningBanner) els.warningBanner.style.display = len > 5e4 ? "block" : "none";
    },
    updateMethodUI() {
      const { els } = this;
      if (!els || !els.paramsContainer) return;
      const method = this.state.currentMethod;
      els.paramsContainer.querySelectorAll("[data-method]").forEach((el) => {
        el.style.display = el.dataset.method === method ? "" : "none";
      });
    },
    handleFileSelect(e) {
      const files = e.target.files;
      if (files && files.length > 0) this.handleFiles(files);
    },
    handleFiles(files) {
      const file = files[0];
      const check = Utils.validateFile(file, ["txt", "js", "json", "html", "css", "md"], 5);
      if (!check.valid) {
        window.Shell.toast(check.error ?? "Invalid file.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const { els } = this;
        if (!els) return;
        els.input.value = e.target?.result ?? "";
        this.handleInputChange();
        this.executeSplit();
      };
      reader.readAsText(file);
    },
    executeSplit() {
      const { els } = this;
      if (!els) return;
      const text = els.input.value;
      if (!text) {
        this.state.parts = [];
        els.resultsSection.style.display = "none";
        els.stickyActions.style.display = "none";
        els.resultsArea.innerHTML = "";
        return;
      }
      const method = this.state.currentMethod;
      let parts = [];
      if (method === "equal") {
        const count = parseInt(els.partsCount.value, 10) || 2;
        parts = this.splitEqually(text, count);
      } else if (method === "chars") {
        const max = parseInt(els.maxChars.value, 10) || 1e3;
        parts = this.splitByChars(text, max);
      } else if (method === "delim") {
        parts = this.splitByDelimiter(text);
      } else if (method === "custom") {
        const count = parseInt(els.customPartsCount.value, 10) || 2;
        parts = this.splitEqually(text, count);
      }
      this.state.parts = parts;
      this.renderResults();
    },
    splitEqually(text, count) {
      const parts = [];
      const len = text.length;
      if (len === 0) return [];
      const partSize = Math.ceil(len / count);
      for (let i = 0; i < len; i += partSize) {
        parts.push(text.substring(i, i + partSize));
      }
      return parts;
    },
    splitByChars(text, max) {
      const parts = [];
      if (max <= 0) return [text];
      for (let i = 0; i < text.length; i += max) {
        parts.push(text.substring(i, i + max));
      }
      return parts;
    },
    splitByDelimiter(text) {
      const { els } = this;
      if (!els) return [text];
      const dType = els.delimiterSelect.value;
      let delim = "\n";
      if (dType === "line") delim = /\r?\n/;
      else if (dType === "comma") delim = ",";
      else if (dType === "space") delim = " ";
      else if (dType === "custom") delim = els.customDelim.value || "\n";
      return text.split(delim).filter((p) => p.length > 0);
    },
    renderResults() {
      const { parts } = this.state;
      const { els } = this;
      if (!els) return;
      els.resultsArea.innerHTML = "";
      els.resultsSection.style.display = parts.length > 0 ? "block" : "none";
      els.stickyActions.style.display = parts.length > 0 ? "flex" : "none";
      els.partsSummary.textContent = `${parts.length} parts generated`;
      parts.forEach((part, index) => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
          <div class="result-header">
            <div>
              <strong style="font-size: 0.9rem;">Part ${index + 1}</strong>
              <span style="font-size: 0.75rem; color: var(--text-3); margin-left: 8px;">${part.length.toLocaleString()} chars</span>
            </div>
            <span class="copy-status" id="status-${index}">Copied \u2705</span>
          </div>
          <pre class="fmt-pre">${Utils.escHtml(part)}</pre>
          <div style="margin-top: 12px;">
            <button class="fmt-btn fmt-btn-primary btn-small copy-btn" data-index="${index}" style="width: 100%; padding: 8px;">Copy Part ${index + 1}</button>
          </div>
        `;
        els.resultsArea.appendChild(card);
      });
      els.resultsArea.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.target.dataset.index ?? "0", 10);
          this.copyPart(idx, e.target);
        });
      });
    },
    async copyPart(index, btn) {
      const text = this.state.parts[index];
      const status = document.getElementById(`status-${index}`);
      try {
        await navigator.clipboard.writeText(text);
        if (status) {
          status.classList.add("show");
          setTimeout(() => status.classList.remove("show"), 2e3);
        }
        const originalText = btn.textContent ?? "Copy";
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2e3);
      } catch (err) {
        console.error("Copy failed", err);
      }
    },
    async copySequential() {
      const { parts } = this.state;
      const { els } = this;
      if (!els) return;
      const btn = els.copyAllSeqBtn;
      const originalText = btn.textContent ?? "Copy All";
      btn.disabled = true;
      for (let i = 0; i < parts.length; i++) {
        btn.textContent = `Copying Part ${i + 1}/${parts.length}... (Paste now!)`;
        await navigator.clipboard.writeText(parts[i]);
        const status = document.getElementById(`status-${i}`);
        if (status) status.classList.add("show");
        await new Promise((r) => setTimeout(r, 3e3));
        if (status) status.classList.remove("show");
      }
      btn.textContent = "All Parts Copied! \u2705";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3e3);
    },
    downloadAsTxt() {
      const { parts } = this.state;
      if (!parts.length) return;
      const content = parts.map((p, i) => `--- PART ${i + 1} ---
${p}`).join("\n\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split_parts_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },
    clearAll() {
      const { els } = this;
      if (!els) return;
      els.input.value = "";
      this.state.parts = [];
      this.handleInputChange();
      els.resultsSection.style.display = "none";
      els.stickyActions.style.display = "none";
      els.resultsArea.innerHTML = "";
    },
    updateUI() {
      this.updateMethodUI();
    }
  };
  window.splitInit = () => SplitTool.init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SplitTool.init());
  } else {
    SplitTool.init();
  }
})();
