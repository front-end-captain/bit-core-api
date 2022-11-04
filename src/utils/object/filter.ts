import { forEach } from "./foreach";

/**
 * create a new array with all elements that pass the test implemented by the provided function.
 * @name filter
 * @param {object} obj object or array to iterate
 * @param {function} cb callback function to invoke
 * @example
 * ```js
 *  filter({ a: 1, b: 2, c: 3 }, (val, key) => val === 1) // => { a: 1 }
 * ```
 */
export function filter(obj: Record<string, unknown>, cb: (val: unknown, key: string) => boolean) {
  const newObj: Record<string, unknown> = {};

  forEach(obj, (val, key) => {
    if (cb(val, key)) newObj[key] = val;
  });

  return obj;
}
