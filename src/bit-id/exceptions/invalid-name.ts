import { BitError } from "../../error";

export class InvalidName extends BitError {
  componentName: string;

  constructor(componentName: string) {
    super(
      `error: "${componentName}" is invalid, component names can only contain alphanumeric, lowercase characters, and the following ["-", "_", "$", "!", "/"]`,
    );
    this.componentName = componentName;
  }
}
