import { expect, describe, it } from "vitest";

import { VersionParser } from "./version-parser";
import { InvalidVersion } from "./invalid-version";

describe("VersionParser", () => {
  it("should return latest version representation", () => {
    const version = VersionParser.parser("latest");
    expect(version.latest).to.equal(true);
    expect(version.versionNum).to.equal(null);
  });

  it("should throw invalid version", () => {
    const version = () => VersionParser.parser("$1");
    expect(version).to.throw(InvalidVersion);
  });

  it("should return a concrete version", () => {
    const version = VersionParser.parser("0.0.1");
    expect(version.latest).to.equal(false);
    expect(version.versionNum).to.equal("0.0.1");
  });

  it("should parse given version as latest", () => {
    const version = VersionParser.parser("latest");
    expect(version.versionNum).to.equal(null);
    expect(version.latest).to.equal(true);
  });
});
