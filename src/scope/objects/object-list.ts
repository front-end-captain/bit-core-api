import { Ref } from "./ref";

export type ObjectItem = {
  ref: Ref;
  buffer: Buffer; // zlib deflated BitObject
  type?: string; // for future use. e.g. to be able to export only Component/Version types but not Source/Artifact, etc.
  scope?: string; // used for the export process
};
