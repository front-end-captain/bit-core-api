/**
 * Sort an object.
 */
export function sortObject(obj: Record<string, unknown>) {
  return Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {} as Record<string, unknown>);
}
