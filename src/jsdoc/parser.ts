import fs from "fs-extra";
import Vinyl from "vinyl";
import { ComponentFsCache } from "../consumer/component/component-fs-cache";
import { PathOsBased } from "../utils/path";
import { parse as jsDocParse } from "./jsdoc";
import { parse as reactParse } from "./react";
import { Doclet } from "./types";

export async function parse(file: Vinyl, componentFsCache: ComponentFsCache): Promise<Doclet[]> {
  const docsFromCache = await componentFsCache.getDocsFromCache(file.path);
  if (docsFromCache && docsFromCache.timestamp) {
    const stat = await fs.stat(file.path);
    const wasFileChanged = stat.mtimeMs > docsFromCache.timestamp;
    if (!wasFileChanged) {
      return JSON.parse(docsFromCache.data);
    }
  }

  if (file.contents) {
    const results = await parseFile(file.contents.toString(), file.relative);
    await componentFsCache.saveDocsInCache(file.path, results);
    return results;
  }
  return [];
}

async function parseFile(data: string, filePath: PathOsBased): Promise<Doclet[]> {
  const reactDocs = await reactParse(data, filePath);
  if (reactDocs && Object.keys(reactDocs).length > 0) {
    return reactDocs;
  }
  return jsDocParse(data, filePath);
}
