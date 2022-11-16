import { BitId } from "../../bit-id";
import { getStringifyArgs } from "../../utils";
import { Ref, BitObject } from "../objects";

type ExportMetadataProps = {
  exportVersions: ExportVersions[];
};

export type ExportVersions = { id: BitId; versions: string[]; head: Ref };
export type ExportVersionObject = { id: string; versions: string[]; head: string };

export class ExportMetadata extends BitObject {
  exportVersions: ExportVersions[];
  constructor(props: ExportMetadataProps) {
    super();
    this.exportVersions = props.exportVersions;
  }

  toObject(): { exportVersions: ExportVersionObject[] } {
    return {
      exportVersions: this.exportVersions.map((exportComp) => ({
        id: exportComp.id.toStringWithoutVersion(),
        versions: exportComp.versions,
        head: exportComp.head.toString(),
      })),
    };
  }

  toString(pretty: boolean): string {
    const args = getStringifyArgs(pretty);
    return JSON.stringify(this.toObject(), ...args);
  }

  id(): string {
    return ExportMetadata.name;
  }

  toBuffer(pretty = false): Buffer {
    return Buffer.from(this.toString(pretty));
  }

  static parse(contents: string): ExportMetadata {
    const parsed: { exportVersions: ExportVersionObject[] } = JSON.parse(contents);
    const props: ExportMetadataProps = {
      exportVersions: parsed.exportVersions.map((comp) => ({
        id: BitId.parse(comp.id, true),
        versions: comp.versions,
        head: Ref.from(comp.head),
      })),
    };
    return new ExportMetadata(props);
  }
}
