import doctrine from "doctrine";
import type { MethodReturn, MethodModifier } from "react-docgen/dist/Documentation";

export interface OriginTag {
  /** The title of the jsdoc tag. e.g. `@foo` will have a title of 'foo'. */
  title: string;
  /** The name of the thing this tag is documenting, if any. */
  name?: string | undefined;
  /** The description of the thing this tag is documenting. */
  description: string | null;
  /** The type of the thing this tag is documenting. */
  type?: doctrine.Type | null | undefined;
  kind?: string | undefined;
  /** Any errors that were encountered in parsing the tag. */
  errors?: string[] | undefined;
  access?: string | null;
  default?: string | null;
}

export type FormattedTag = {
  name?: string | undefined;
  /** The description of the thing this tag is documenting. */
  description?: string | null;
  /** The type of the thing this tag is documenting. */
  type?: string | null | undefined;
  kind?: string | undefined;
  /** Any errors that were encountered in parsing the tag. */
  errors?: string[] | undefined;
  access?: string | null;
  default?: string | null;
} & DocProp;

export type Example = {
  raw: string;
  description?: string;
  code?: string;
  returns?: string;
};

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
  filePath?: string;
  name: string;
  description: string;
  args?: FormattedTag[];
  returns?: FormattedTag;
  access?: string;
  examples: Example[];
  methods?: Method[];
  properties: DocProp[];
  static?: boolean;
  render?: string | null;
};
