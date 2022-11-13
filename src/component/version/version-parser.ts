import semver from "semver";
import { InvalidVersion } from "./invalid-version";
import { Version } from "./version";

export class VersionParser {
  static HASH_SIZE = 40;

  static isLatest(versionStr: string): boolean {
    return versionStr === Version.LATEST_VERSION;
  }

  static isSemverValid(versionStr: string) {
    return semver.valid(versionStr);
  }

  static returnSemver(versionStr: string): Version {
    return new Version(versionStr, false);
  }

  static returnLatest(): Version {
    return new Version(null, true);
  }

  static returnSnap(hash: string): Version {
    return new Version(hash, false);
  }

  static isHash(str: string | null | undefined): boolean {
    return typeof str === "string" && str.length === VersionParser.HASH_SIZE && !semver.valid(str);
  }

  /**
   * a component version can be a tag (semver) or a snap (hash)
   */
  static isTag(str: string | null | undefined): boolean {
    return !VersionParser.isHash(str);
  }

  /**
   * a component version can be a tag (semver) or a snap (hash)
   */
  static isSnap(str: string | null | undefined): boolean {
    return VersionParser.isHash(str);
  }

  static parser(versionStr: string | null | undefined): Version {
    if (!versionStr) return VersionParser.returnLatest();
    if (VersionParser.isLatest(versionStr)) return VersionParser.returnLatest();
    if (VersionParser.isSemverValid(versionStr)) return VersionParser.returnSemver(versionStr);
    if (VersionParser.isHash(versionStr)) return VersionParser.returnSnap(versionStr);

    throw new InvalidVersion(versionStr.toString());
  }
}
