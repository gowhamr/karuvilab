export class MemoryMonitor {
  private limitMB: number;

  constructor(limitMB: number = 512) {
    this.limitMB = limitMB;
  }

  checkMemoryPressure(): 'safe' | 'warning' | 'critical' {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const mem = (performance as any).memory;
      const usedMB = mem.usedJSHeapSize / (1024 * 1024);
      if (usedMB > this.limitMB * 0.9) return 'critical';
      if (usedMB > this.limitMB * 0.7) return 'warning';
    }
    return 'safe';
  }
}
