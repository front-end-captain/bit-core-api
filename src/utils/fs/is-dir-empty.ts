import { readDirIgnoreDsStore } from "./read-dir-ignore-ds-store";

export async function isDirEmpty(dirPath: string): Promise<boolean> {
  const files = await readDirIgnoreDsStore(dirPath);
  return !files.length;
}
