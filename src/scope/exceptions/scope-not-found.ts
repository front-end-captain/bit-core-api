import { AbstractError } from "../../error";

export class ScopeNotFound extends AbstractError {
  scopePath: string;
  constructor(scopePath: string) {
    super();
    this.scopePath = scopePath;
  }
}
