import fs from "fs-extra";

import { GeneralError } from "../error/general-error";

export function isDir(userPath: string): boolean {
  let stat;
  try {
    stat = fs.lstatSync(userPath);
  } catch (_err) {
    throw new GeneralError(`The path ${userPath} doesn't exist`);
  }
  return stat.isDirectory();
}
