import os from "os";

const HOME_SIGN = "~";

export function resolveHomePath(relPath: string) {
  if (relPath.startsWith(HOME_SIGN)) {
    return relPath.replace(HOME_SIGN, os.homedir());
  }

  return relPath;
}
