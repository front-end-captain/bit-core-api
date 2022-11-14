export class PathsNotExist extends Error {
  path: string;
  code: string;

  constructor(path: string) {
    super();

    this.path = path;
    this.code = "PathNotExist";
  }
}
