declare module "gitconfig" {
  interface Get {
    (key: string): Promise<string | undefined>;
    sync: (key: string) => string | undefined;
  }
  interface M {
    get: Get;
    fetchRepo: () => Array<string> | string;
  }
  const m: M = {};
  export default m;
}

declare module "uid-number" {
  type UidNumber = (
    uid: null | number | string,
    gid: null | number | string,
    cb: (err: Error, uid: number, gid: number) => void,
  ) => void;

  const m: UidNumber = {};
  export default m;
}
