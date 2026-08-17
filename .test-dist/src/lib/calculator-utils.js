import Decimal from 'decimal.js';
export { Decimal };
export const d = (n) => new Decimal(n);
export const formatINR = (n, d = 0) => {
    const value = n instanceof Decimal ? n.toNumber() : n;
    return "₹" + value.toLocaleString("en-IN", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
    });
};
export const formatPercent = (n, d = 1) => {
    const value = n instanceof Decimal ? n.toNumber() : n;
    return value.toFixed(d) + "%";
};
export function syncStateToUrl(params) {
    if (typeof window === 'undefined')
        return;
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
        else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url.toString());
}
export function getInitialStateFromUrl(defaults) {
    if (typeof window === 'undefined')
        return defaults;
    const searchParams = new URLSearchParams(window.location.search);
    const state = { ...defaults };
    Object.keys(defaults).forEach((key) => {
        const val = searchParams.get(key);
        if (val !== null) {
            if (typeof defaults[key] === 'number') {
                state[key] = Number(val);
            }
            else if (typeof defaults[key] === 'boolean') {
                state[key] = val === 'true';
            }
            else {
                state[key] = val;
            }
        }
    });
    return state;
}
export function exportToCSV(filename, headers, rows) {
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
