export type Iteratee = (val: any, key: any) => any;

export function mapObject(
  obj: Map<string, string | boolean>,
  iteratee: Iteratee = () => undefined,
) {
  const keys = Object.keys(obj);
  const mappedObject: Record<string, string> = {};

  keys.forEach((key) => {
    mappedObject[key] = iteratee(obj.get(key), key);
  });

  return mappedObject;
}
