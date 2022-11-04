import Module from "module";

import { filterObject } from "./filter-object";

// remove any cached module path for a module name (Module._pathCache)
export function removeFromRequireCache(currentRequestName: string) {
  // @ts-ignore
  Module._pathCache = filterObject(Module._pathCache, (_val, key) => {
    const cachedRequestName = JSON.parse(key).request;
    return currentRequestName !== cachedRequestName;
  });
}
