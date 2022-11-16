import { MissingAbortFn } from "./exceptions";

export class AbortablePromise<T> extends Promise<T> {
  constructor(
    promiseFn: (resolve: (data: T) => void, reject: (err: Error) => void) => void,
    private abortFn?: () => void,
  ) {
    super(promiseFn);
  }

  abort() {
    if (this.abortFn) return this.abortFn();
    throw new MissingAbortFn();
  }
}
