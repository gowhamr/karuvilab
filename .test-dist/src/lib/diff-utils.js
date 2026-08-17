import { workerManager } from '@/src/workers/manager';
export async function computeDiff(textA, textB, onProgress) {
    return workerManager.computeDiff(textA, textB, false, onProgress);
}
export function generateDiffPatch(diff) {
    let patch = '';
    diff.forEach((line) => {
        if (line.type === 'added')
            patch += `+ ${line.text}\n`;
        else if (line.type === 'removed')
            patch += `- ${line.text}\n`;
        else
            patch += `  ${line.text}\n`;
    });
    return patch;
}
export function getDiffStats(diff) {
    return {
        added: diff.filter((l) => l.type === 'added').length,
        removed: diff.filter((l) => l.type === 'removed').length,
        equal: diff.filter((l) => l.type === 'equal').length,
    };
}
