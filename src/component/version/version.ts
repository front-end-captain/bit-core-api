import semver from "semver";
import { InvalidVersion } from "./invalid-version";

export class Version {
  versionNum: string | null | undefined;
  latest: boolean;

  static LATEST_VERSION = "latest";

  constructor(versionNum: string | null | undefined, latest: boolean) {
    this.versionNum = versionNum;
    this.latest = latest;

    if (versionNum && latest) {
      throw new Error(`a component version cannot have both: version and "latest"`);
    }
  }

  toString() {
    if (!this.versionNum && this.latest) {
      return Version.LATEST_VERSION;
    }

    if (this.versionNum && !this.latest) {
      return this.versionNum.toString();
    }

    throw new InvalidVersion(this.versionNum);
  }

  isLaterThan(otherVersion: Version): boolean {
    if (!this.versionNum || this.versionNum === Version.LATEST_VERSION) {
      return true;
    }

    if (!otherVersion.versionNum || otherVersion.versionNum === Version.LATEST_VERSION) {
      return false;
    }

    return semver.gt(this.versionNum, otherVersion.versionNum);
  }
}
