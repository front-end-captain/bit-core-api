import type { PathLinux } from "../utils/path";
import type { Example } from "./example-tag-parser";
import type { FormattedTag } from "./extract-data-regex";
import type { MethodReturn, MethodModifier } from "react-docgen/dist/Documentation";

export type Method = {
  name: string;
  description: string | null;
  args?: [];
  access?: "public" | "private" | "";
  returns: MethodReturn | null;
  modifiers: MethodModifier[];
};

export type PropDefaultValue = {
  value: string;
  computed: boolean;
};

export type DocProp = {
  name?: string;
  description?: string | null;
  required?: boolean;
  type?: string | null;
  defaultValue?: PropDefaultValue;
};

export type Doclet = {
  filePath: PathLinux;
  name: string;
  description: string;
  args?: FormattedTag[];
  returns?: FormattedTag;
  access?: string;
  examples?: Example[];
  methods?: Method[];
  properties?: DocProp[];
  static?: boolean;
  render?: string | null;
  // methods?: MethodDescriptor[];
};
