import { AbstractError } from "../../error";

export class ComponentNeedsUpdate extends AbstractError {
  id: string;
  hash: string;
  lane?: string;

  constructor(id: string, hash: string, lane?: string) {
    super();

    this.id = id;
    this.hash = hash;
    this.lane = lane;
  }
}
