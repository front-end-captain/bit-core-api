import { AbstractError } from "../../error";

export class VersionAlreadyExists extends AbstractError {
  version: string;
  componentId: string;
  showDoctorMessage: boolean;

  constructor(version: string, componentId: string) {
    super();
    this.version = version;
    this.componentId = componentId;
    this.showDoctorMessage = true;
  }
}
