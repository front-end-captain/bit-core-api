import fs from "fs-extra";

export function outputJsonFile(file: string, data: Record<string, unknown>): void {
  try {
    fs.ensureFileSync(file);
    return fs.outputJsonSync(file, data);
  } catch (e: unknown) {
    // eslint-disable-next-line
    console.error(`failed to write output to file:${e}`);
  }
}
