import { ExternalError } from "../../error";

export class ResolutionException extends ExternalError {
  filePath: string;
  showDoctorMessage: boolean;
  constructor(originalError: Error, filePath: string) {
    super(originalError);
    this.filePath = filePath;
    this.showDoctorMessage = true;
  }
}
