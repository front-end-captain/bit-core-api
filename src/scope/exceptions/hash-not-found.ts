import { AbstractError } from "../../error";

export class HashNotFound extends AbstractError {
  hash: string;
  showDoctorMessage: boolean;

  constructor(hash: string) {
    super();
    this.hash = hash;
    this.showDoctorMessage = true;
  }
}
