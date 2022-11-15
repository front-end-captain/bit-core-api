import { AbstractError } from "../../error";

export class HookAlreadyExists extends AbstractError {
  hookName: string;

  constructor(hookName: string) {
    super();
    this.hookName = hookName;
  }
}
