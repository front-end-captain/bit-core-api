import { AbstractError } from "../../error";

export class HookNotExists extends AbstractError {
  hookName: string;

  constructor(hookName: string) {
    super();
    this.hookName = hookName;
  }
}
