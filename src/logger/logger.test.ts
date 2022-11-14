import { expect, describe, it } from "vitest";
import winston from "winston";

import { getFormat } from "./winston-logger";

describe("winston-logger", () => {
  describe("baseFileTransportOpts", () => {
    it("should print metadata", () => {
      const myFormat = getFormat();
      const result = myFormat.transform({
        [Symbol.for("level")]: "error",
        level: "error",
        message: "my message",
        metadata: { foo: "bar" },
      }) as winston.Logform.TransformableInfo & Record<PropertyKey, string>;
      expect(result[Symbol.for("message")]).to.have.string('"foo": "bar"');
    });
    it("should not throw when the metadata object has a circular structure", () => {
      const foo: { bar?: Record<string, unknown> } = {};
      const bar = { foo };
      foo.bar = bar;
      const metadata = { foo };
      const myFormat = getFormat();
      const result = myFormat.transform({
        [Symbol.for("level")]: "error",
        level: "error",
        message: "my message",
        metadata,
      }) as winston.Logform.TransformableInfo & Record<PropertyKey, string>;
      expect(result[Symbol.for("message")]).to.have.string(
        "logging failed to stringify the metadata Json",
      );
      expect(result[Symbol.for("message")]).to.have.string(
        "error: Converting circular structure to JSON",
      );
    });
  });
});
