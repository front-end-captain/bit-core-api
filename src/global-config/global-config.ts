import gitconfig from "gitconfig";
import * as R from "ramda";

import { BASE_DOCS_DOMAIN, ENV_VARIABLE_CONFIG_PREFIX } from "../constants";
import { GeneralError } from "../error/general-error";
import { Config } from "./config";

export function set(key: string, val: string): Promise<Config> {
  if (!key || !val) {
    throw new GeneralError(
      `missing a configuration key and value. https://${BASE_DOCS_DOMAIN}/config/bit-config`,
    );
  }
  return Config.load().then((config) => {
    config.set(key, val);
    invalidateCache();
    return config.write().then(() => config);
  });
}

export function setSync(key: string, val: string | boolean): Config {
  const config = Config.loadSync();
  config.set(key, val);
  invalidateCache();
  config.writeSync();
  return config;
}

export function del(key: string): Promise<Config> {
  return Config.load().then((config) => {
    config.delete(key);
    invalidateCache();
    return config.write().then(() => config);
  });
}

export function delSync(key: string): Config {
  const config = Config.loadSync();
  config.delete(key);
  config.writeSync();
  invalidateCache();
  return config;
}

export async function get(key: string): Promise<string | boolean | undefined> {
  const getConfigObject = async () => {
    const configFromCache = cache().get();
    if (configFromCache) return configFromCache;
    const config = await Config.load();
    cache().set(config);
    return config;
  };
  const envVarName = toEnvVariableName(key);
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  const config = await getConfigObject();
  const val = config ? config.get(key) : undefined;
  if (!R.isNil(val)) return val;
  try {
    const gitVal = await gitconfig.get(key);
    return gitVal;
  } catch (err: unknown) {
    return undefined;
  }
}

export function getSync(key: string): string | boolean | undefined {
  const getConfigObject = () => {
    const configFromCache = cache().get();
    if (configFromCache) return configFromCache;
    const config = Config.loadSync();
    cache().set(config);
    return config;
  };
  const envVarName = toEnvVariableName(key);
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  const config = getConfigObject();
  const val = config ? config.get(key) : undefined;
  if (!R.isNil(val)) return val;
  const gitConfigCache = gitCache().get() || {};
  if (key in gitConfigCache && val) {
    return gitConfigCache[val];
  }
  try {
    const gitVal = gitconfig.get.sync(key);
    gitConfigCache[key] = gitVal;
  } catch (err: unknown) {
    gitConfigCache[key] = undefined;
  }
  gitCache().set(gitConfigCache);
  return gitConfigCache[key];
}

export function list(): Promise<Record<string, string | undefined>> {
  return Config.load().then((config) => config.toPlainObject());
}

export function listSync(): Record<string, string | undefined> {
  const config = Config.loadSync();
  return config.toPlainObject();
}

export function getNumberFromConfig(name: string): number | null {
  const fromConfig = getSync(name);
  if (!fromConfig) return null;
  const num = Number(fromConfig);
  if (Number.isNaN(num)) {
    throw new Error(`config of "${name}" is invalid. Expected number, got "${fromConfig}"`);
  }
  return num;
}

interface Cache {
  (): {
    get(): Config;
    set(config: Config | null): void;
  };
  config: Config | null;
}

const cache: Cache = () => {
  return {
    get: () => {
      return cache.config as Config;
    },
    set: (config) => {
      cache.config = config;
    },
  };
};
cache.config = null;

interface GitCache {
  (): {
    get(): Record<string, string | undefined>;
    set(config: Record<string, string | undefined> | null): void;
  };
  config: Record<string, string | undefined> | null;
}

const gitCache: GitCache = () => {
  return {
    get: () => {
      return gitCache.config as Record<string, string>;
    },
    set: (config: Record<string, string | undefined>) => {
      gitCache.config = config;
    },
  };
};
gitCache.config = null;

function invalidateCache() {
  cache().set(null);
}

function toEnvVariableName(configName: string): string {
  return `${ENV_VARIABLE_CONFIG_PREFIX}${configName.replace(/\./g, "_").toUpperCase()}`;
}
