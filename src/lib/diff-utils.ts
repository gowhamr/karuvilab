import { workerManager } from '@/src/workers/manager';
import { DiffLine } from '@/src/workers/types';

export async function computeDiff(
  textA: string, 
  textB: string, 
  onProgress?: (p: { percent: number }) => void
): Promise<DiffLine[]> {
  return workerManager.computeDiff(textA, textB, false, onProgress as any);
}

export function generateDiffPatch(diff: DiffLine[]): string {
  let patch = '';
  diff.forEach((line) => {
    if (line.type === 'added') patch += `+ ${line.text}\n`;
    else if (line.type === 'removed') patch += `- ${line.text}\n`;
    else patch += `  ${line.text}\n`;
  });
  return patch;
}

export function getDiffStats(diff: DiffLine[]) {
  return {
    added: diff.filter((l) => l.type === 'added').length,
    removed: diff.filter((l) => l.type === 'removed').length,
    equal: diff.filter((l) => l.type === 'equal').length,
  };
}
