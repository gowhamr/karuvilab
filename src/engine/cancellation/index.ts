import { EngineTask } from '../types';

export class CancellationController {
  private taskTokens = new Map<string, AbortController>();

  register(taskId: string): AbortController {
    const controller = new AbortController();
    this.taskTokens.set(taskId, controller);
    return controller;
  }

  abort(taskId: string) {
    const controller = this.taskTokens.get(taskId);
    if (controller) {
      controller.abort();
      this.taskTokens.delete(taskId);
    }
  }

  cleanup(taskId: string) {
    this.taskTokens.delete(taskId);
  }
}
