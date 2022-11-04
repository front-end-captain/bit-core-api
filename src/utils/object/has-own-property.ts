/**
 * Determines whether the object has the specified property.
 * @name hasOwnProperty
 * @param {object} obj
 * @param {string|number} prop property to test
 * @returns {boolean}
 * @example
 * ```js
 *  hasOwnProperty({foo: 'bar'}, 'foo') // => true
 *  hasOwnProperty({foo: 'bar'}, 'bar') // => false
 * ```
 */
export function hasOwnProperty(obj: Record<string, unknown>, prop: string | number) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
