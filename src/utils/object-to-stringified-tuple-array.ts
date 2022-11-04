import { forEach } from "./object/foreach";

export function objectToStringifiedTupleArray(
  obj: Record<string, string | number | Record<string, unknown>>,
): [string, string | number][] {
  const arr: [string, string | number][] = [];
  forEach(obj, (val, key) => {
    arr.push([key, typeof val === "object" ? JSON.stringify(val) : val]);
  });
  return arr;
}
