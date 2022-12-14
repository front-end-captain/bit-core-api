// the '.' can be in the middle, not at the beginning and not at the end and only once.
const validationRegExp = /^[$\-_!a-z0-9]+[.]?[$\-_!a-z0-9]+$/;

export function isValidScopeName(val: unknown): boolean {
  if (typeof val !== "string") return false;
  return validationRegExp.test(val);
}
