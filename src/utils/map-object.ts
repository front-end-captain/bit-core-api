export type Iteratee = (val: string | boolean | undefined, key: string) => string | undefined;

export function mapObject(
  obj: Map<string, string | boolean>,
  iteratee: Iteratee = () => undefined,
) {
  const keys = Object.keys(obj);
  const mappedObject: Record<string, string | undefined> = {};

  keys.forEach((key) => {
    mappedObject[key] = iteratee(obj.get(key), key);
  });

  return mappedObject;
}
