import { AbstractError } from "../../error";

export class HeadNotFound extends AbstractError {
  id: string;
  headHash: string;

  constructor(id: string, headHash: string) {
    super();
    this.id = id;
    this.headHash = headHash;
  }
}
