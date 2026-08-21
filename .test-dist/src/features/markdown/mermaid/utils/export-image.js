/**
 * KaruviLab Mermaid Image Export Utilities
 * Converts rendered SVG diagrams to crisp high-DPI PNGs using HTMLCanvasElement and blobManager.
 */
import { blobManager } from "@/src/lib/blob-manager";
export async function downloadSvgAsPng(svgString, filename) {
    if (!svgString || typeof window === "undefined")
        return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (!svgEl)
        return;
    // Compute viewBox or explicit dimensions
    const viewBox = svgEl.getAttribute("viewBox");
    let width = 800;
    let height = 600;
    if (viewBox) {
        const parts = viewBox.split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] && parts[3]) {
            width = parts[2];
            height = parts[3];
        }
    }
    else {
        width = parseFloat(svgEl.getAttribute("width") || "800") || 800;
        height = parseFloat(svgEl.getAttribute("height") || "600") || 600;
    }
    const canvas = document.createElement("canvas");
    const scale = 2; // 2x high-resolution retina rasterization
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    // Background fill
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    ctx.fillStyle = isDark ? "#101626" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = blobManager.create(svgBlob);
    await new Promise((resolve, reject) => {
        img.onload = () => {
            try {
                ctx.drawImage(img, 0, 0, width, height);
                blobManager.revoke(url);
                canvas.toBlob((pngBlob) => {
                    if (pngBlob) {
                        const pngUrl = blobManager.create(pngBlob);
                        const a = document.createElement("a");
                        a.href = pngUrl;
                        a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        blobManager.revoke(pngUrl);
                    }
                    resolve();
                }, "image/png");
            }
            catch (err) {
                blobManager.revoke(url);
                reject(err);
            }
        };
        img.onerror = (e) => {
            blobManager.revoke(url);
            reject(e);
        };
        img.src = url;
    });
}
