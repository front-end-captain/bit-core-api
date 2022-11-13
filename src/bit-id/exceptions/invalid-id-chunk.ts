import { BitError } from "../../error";

export class InvalidIdChunk extends BitError {
  id: string;

  constructor(id: string) {
    super(
      `error: "${id}" is invalid, component IDs can only contain alphanumeric, lowercase characters, and the following ["-", "_", "$", "!"]`,
    );
    this.id = id;
  }
}
