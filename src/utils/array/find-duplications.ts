import * as R from "ramda";

export function findDuplications<T>(arr: T[]): T[] {
  const uniq: T[] = R.uniq(arr);
  if (uniq.length === arr.length) {
    return []; // no dup
  }
  return uniq.filter((u) => arr.filter((a) => a === u).length > 1);
}
