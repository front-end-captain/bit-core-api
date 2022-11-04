import fs from "fs-extra";
import { isAbsolute } from "path";

import { GeneralError } from "../../error/general-error";
import type { PathOsBasedAbsolute } from "../path";

export default function moveSync(
  src: PathOsBasedAbsolute,
  dest: PathOsBasedAbsolute,
  options?: fs.MoveOptions,
) {
  if (!isAbsolute(src) || !isAbsolute(dest)) {
    throw new Error(`moveSync, src and dest must be absolute. Got src "${src}", dest "${dest}"`);
  }
  try {
    fs.moveSync(src, dest, options);
  } catch (_err: unknown) {
    const err = _err as Error;
    if (err.message.includes("Cannot move") && err.message.includes("into itself")) {
      throw new GeneralError(`unable to move '${src}' into itself '${dest}'`);
    }
    throw err;
  }
}
