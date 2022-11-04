/**
 * Cast a `Map` to a plain object.
 * Keys are being casted by invoking `toString` on each key.
 * @name mapToObject
 * @param {Map} map to cast
 * @returns {*} plain object
 * @example
 * ```js
 *  mapToObject(new Map([['key', 'val'], ['foo', 'bar']]));
 *  // => { key: 'val', foo: 'bar' }
 * ```
 */
export function mapToObject(map: Map<string, string>): { [key: string]: string } {
  const object: { [key: string]: string } = {};
  map.forEach((val, key) => {
    object[key.toString()] = val;
  });
  return object;
}
