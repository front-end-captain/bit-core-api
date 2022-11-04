/**
 * determiens whether `val` is a number.
 * @name isNumber
 * @param {*} val
 * @returns {boolean}
 * @example
 * ```js
 *  isNumber('') // => false
 * ```
 */
export function isNumber(val: unknown): val is number {
  return typeof val === "number";
}
