document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const input = el("text-input");
  const copyBtn = el("copy-btn");
  const clearBtn = el("clear-btn");
  const fancyResults = el("fancy-results");
  const countWords = el("count-words");
  const countChars = el("count-chars");
  const countLines = el("count-lines");
  const countTime = el("count-time");
  function updateStats() {
    const text = input.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text ? text.split("\n").length : 0;
    const time = Math.ceil(words / 200);
    countWords.textContent = words.toLocaleString();
    countChars.textContent = chars.toLocaleString();
    countLines.textContent = lines.toLocaleString();
    countTime.textContent = time + "m";
    if (activeTab === "fancy") generateFancy();
  }
  let activeTab = "convert";
  document.querySelectorAll(".tool-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tool-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.style.display = "none");
      tab.classList.add("active");
      activeTab = tab.dataset.tab || "convert";
      const content = el("tab-" + activeTab);
      if (content) content.style.display = "block";
      if (activeTab === "fancy") generateFancy();
    });
  });
  const caseActions = {
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    title: (s) => s.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    sentence: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    camel: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    pascal: (s) => s.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, ""),
    snake: (s) => s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
    kebab: (s) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  };
  const cleanActions = {
    "clean-spaces": (s) => s.replace(/\s+/g, " ").trim(),
    "clean-lines": (s) => s.split("\n").filter((l) => l.trim() !== "").join("\n"),
    "clean-special": (s) => s.replace(/[^a-zA-Z0-9\s]/g, ""),
    "clean-numbers": (s) => s.replace(/[0-9]/g, ""),
    "clean-html": (s) => s.replace(/<[^>]*>/g, "")
  };
  const fancyMaps = {
    "\u{1D516}\u{1D522}\u{1D52F}\u{1D526}\u{1D523}": "\u{1D51E}\u{1D51F}\u{1D520}\u{1D521}\u{1D522}\u{1D523}\u{1D524}\u{1D525}\u{1D526}\u{1D527}\u{1D528}\u{1D529}\u{1D52A}\u{1D52B}\u{1D52C}\u{1D52D}\u{1D52E}\u{1D52F}\u{1D530}\u{1D531}\u{1D532}\u{1D533}\u{1D534}\u{1D535}\u{1D536}\u{1D537}\u{1D504}\u{1D505}\u212D\u{1D507}\u{1D508}\u{1D509}\u{1D50A}\u210C\u2111\u{1D50D}\u{1D50E}\u{1D50F}\u{1D510}\u{1D511}\u{1D512}\u{1D513}\u{1D514}\u211C\u{1D516}\u{1D517}\u{1D518}\u{1D51A}\u{1D51B}\u{1D51C}\u2128",
    "\u{1D4E2}\u{1D4EC}\u{1D4FB}\u{1D4F2}\u{1D4F9}\u{1D4FD}": "\u{1D4EA}\u{1D4EB}\u{1D4EC}\u{1D4ED}\u{1D4EE}\u{1D4EF}\u{1D4F0}\u{1D4F1}\u{1D4F2}\u{1D4F3}\u{1D4F4}\u{1D4F5}\u{1D4F6}\u{1D4F7}\u{1D4F8}\u{1D4F9}\u{1D4FA}\u{1D4FB}\u{1D4FC}\u{1D4FD}\u{1D4FE}\u{1D4FF}\u{1D500}\u{1D501}\u{1D502}\u{1D503}\u{1D4D0}\u{1D4D1}\u{1D4D2}\u{1D4D3}\u{1D4D4}\u{1D4D5}\u{1D4D6}\u{1D4D7}\u{1D4D8}\u{1D4D9}\u{1D4DA}\u{1D4DB}\u{1D4DC}\u{1D4DD}\u{1D4DE}\u{1D4DF}\u{1D4E0}\u{1D4E1}\u{1D4E2}\u{1D4E3}\u{1D4E4}\u{1D4E5}\u{1D4E6}\u{1D4E7}\u{1D4E8}\u{1D4E9}",
    "\u{1D53B}\u{1D560}\u{1D566}\u{1D553}\u{1D55D}\u{1D556}": "\u{1D552}\u{1D553}\u{1D554}\u{1D555}\u{1D556}\u{1D557}\u{1D558}\u{1D559}\u{1D55A}\u{1D55B}\u{1D55C}\u{1D55D}\u{1D55E}\u{1D55F}\u{1D560}\u{1D561}\u{1D562}\u{1D563}\u{1D564}\u{1D565}\u{1D566}\u{1D567}\u{1D568}\u{1D569}\u{1D56A}\u{1D56B}\u{1D538}\u{1D539}\u2102\u{1D53B}\u{1D53C}\u{1D53D}\u{1D53E}\u210D\u{1D540}\u{1D541}\u{1D542}\u{1D543}\u{1D544}\u2115\u{1D546}\u2119\u211A\u211D\u{1D54A}\u{1D54B}\u{1D54C}\u{1D54D}\u{1D54E}\u{1D54F}\u{1D550}\u2124",
    "\u{1D67C}\u{1D698}\u{1D697}\u{1D698}": "\u{1D68A}\u{1D68B}\u{1D68C}\u{1D68D}\u{1D68E}\u{1D68F}\u{1D690}\u{1D691}\u{1D692}\u{1D693}\u{1D694}\u{1D695}\u{1D696}\u{1D697}\u{1D698}\u{1D699}\u{1D69A}\u{1D69B}\u{1D69C}\u{1D69D}\u{1D69E}\u{1D69F}\u{1D6A0}\u{1D6A1}\u{1D6A2}\u{1D6A3}\u{1D670}\u{1D671}\u{1D672}\u{1D673}\u{1D674}\u{1D675}\u{1D676}\u{1D677}\u{1D678}\u{1D679}\u{1D67A}\u{1D67B}\u{1D67C}\u{1D67D}\u{1D67E}\u{1D67F}\u{1D680}\u{1D681}\u{1D682}\u{1D683}\u{1D684}\u{1D685}\u{1D686}\u{1D687}\u{1D688}\u{1D689}",
    "S\u1D1B\u1D00\u1D04\u1D0B": "\u1D00\u0299\u1D04\u1D05\u1D07\uA730\u0262\u029C\u026A\u1D0A\u1D0B\u029F\u1D0D\u0274\u1D0F\u1D18\u01EB\u0280s\u1D1B\u1D1C\u1D20\u1D21x\u028F\u1D22\u1D00\u0299\u1D04\u1D05\u1D07\uA730\u0262\u029C\u026A\u1D0A\u1D0B\u029F\u1D0D\u0274\u1D0F\u1D18\u01EB\u0280s\u1D1B\u1D1C\u1D20\u1D21x\u028F\u1D22"
  };
  const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function generateFancy() {
    const text = input.value.trim();
    if (!text) {
      fancyResults.innerHTML = '<p style="text-align:center; color:var(--text-4); padding:20px;">Type something to see fancy styles...</p>';
      return;
    }
    let html = "";
    for (const [name, map] of Object.entries(fancyMaps)) {
      let transformed = "";
      for (const char of text) {
        const idx = normal.indexOf(char);
        transformed += idx !== -1 ? map[idx] || char : char;
      }
      html += `
        <div class="fancy-item">
          <div class="fancy-text" id="fancy-${name}">${transformed}</div>
          <button class="btn btn-sm btn-outline" onclick="copyTextById('fancy-${name}')">Copy</button>
        </div>
      `;
    }
    fancyResults.innerHTML = html;
  }
  input.addEventListener("input", updateStats);
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (!action) return;
      const transform = caseActions[action] || cleanActions[action];
      if (transform) {
        input.value = transform(input.value);
        updateStats();
        window.Shell.toast("Action applied!", "success");
      }
    });
  });
  copyBtn.onclick = () => {
    if (!input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
      window.Shell.toast("Text copied!", "success");
    });
  };
  clearBtn.onclick = () => {
    input.value = "";
    updateStats();
  };
  window.copyTextById = (id) => {
    const el2 = document.getElementById(id);
    if (el2) {
      navigator.clipboard.writeText(el2.textContent || "").then(() => {
        window.Shell.toast("Copied!", "success");
      });
    }
  };
});
