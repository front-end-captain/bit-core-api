import { BitError } from "../../error";
import chalk from "chalk";

export class ParentNotFound extends BitError {
  constructor(public id: string, public versionHash: string, public parentHash: string) {
    super(
      `component ${chalk.bold(
        id,
      )} missing data. parent ${parentHash} of version ${versionHash} was not found.`,
    );
  }
}
