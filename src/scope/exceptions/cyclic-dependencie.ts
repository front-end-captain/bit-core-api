import { AbstractError } from "../../error";

export class CyclicDependencies extends AbstractError {
  msg: string;
  constructor(msg: string) {
    super();
    this.msg = msg;
  }
}
