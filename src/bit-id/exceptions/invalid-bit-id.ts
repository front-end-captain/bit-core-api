import { BitError } from "../../error";

export class InvalidBitId extends BitError {
  id: string;

  constructor(id: string) {
    super(
      `error: component ID "${id}" is invalid, please use the following format: [scope]/<name>`,
    );
    this.id = id;
  }
}
