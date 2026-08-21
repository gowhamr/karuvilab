import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";
class WorkerManager {
    isSupported() {
        return typeof Worker !== "undefined";
    }
    async run(method, args, options) {
        return workerOrchestrator.dispatch(method, args, undefined, options?.onProgress, options?.signal);
    }
    async calculateEmiSchedule(inputs) {
        return workerOrchestrator.run("calculateEmiSchedule", [inputs]);
    }
    async generateHashes(text, algos, encoding, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateHashes", [text, algos, encoding], undefined, onProgress, abortSignal);
    }
    async generateFileHash(file, algo, encoding, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateFileHash", [file, algo, encoding], [file], onProgress, abortSignal);
    }
    async generateHmac(text, key, algo, encoding, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateHmac", [text, key, algo, encoding], undefined, onProgress, abortSignal);
    }
    async generateFileHmac(file, key, algo, encoding, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateFileHmac", [file, key, algo, encoding], [file], onProgress, abortSignal);
    }
    async getPdfPageCount(file) {
        return workerOrchestrator.dispatch("getPdfPageCount", [file]);
    }
    async exportPdfEditor(file, pagesState, annotations, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("exportPdfEditor", [file, pagesState, annotations], [file], onProgress, abortSignal, true, 2);
    }
    async rotatePdf(file, rotateAll, allAngle, pageAngles, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("rotatePdf", [file, rotateAll, allAngle, pageAngles], [file], onProgress, abortSignal, true, 2);
    }
    async watermarkPdf(file, options, onProgress, abortSignal) {
        const transfers = [file];
        if (options.imageBytes)
            transfers.push(options.imageBytes);
        return workerOrchestrator.dispatch("watermarkPdf", [file, options], transfers, onProgress, abortSignal, true, 2);
    }
    async mergePdfs(files, onProgress, abortSignal) {
        // Extract ArrayBuffers as transferables to avoid expensive structured cloning
        const transferables = files.filter((f) => f instanceof ArrayBuffer);
        // PDF merge is idempotent: safe to retry if worker crashes.
        return workerOrchestrator.dispatch("mergePdfs", [files], transferables.length > 0 ? transferables : undefined, onProgress, abortSignal, true, 2);
    }
    async compressPdf(file, level = 'medium', onProgress, abortSignal) {
        return workerOrchestrator.dispatch("compressPdf", [file, level], [file], onProgress, abortSignal, true, 2);
    }
    async splitPdf(file, splitAll, rangesStr, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("splitPdf", [file, splitAll, rangesStr], [file], onProgress, abortSignal, true, 2);
    }
    async convertImagesToPdf(images, pageSize, onProgress, abortSignal) {
        const buffers = images.map(i => i.buffer);
        return workerOrchestrator.dispatch("convertImagesToPdf", [images, pageSize], buffers, onProgress, abortSignal, true, 2);
    }
    async convertAudio(file, mimeType, targetFormat, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("convertAudio", [file, mimeType, targetFormat], [file], onProgress, abortSignal);
    }
    async ocrExtract(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("ocrExtract", [file, mimeType], [file], onProgress, abortSignal, true, 5);
    }
    async executeCanvasOperation(methodName, args) {
        const transferables = args.filter(a => a instanceof ImageBitmap || a instanceof ArrayBuffer);
        return workerOrchestrator.dispatch("executeCanvasOperation", [methodName, args], transferables);
    }
    async lockPdf(file, userPassword, ownerPassword, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("lockPdf", [file, userPassword, ownerPassword], [file], onProgress, abortSignal, true, 2);
    }
    async unlockPdf(file, password, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("unlockPdf", [file, password], [file], onProgress, abortSignal, true, 2);
    }
    async addPageNumbersToPdf(file, options, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("addPageNumbersToPdf", [file, options], [file], onProgress, abortSignal, true, 2);
    }
    async adjustPdfLayout(file, options, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("adjustPdfLayout", [file, options], [file], onProgress, abortSignal, true, 2);
    }
    async getPdfMetadata(file, abortSignal) {
        return workerOrchestrator.dispatch("getPdfMetadata", [file], [file], undefined, abortSignal, true, 2);
    }
    async setPdfMetadata(file, metadata, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("setPdfMetadata", [file, metadata], [file], onProgress, abortSignal, true, 2);
    }
    async getPdfBookmarks(file, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("getPdfBookmarks", [file], [file], onProgress, abortSignal, true, 2);
    }
    async extractPdfAttachments(file, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("extractPdfAttachments", [file], [file], onProgress, abortSignal, true, 2);
    }
    async extractTextFromPdf(file, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("extractTextFromPdf", [file], [file], onProgress, abortSignal, true, 2);
    }
    async compressImage(file, mimeType, format, quality, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("compressImage", [file, mimeType, format, quality], [file], onProgress, abortSignal, true, 2);
    }
    async resizeImage(file, width, height, mode, format, quality, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("resizeImage", [file, width, height, mode, format, quality], [file], onProgress, abortSignal, true, 2);
    }
    async removeBackground(file, bgColor, tolerance, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("removeBackground", [file, bgColor, tolerance], [file], onProgress, abortSignal, true, 2);
    }
    async minifyCode(code, lang, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("minifyCode", [code, lang], undefined, onProgress, abortSignal, true, 2);
    }
    async processJson(input, mode, indent, abortSignal) {
        return workerOrchestrator.dispatch("processJson", [input, mode, indent], undefined, undefined, abortSignal);
    }
    async computeDiff(textA, textB, ignoreWs = false, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("computeDiff", [textA, textB, ignoreWs], undefined, onProgress, abortSignal, true, 2);
    }
    async runZip(files, onProgress, abortSignal) {
        const transferList = Object.values(files).map(v => v.buffer);
        return workerOrchestrator.dispatch("createZip", [files], transferList, onProgress, abortSignal, true, 2);
    }
    async encodeMp3(left, right, sampleRate, onProgress, abortSignal) {
        const transfer = right ? [left.buffer, right.buffer] : [left.buffer];
        return workerOrchestrator.dispatch("encodeMp3", [left, right, sampleRate], transfer, onProgress, abortSignal, true, 3);
    }
    async encodeWav(channels, sampleRate, onProgress, abortSignal) {
        const transfers = channels.map(c => c.buffer);
        return workerOrchestrator.dispatch("encodeWav", [channels, sampleRate], transfers, onProgress, abortSignal, true, 3);
    }
    async createGif(frames, width, height, delay, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("createGif", [frames, width, height, delay], frames, onProgress, abortSignal, true, 3);
    }
    async checkGrammar(text, ignoredWords, tone, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("checkGrammar", [text, ignoredWords, tone], undefined, onProgress, abortSignal);
    }
    async applyImageFilter(file, mimeType, filter, intensity, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("applyImageFilter", [file, mimeType, filter, intensity], [file], onProgress, abortSignal);
    }
    async processBase64File(file, mimeType, action, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("processBase64File", [file, mimeType, action], [file], onProgress, abortSignal);
    }
    async watermarkImage(file, mimeType, options, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("watermarkImage", [file, mimeType, options], [file], onProgress, abortSignal);
    }
    async removeImageMetadata(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("removeImageMetadata", [file, mimeType], [file], onProgress, abortSignal);
    }
    async cropImageCenter(file, mimeType, width, height, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("cropImageCenter", [file, mimeType, width, height], [file], onProgress, abortSignal);
    }
    async computePerceptualHash(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("computePerceptualHash", [file, mimeType], [file], onProgress, abortSignal);
    }
    async rotateImageStandard(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("rotateImageStandard", [file, mimeType], [file], onProgress, abortSignal);
    }
    async generateSpriteSheet(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateSpriteSheet", [file, mimeType], [file], onProgress, abortSignal);
    }
    async optimizeSvg(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("optimizeSvg", [file, mimeType], [file], onProgress, abortSignal);
    }
    async generateHistogram(file, mimeType, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("generateHistogram", [file, mimeType], [file], onProgress, abortSignal);
    }
    async simulateColorBlindness(file, mimeType, type, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("simulateColorBlindness", [file, mimeType, type], [file], onProgress, abortSignal);
    }
    async parseMarkdown(text, abortSignal) {
        return workerOrchestrator.dispatch("parseMarkdown", [text], undefined, undefined, abortSignal);
    }
    async parseMarkdownToTipTap(text, abortSignal) {
        return workerOrchestrator.dispatch("parseMarkdownToTipTap", [text], undefined, undefined, abortSignal);
    }
    async parseLogs(logText, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("parseLogs", [logText], undefined, onProgress, abortSignal);
    }
    terminateAll() {
        workerOrchestrator.terminateAll();
    }
}
export const workerManager = new WorkerManager();
