import fs from "fs-extra";

import { isDirEmpty } from "./is-dir-empty";

export async function removeEmptyDir(dirPath: string): Promise<boolean> {
  let isEmpty: boolean;
  try {
    isEmpty = await isDirEmpty(dirPath);
  } catch (_err: unknown) {
    const err = _err as Error & { code: string };
    if (err.code === "ENOENT") return false;
    throw err;
  }
  if (isEmpty) {
    // logger.info(`remove-empty-dir, deleting ${dirPath}`);
    await fs.remove(dirPath);
    return true;
  }
  return false;
}
