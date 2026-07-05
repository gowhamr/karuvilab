export interface SystemAction {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

export function getSystemActions(): SystemAction[] {
  return [
    {
      id: 'open-workbench',
      name: 'Open Workbench',
      icon: 'LayoutGrid',
      action: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/workbench';
        }
      }
    },
    {
      id: 'toggle-theme',
      name: 'Toggle Theme (Dark/Light)',
      icon: 'Moon',
      action: () => {
        // Toggle dark class on document element
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.theme = 'light';
        } else {
          document.documentElement.classList.add('dark');
          localStorage.theme = 'dark';
        }
      }
    },
    {
      id: 'copy-url',
      name: 'Copy Page URL',
      icon: 'Link',
      action: () => {
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(window.location.href);
        }
      }
    },
    {
      id: 'go-home',
      name: 'Go to Homepage',
      icon: 'Home',
      action: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
  ];
}

export function searchSystemActions(query: string): SystemAction[] {
  const actions = getSystemActions();
  const q = query.replace(/^>\s*/, '').toLowerCase().trim();
  
  if (!q) return actions;
  
  return actions.filter(a => a.name.toLowerCase().includes(q) || a.id.includes(q));
}
