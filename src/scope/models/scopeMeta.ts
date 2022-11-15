import { getStringifyArgs } from "../../utils";
import { BitObject, Ref } from "../objects";

type ScopeMetaProps = {
  name: string;
  license?: string | null;
};

export class ScopeMeta extends BitObject {
  license: string | null | undefined;
  name: string;

  constructor(props: ScopeMetaProps) {
    super();
    this.license = props.license;
    this.name = props.name;
  }

  toObject(): ScopeMetaProps {
    return {
      license: this.license,
      name: this.name,
    };
  }

  toString(pretty: boolean): string {
    const args = getStringifyArgs(pretty);
    return JSON.stringify(this.toObject(), ...args);
  }

  id(): string {
    return this.name;
  }

  toBuffer(pretty = false): Buffer {
    return Buffer.from(this.toString(pretty));
  }

  static fromScopeName(name: string): Ref {
    return ScopeMeta.fromObject({ name }).hash();
  }

  static parse(propsStr: string | Buffer): ScopeMeta {
    return this.fromObject(JSON.parse(propsStr.toString()));
  }

  static fromObject(props: ScopeMetaProps): ScopeMeta {
    return new ScopeMeta(props);
  }

  static from(props: ScopeMetaProps): ScopeMeta {
    return ScopeMeta.fromObject(props);
  }
}
