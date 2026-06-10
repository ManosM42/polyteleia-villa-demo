// Browser stub — AsyncLocalStorage is server-only and never runs in the browser.
// This mock safely no-ops it so Vite can bundle without errors.
export class AsyncLocalStorage<T> {
  run<R>(_store: T, callback: (...args: unknown[]) => R): R {
    return callback();
  }
  getStore(): T | undefined {
    return undefined;
  }
}