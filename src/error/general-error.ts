import { AbstractError } from "./abstract-error";

export class GeneralError extends AbstractError {
  msg: string;

  constructor(msg: string) {
    super();
    this.msg = msg;
  }
}
