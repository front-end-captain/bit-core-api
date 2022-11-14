import fs from "fs";
import ini from "ini";
import path from "path";
import os from "os";

import { DEFAULT_BINDINGS_PREFIX } from "../constants";
import { PathToNpmrcNotExist, WriteToNpmrcError } from "./exceptions";

type ConfigDataItemValue = string | boolean | number;
type ConfigDataItem = Record<string, ConfigDataItemValue | Record<string, ConfigDataItemValue>>;

function findrc(pathToNpmrc: string) {
  let userNpmrc = path.join(os.homedir(), ".npmrc");
  if (pathToNpmrc) {
    if (!fs.existsSync(pathToNpmrc)) throw new PathToNpmrcNotExist(pathToNpmrc);
    const stats = fs.statSync(pathToNpmrc);
    if (stats.isFile()) userNpmrc = pathToNpmrc;
    else userNpmrc = path.join(pathToNpmrc, ".npmrc");
  }
  return userNpmrc;
}

function mergeOrCreateConfig(
  token: string,
  url: string,
  config: ConfigDataItem = {},
): ConfigDataItem {
  const strippedUrl = url.replace(/(^\w+:|^)\/\//, "");

  let iniReg = config[`${DEFAULT_BINDINGS_PREFIX}:registry`];
  let iniToken = config[`//${strippedUrl}/:_authToken`];

  if (!iniReg) {
    config[`${DEFAULT_BINDINGS_PREFIX}:registry`] = url;
  } else {
    iniReg = url;
  }

  if (!iniToken) {
    config[`//${strippedUrl}/:_authToken`] = token;
  } else {
    iniToken = token;
  }
  return config;
}

export function npmLogin(token: string, pathToNpmrc: string, url: string): string {
  const npmrcPath = findrc(pathToNpmrc);
  const npmrcConfig = fs.existsSync(npmrcPath)
    ? mergeOrCreateConfig(token, url, ini.parse(fs.readFileSync(npmrcPath, "utf-8")))
    : mergeOrCreateConfig(token, url);

  try {
    fs.writeFileSync(npmrcPath, ini.stringify(npmrcConfig));
  } catch (_err) {
    throw new WriteToNpmrcError(npmrcPath);
  }

  return npmrcPath;
}
