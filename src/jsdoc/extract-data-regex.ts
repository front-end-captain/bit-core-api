import doctrine from "doctrine";

import { pathNormalizeToLinux } from "../utils";
import { PathOsBased } from "../utils/path";
import { parse as exampleTagParser } from "./example-tag-parser";
import { Doclet, DocProp, Example } from "./types";

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

function formatTag(tag: doctrine.Tag): FormattedTag {
  // @ts-ignore
  delete tag.title;

  if (!tag.type) return tag as FormattedTag;

  let formattedType = doctrine.type.stringify(tag.type);

  if (tag.type.type === doctrine.type.Syntax.TypeApplication) {
    // Doctrine adds a dot after the generic type for historical reasons.
    // see here for more info: https://github.com/eslint/doctrine/issues/185
    formattedType = formattedType.replace(".<", "<");
  }

  if (tag.type.type === doctrine.type.Syntax.OptionalType) {
    // Doctrine shows an optional type with a suffix `=` (e.g. `string=`), we prefer the more
    // common syntax `?` (e.g. `string?`)
    formattedType = formattedType.replace("=", "?");
  }

  (tag as FormattedTag).type = formattedType;

  return tag as FormattedTag;
}

export function extractDataRegex(doc: string, filePath?: PathOsBased, unwrap = true) {
  const commentsAst = doctrine.parse(doc.trim(), { unwrap, recoverable: true, sloppy: true });
  if (!commentsAst) return;

  const args: FormattedTag[] = [];
  let description: string | undefined | null = commentsAst.description;
  let returns: FormattedTag = {};
  let isStatic = false;
  let access: string | null | undefined = "public";
  const examples: Example[] = [];
  const properties: FormattedTag[] = [];
  let name: string | undefined = "";
  let render: string | null = "";

  commentsAst.tags.forEach((tag: OriginTag) => {
    switch (tag.title) {
      case "desc":
      case "description":
        description = tag.description;
        break;
      case "name":
        name = tag.name;
        break;
      case "param":
      case "arg":
      case "argument":
        args.push(formatTag(tag));
        break;
      case "returns":
      case "return":
        returns = formatTag(tag);
        break;
      case "static":
        isStatic = true;
        break;
      case "private":
      case "protected":
        access = tag.title;
        break;
      case "access":
        access = tag.access;
        break;
      case "example":
        examples.push(exampleTagParser(tag.description || ""));
        break;
      case "property":
        properties.push(formatTag(tag));
        break;
      case "render":
        render = tag.description;
        break;
      default:
        break;
    }
  });

  const doclet: Doclet = {
    name, // todo: find the function/method name by regex
    description,
    args,
    returns,
    access,
    examples,
    render,
    properties,
    static: isStatic,
    filePath: pathNormalizeToLinux(filePath || ""),
  };

  return doclet;
}
