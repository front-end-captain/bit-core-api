import { expect, describe, it } from "vitest";
import { Buffer } from "node:buffer";

import { replaceBuffer } from "../buffer/replace-buffer-non-recursive";

describe("ReplaceBuffer", () => {
  it("should replace an old string with a new string", () => {
    const buffer = Buffer.from("hello world");
    expect(replaceBuffer(buffer, "world", "david").toString()).to.equal("hello david");
  });
  it("should not change the buffer if nothing found", () => {
    const buffer = Buffer.from("hello world!");
    expect(replaceBuffer(buffer, "non", "exist").toString()).to.equal("hello world!");
  });
  it("should replace multiple occurrences", () => {
    const buffer = Buffer.from("hello world");
    expect(replaceBuffer(buffer, "l", "!").toString()).to.equal("he!!o wor!d");
  });
  it("should return a Buffer instance", () => {
    const buffer = Buffer.from("hello world");
    expect(replaceBuffer(buffer, "l", "!")).to.be.instanceof(Buffer);
  });
  it("should throw an error if non-buffer argument was passed", () => {
    try {
      replaceBuffer(Buffer.from("hello world", "utf-8"), "l", "!");
    } catch (err: unknown) {
      expect((err as Error).message).to.equal(
        "replaceBuffer expect to get Buffer, got string instead",
      );
    }
  });
});
