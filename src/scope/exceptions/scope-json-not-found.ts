import { AbstractError } from "../../error";

export class ScopeJsonNotFound extends AbstractError {
  path: string;
  showDoctorMessage: boolean;

  constructor(path: string) {
    super();
    this.path = path;
    this.showDoctorMessage = true;
  }
}
