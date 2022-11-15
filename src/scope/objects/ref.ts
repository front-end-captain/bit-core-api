export class Ref {
  hash: string;

  constructor(hash: string) {
    if (!hash) throw new Error("failed creating a Ref object, the hash argument is empty");
    this.hash = hash;
  }

  toString() {
    return this.hash;
  }

  toShortString() {
    return this.hash.substring(0, 9);
  }

  isEqual(ref: Ref): boolean {
    return this.toString() === ref.toString();
  }

  clone() {
    return new Ref(this.hash);
  }

  static from(hash: string): Ref {
    return new Ref(hash);
  }
}
