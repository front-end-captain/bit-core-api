import PQueue from "p-queue";

type Task<TaskResultType> = (() => PromiseLike<TaskResultType>) | (() => TaskResultType);

export class Queue<TaskResultType> {
  private queue: PQueue;

  constructor(public concurrency = 5, public autoStart = true) {
    this.queue = new PQueue({ concurrency, autoStart });
  }
  addAll(fns: Array<() => TaskResultType>): Promise<TaskResultType[]> {
    return this.queue.addAll(fns);
  }
  add(fn: Task<TaskResultType>, priority: number): Promise<TaskResultType> {
    return this.queue.add(fn, { priority });
  }
  pause(): void {
    this.queue.pause();
  }
  size(): number {
    return this.queue.size;
  }
  onEmpty(): Promise<void> {
    return this.queue.onEmpty();
  }
  onIdle(): Promise<void> {
    return this.queue.onIdle();
  }
}
