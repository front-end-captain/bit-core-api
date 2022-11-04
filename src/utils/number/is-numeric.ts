/**
 * determines whether `val` is a numeric value
 * @name isNumeric
 * @param {*} val
 * @return {boolean}
 */
export function isNumeric(val: unknown) {
  if (typeof val !== "string") {
    return false;
  }
  return !Number.isNaN(parseFloat(val)) && Number.isFinite(val);
}
