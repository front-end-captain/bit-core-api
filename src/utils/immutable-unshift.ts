export function immutableUnshift<T>(arr: Array<T>, newEntry: T): Array<T> {
  return [newEntry, ...arr];
}
