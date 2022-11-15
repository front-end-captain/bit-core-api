import { AbstractError } from "./abstract-error";

export class ExternalError extends AbstractError {
  originalError: Error;
  constructor(originalError: Error) {
    super();
    this.originalError = originalError;
  }
}
