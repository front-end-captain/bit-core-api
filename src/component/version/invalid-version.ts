import { BitError } from "../../error";

export class InvalidVersion extends BitError {
  constructor(version?: string | null) {
    super(
      `error: version ${
        version || "(empty)"
      } is not a valid semantic version. learn more: https://semver.org`,
    );
  }
}
