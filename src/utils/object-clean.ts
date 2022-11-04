import { forEach } from "./object/foreach";

/**
 * Cleans all object's properties that contains a falsy value
 * and returns a new object without them.
 * @name clean
 * @param {object} obj object to clean
 * @returns {object}
 * @example new cleaned object
 * ```js
 *  clean({ foo: null, bar: 'foo' }) // => { bar: 'foo' }
 * ```
 */
export function clean(obj: Record<string, unknown>) {
  const newObj: Record<string, unknown> = {};

  forEach(obj, (val, key) => {
    if (!val) return;
    newObj[key] = val;
  });

  return newObj;
}
