/* ===== text-utility.ts – Text Cleaner, Case Converter, Word Counter & Fancy Text ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const input = el('text-input') as HTMLTextAreaElement;
  const copyBtn = el('copy-btn') as HTMLButtonElement;
  const clearBtn = el('clear-btn') as HTMLButtonElement;
  const fancyResults = el('fancy-results') as HTMLDivElement;

  const countWords = el('count-words') as HTMLElement;
  const countChars = el('count-chars') as HTMLElement;
  const countLines = el('count-lines') as HTMLElement;
  const countTime = el('count-time') as HTMLElement;

  // --- Stats Update ---
  function updateStats() {
    const text = input.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text ? text.split('\n').length : 0;
    const time = Math.ceil(words / 200);

    countWords.textContent = words.toLocaleString();
    countChars.textContent = chars.toLocaleString();
    countLines.textContent = lines.toLocaleString();
    countTime.textContent = time + 'm';

    if (activeTab === 'fancy') generateFancy();
  }

  // --- Tab Switching ---
  let activeTab = 'convert';
  document.querySelectorAll('.tool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => (c as HTMLElement).style.display = 'none');
      
      tab.classList.add('active');
      activeTab = (tab as HTMLElement).dataset.tab || 'convert';
      const content = el('tab-' + activeTab);
      if (content) content.style.display = 'block';

      if (activeTab === 'fancy') generateFancy();
    });
  });

  // --- Case Conversion Logic ---
  const caseActions: Record<string, (s: string) => string> = {
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    title: (s) => s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    sentence: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    camel: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    pascal: (s) => s.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, ''),
    snake: (s) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    kebab: (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  };

  // --- Cleaning Logic ---
  const cleanActions: Record<string, (s: string) => string> = {
    'clean-spaces': (s) => s.replace(/\s+/g, ' ').trim(),
    'clean-lines': (s) => s.split('\n').filter(l => l.trim() !== '').join('\n'),
    'clean-special': (s) => s.replace(/[^a-zA-Z0-9\s]/g, ''),
    'clean-numbers': (s) => s.replace(/[0-9]/g, ''),
    'clean-html': (s) => s.replace(/<[^>]*>/g, '')
  };

  // --- Fancy Text Generator ---
  const fancyMaps: Record<string, string> = {
    '𝔖𝔢𝔯𝔦𝔣': '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔚𝔛𝔜ℨ',
    '𝓢𝓬𝓻𝓲𝓹𝓽': '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
    '𝔻𝕠𝕦𝕓𝕝𝕖': '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
    '𝙼𝚘𝚗𝚘': '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    'Sᴛᴀᴄᴋ': 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'
  };
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function generateFancy() {
    const text = input.value.trim();
    if (!text) {
      fancyResults.innerHTML = '<p style="text-align:center; color:var(--text-4); padding:20px;">Type something to see fancy styles...</p>';
      return;
    }

    let html = '';
    for (const [name, map] of Object.entries(fancyMaps)) {
      let transformed = '';
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

  // --- Event Listeners ---
  input.addEventListener('input', updateStats);

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = (btn as HTMLElement).dataset.action;
      if (!action) return;
      
      const transform = caseActions[action] || cleanActions[action];
      if (transform) {
        input.value = transform(input.value);
        updateStats();
        (window as any).Shell.toast('Action applied!', 'success');
      }
    });
  });

  copyBtn.onclick = () => {
    if (!input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
      (window as any).Shell.toast('Text copied!', 'success');
    });
  };

  clearBtn.onclick = () => {
    input.value = '';
    updateStats();
  };

  // Helper for inline copy buttons
  (window as any).copyTextById = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      navigator.clipboard.writeText(el.textContent || '').then(() => {
        (window as any).Shell.toast('Copied!', 'success');
      });
    }
  };
});
