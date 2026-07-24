interface WorkerAPI {
  foo(a: string, b: number): void;
  bar(c: boolean): void;
}
const api: Partial<WorkerAPI> = {
  foo(a, b) {
    console.log(a, b);
  }
};
