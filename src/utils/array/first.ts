/**
 * returns the first element of an array.
 * @name first
 * @param {[]} array
 * @returns {[]} the first element of given array
 * @example
 * ```js
 *  first([1,2,3]) // => 1
 *  first([]) // => null
 * ```
 */
export function first<T>(array: T[]): T | null | undefined {
  if (array && array[0]) return array[0];
  return null;
}
