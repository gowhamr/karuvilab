import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";
const processor = {
    metadata: {
        version: "1.0.0",
        engineVersion: "1.0.0",
    },
    validate(input) {
        if (!input)
            return "No input provided.";
        const files = Array.isArray(input) ? input : [input];
        if (files.length === 0)
            return "No files provided.";
        if (!(files[0] instanceof File))
            return "Invalid file object.";
        return null;
    },
    async execute(input, options, signal, onProgress) {
        const start = performance.now();
        onProgress(0);
        const files = Array.isArray(input) ? input : [input];
        if (files.length === 0)
            throw new Error("No files to process.");
        const file = files[0];
        if (!file)
            throw new Error("File is undefined");
        let arrayBuffer;
        try {
            arrayBuffer = await file.arrayBuffer();
        }
        catch (e) {
            return {
                status: "error",
                outputType: "download",
                error: "Failed to read file.",
                processingMs: performance.now() - start,
            };
        }
        if (signal.aborted) {
            return {
                status: "cancelled",
                outputType: "download",
                processingMs: performance.now() - start,
            };
        }
        onProgress(20);
        let formatToUse = options.format;
        if (formatToUse === "original") {
            formatToUse = file.type;
            if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(formatToUse)) {
                formatToUse = "image/webp"; // fallback
            }
        }
        try {
            // Dispatch to worker
            const uint8Array = await workerOrchestrator.dispatch("compressImage", [arrayBuffer, file.type, formatToUse, options.quality], [arrayBuffer], // Transferable
            (p) => onProgress(20 + p.percent * 0.8), // Scale progress 20-100%
            signal, true, 2, 50, 30000);
            if (signal.aborted) {
                return {
                    status: "cancelled",
                    outputType: "download",
                    processingMs: performance.now() - start,
                };
            }
            onProgress(100);
            const outputBlob = new Blob([new Uint8Array(uint8Array)], { type: formatToUse });
            const newExt = formatToUse.split('/')[1];
            const newFilename = file.name.replace(/\.[^/.]+$/, "") + `-compressed.${newExt}`;
            return {
                status: "success",
                outputType: "download",
                blob: outputBlob,
                filename: newFilename,
                mimeType: formatToUse,
                inputSizeBytes: file.size,
                outputSizeBytes: outputBlob.size,
                processingMs: performance.now() - start,
            };
        }
        catch (e) {
            if (e.name === "AbortError") {
                return {
                    status: "cancelled",
                    outputType: "download",
                    processingMs: performance.now() - start,
                };
            }
            logger.error("[ImageCompressorProcessor] Compression failed", {
                toolId: "image-compressor",
                action: "execute",
                error: e.message
            });
            return {
                status: "error",
                outputType: "download",
                error: "Image compression failed. The file might be corrupted or in an unsupported sub-format.",
                processingMs: performance.now() - start,
            };
        }
    }
};
export default processor;
