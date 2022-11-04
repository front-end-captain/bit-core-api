import * as path from "path";

/**
 * parse given dir path
 * @param {*} dirPath
 */
export function parseDirPath(dirPath: string) {
  return path.parse(dirPath).dir.split(path.delimiter);
}
