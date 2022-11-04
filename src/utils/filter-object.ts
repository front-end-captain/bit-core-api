import { forEach } from "./object/foreach";

export function filterObject(
  obj: Record<string, unknown>,
  fn: (val: unknown, key: string) => boolean,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  forEach(obj, (val, key) => {
    if (fn(val, key)) newObj[key] = val;
  });
  return newObj;
}
