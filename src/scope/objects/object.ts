import { NULL_BYTE } from "../../constants";
import { deflate, sha1 } from "../../utils";
import { Ref } from "./ref";

export class BitObject {
  validateBeforePersist = true; // validate the object before persisting
  id(): string | Buffer {
    throw new Error("id() was not implemented...");
  }

  toBuffer(): Buffer {
    throw new Error("toBuffer() was not implemented...");
  }

  refs(): Ref[] {
    return [];
  }

  getType(): string {
    return this.constructor.name;
  }

  getHeader(buffer: Buffer): string {
    return `${this.getType()} ${this.hash().toString()} ${buffer.toString().length}${NULL_BYTE}`;
  }

  /**
   * indexing method
   */
  hash(): Ref {
    // console.log(`sha ${sha1(this.id())}, id ${this.id()}`); // uncomment when debugging hash issues
    return new Ref(BitObject.makeHash(this.id()));
  }

  compress(): Promise<Buffer> {
    return deflate(this.serialize());
  }

  serialize(): Buffer {
    const buffer = this.toBuffer();
    return Buffer.concat([Buffer.from(this.getHeader(buffer)), buffer]);
  }

  static makeHash(str: string | Buffer): string {
    return sha1(str);
  }
}
