import { BitError } from "../../error";

export class ActionNotFound extends BitError {
  code: number;

  constructor(public name: string) {
    super(
      `action ${name} is unknown, it might happen when your client version is more recent than the server, your best bet is to update the server`,
    );
    this.code = 135;
  }
}
