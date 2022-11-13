import { describe, expect, it } from "vitest";
import { Version } from "./version";

describe("Version", () => {
  describe("toString()", () => {
    it("should return latest", () => {
      const version = new Version(null, true);
      expect(version.toString()).equal("latest");
    });

    it("should return concrete version number", () => {
      const version = new Version("12", false);
      expect(version.toString()).to.equal("12");
    });

    it("should throw an invalid version exception", () => {
      const version = new Version(null, false);
      expect(() => {
        version.toString();
      }).to.throw();
    });
  });
});
