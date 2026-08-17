export function compressParam(value) {
    try {
        const compressed = btoa(encodeURIComponent(value))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return compressed;
    }
    catch {
        return encodeURIComponent(value);
    }
}
export function decompressParam(compressed) {
    try {
        const padded = compressed.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(padded);
        return decodeURIComponent(decoded);
    }
    catch {
        return decodeURIComponent(compressed);
    }
}
export function smartEncode(value) {
    if (value.length <= 100)
        return encodeURIComponent(value);
    return 'z_' + compressParam(value);
}
export function smartDecode(value) {
    if (value.startsWith('z_'))
        return decompressParam(value.slice(2));
    return decodeURIComponent(value);
}
