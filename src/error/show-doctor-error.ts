import { GeneralError } from "./general-error";

export class ShowDoctorError extends GeneralError {
  showDoctorMessage: boolean;

  constructor(msg: string) {
    super(msg);
    this.showDoctorMessage = true;
  }
}
