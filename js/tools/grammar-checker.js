document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const input = el("text-input");
  const errorList = el("error-list");
  const errCount = el("err-count");
  const charCount = el("char-count");
  const copyBtn = el("copy-btn");
  const clearBtn = el("clear-btn");
  const RULES = [
    {
      regex: /\b(the|a|an|is|to|in|it|of|and|that|was|for|on|are|with|as|at|be|this|have|from)\s+\1\b/gi,
      message: "Repeated word found.",
      fix: (m) => m.split(/\s+/)[0],
      type: "error"
    },
    {
      regex: /([,.!?;:])([^\s"'])/g,
      message: "Missing space after punctuation.",
      fix: (m) => m[0] + " " + m[1],
      type: "warn"
    },
    {
      regex: /\b(its|it's)\b/gi,
      message: "Check if you mean 'its' (possessive) or 'it's' (it is).",
      type: "warn"
    },
    {
      regex: /\b(there|their|they're)\b/gi,
      message: "Common homophone. Verify usage.",
      type: "warn"
    },
    {
      regex: /\b(your|you're)\b/gi,
      message: "Common homophone. Verify usage.",
      type: "warn"
    },
    {
      regex: /\b(teh|recieve|accommodate|definitely|sepereate|untill|wierd|ocured|goverment|publically|tommorow|relly)\b/gi,
      message: "Common spelling error.",
      fix: (m) => {
        const corrections = {
          teh: "the",
          recieve: "receive",
          definitely: "definitely",
          sepereate: "separate",
          untill: "until",
          wierd: "weird",
          ocured: "occurred",
          goverment: "government",
          publically: "publicly",
          tommorow: "tomorrow",
          relly: "really"
        };
        return corrections[m.toLowerCase()] || m;
      },
      type: "error"
    }
  ];
  function checkText() {
    const text = input.value;
    charCount.textContent = `${text.length.toLocaleString()} characters`;
    if (!text.trim()) {
      errorList.innerHTML = "";
      errCount.textContent = "No errors found";
      return;
    }
    const matches = [];
    RULES.forEach((rule) => {
      let m;
      while ((m = rule.regex.exec(text)) !== null) {
        matches.push({
          start: m.index,
          end: m.index + m[0].length,
          rule,
          matchText: m[0]
        });
      }
    });
    matches.sort((a, b) => a.start - b.start);
    errCount.textContent = `${matches.length} issue${matches.length === 1 ? "" : "s"} detected`;
    let html = "";
    matches.forEach((m, idx) => {
      const color = m.rule.type === "error" ? "var(--error)" : "var(--warn)";
      const icon = m.rule.type === "error" ? "\u274C" : "\u26A0\uFE0F";
      html += `
        <div class="error-card">
          <div class="error-icon" style="background:${color}15">${icon}</div>
          <div class="err-msg">
            <p><strong>"${m.matchText}"</strong>: ${m.rule.message}</p>
            ${m.rule.fix ? `<p style="margin-top:4px;">Suggestion: <span class="err-fix" onclick="applyFix(${idx})">${m.rule.fix(m.matchText)}</span></p>` : ""}
          </div>
        </div>
      `;
    });
    errorList.innerHTML = html || '<p style="text-align:center; color:var(--text-4); padding:20px;">All clear! No common errors found.</p>';
    window._currentMatches = matches;
  }
  window.applyFix = (idx) => {
    const match = window._currentMatches[idx];
    if (!match || !match.rule.fix) return;
    const text = input.value;
    const fixed = match.rule.fix(match.matchText);
    input.value = text.slice(0, match.start) + fixed + text.slice(match.end);
    window.Shell.toast("Correction applied!", "success");
    checkText();
  };
  input.addEventListener("input", checkText);
  copyBtn.onclick = () => {
    if (!input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
      window.Shell.toast("Text copied!", "success");
    });
  };
  clearBtn.onclick = () => {
    input.value = "";
    checkText();
  };
  checkText();
});
