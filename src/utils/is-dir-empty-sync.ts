import { readDirSyncIgnoreDsStore } from "./fs/read-dir-ignore-ds-store";

export function isDirEmptySync(dirPath: string): boolean {
  return !readDirSyncIgnoreDsStore(dirPath).length;
}
