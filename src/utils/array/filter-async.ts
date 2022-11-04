export function filterAsync<T>(array: T[], filter: (item: T) => T): Promise<T[]> {
  return Promise.all(array.map((entry) => filter(entry))).then((results) =>
    array.filter(() => results.shift()),
  );
}
