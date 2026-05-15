import Decimal from 'decimal.js';

export { Decimal };
export const d = (n: number | string | Decimal) => new Decimal(n);

export const formatINR = (n: number | Decimal, d = 0) => {
  const value = n instanceof Decimal ? n.toNumber() : n;
  return "₹" + value.toLocaleString("en-IN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
};

export const formatPercent = (n: number | Decimal, d = 1) => {
  const value = n instanceof Decimal ? n.toNumber() : n;
  return value.toFixed(d) + "%";
};

export function syncStateToUrl(params: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, '', url.toString());
}

export function getInitialStateFromUrl<T extends Record<string, any>>(defaults: T): T {
  if (typeof window === 'undefined') return defaults;
  const searchParams = new URLSearchParams(window.location.search);
  const state = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    const val = searchParams.get(key);
    if (val !== null) {
      if (typeof defaults[key] === 'number') {
        (state as any)[key] = Number(val);
      } else if (typeof defaults[key] === 'boolean') {
        (state as any)[key] = val === 'true';
      } else {
        (state as any)[key] = val;
      }
    }
  });
  return state;
}

export function exportToCSV(filename: string, headers: string[], rows: any[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
