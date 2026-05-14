import * as Comlink from 'comlink';

export type DiffType = 'added' | 'removed' | 'equal';

export interface DiffLine {
  type: DiffType;
  text: string;
  lineA?: number;
  lineB?: number;
}

const api = {
  computeDiff(textA: string, textB: string): DiffLine[] {
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);
    const m = linesA.length;
    const n = linesB.length;

    // Simple LCS-based Diff
    const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (linesA[i - 1] === linesB[j - 1]) {
          dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        } else {
          dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
        }
      }
    }

    const result: DiffLine[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        result.unshift({ type: 'equal', text: linesA[i - 1]!, lineA: i, lineB: j });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
        result.unshift({ type: 'added', text: linesB[j - 1]!, lineB: j });
        j--;
      } else {
        result.unshift({ type: 'removed', text: linesA[i - 1]!, lineA: i });
        i--;
      }
    }
    
    return result;
  }
};

Comlink.expose(api);
export type DiffWorkerAPI = typeof api;
