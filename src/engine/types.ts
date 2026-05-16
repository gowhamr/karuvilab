export type WorkerDomain = 'core' | 'crypto' | 'pdf' | 'image' | 'diff' | 'dev';

export interface TaskPriority {
  level: 'high' | 'normal' | 'low';
  weight: number;
}

export interface EngineTask<T = any> {
  id: string;
  domain: WorkerDomain;
  method: string;
  args: any[];
  transferables?: Transferable[];
  priority: TaskPriority;
  resolve: (val: T) => void;
  reject: (err: any) => void;
  onProgress?: (progress: any) => void;
  abortSignal?: AbortSignal;
}

export interface EngineConfig {
  maxWorkers: number;
  memoryLimitMB: number;
  domainRouting: Record<WorkerDomain, string>; // Maps domain to worker URL
}
