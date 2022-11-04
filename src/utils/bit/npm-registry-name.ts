import { getSync } from "../../global-config";
import { CFG_REGISTRY_DOMAIN_PREFIX, DEFAULT_REGISTRY_DOMAIN_PREFIX } from "../../constants";

export function npmRegistryName(): string {
  return getSync(CFG_REGISTRY_DOMAIN_PREFIX) || DEFAULT_REGISTRY_DOMAIN_PREFIX;
}
