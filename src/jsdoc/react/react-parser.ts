import doctrine from "doctrine";
import ReactDocs from "react-docgen";
import type {
  DocumentationObject,
  MethodDescriptor,
  PropDescriptor,
  PropTypeDescriptor,
  TypeDescriptor,
  TSFunctionSignatureType,
  ElementsType,
} from "react-docgen/dist/Documentation";

import { logger } from "../../logger";
import { pathNormalizeToLinux } from "../../utils";
import { PathOsBased } from "../../utils/path";
import { extractDataRegex } from "../extract-data-regex";
import { Doclet, PropDefaultValue } from "../types";

export type ComponentDoc = {
  description: string;
  displayName: string;
} & DocumentationObject;

type EnumValueItem = { value: string; computed: false };
type UnionValueItem = { name: string };
type ArrayOfValue = { name: string };
type ShapeValue = Record<string, { name: string; required: boolean }>;
type InstanceOfValue = string;

function stringifyType(
  propType?: PropTypeDescriptor | TypeDescriptor<TSFunctionSignatureType>,
): string {
  if (!propType) return "?";

  const { name } = propType;
  // console.log("stringifyType", name);
  let transformed;

  switch (name) {
    default:
      transformed = name;
      break;
    case "func":
      transformed = "function";
      break;
    case "shape":
      const _value = (propType as PropTypeDescriptor).value as ShapeValue;
      transformed = JSON.stringify(
        Object.keys(_value).reduce((acc, current) => {
          acc[current] = stringifyType(_value[current]);
          return acc;
        }, {} as Record<string, string>),
      );
      break;
    case "enum":
      transformed = ((propType as PropTypeDescriptor).value as Array<EnumValueItem>)
        .map((enumProp) => enumProp.value)
        .join(" | ");
      break;
    case "instanceOf":
      transformed = (propType as PropTypeDescriptor).value as InstanceOfValue;
      break;
    case "union":
      transformed = (propType as PropTypeDescriptor).value
        ? ((propType as PropTypeDescriptor).value as Array<UnionValueItem>)
            .map((p) => stringifyType(p))
            .join(" | ")
        : (propType as ElementsType).raw;
      break;
    case "arrayOf":
      transformed = `${stringifyType((propType as PropTypeDescriptor).value as ArrayOfValue)}[]`;
      break;
  }

  return transformed;
}

function formatMethods(methods: MethodDescriptor[]) {
  return methods.map((method) => {
    const { returns, modifiers, params, docblock, name } = method;
    return {
      name,
      description: docblock,
      returns,
      modifiers,
      params,
    };
  });
}

function formatProperties(props: Record<string, PropDescriptor>) {
  const parseDescription = (description: string) => {
    // an extra step is needed to parse the properties description correctly. without this step
    // it'd show the entire tag, e.g. `@property {propTypes.string} text - Button text.`
    // instead of just `text - Button text.`.
    try {
      const descriptionAST = doctrine.parse(description, {
        unwrap: true,
        recoverable: true,
        sloppy: true,
      });
      if (descriptionAST && descriptionAST.tags[0]) return descriptionAST.tags[0].description;
    } catch (err) {
      // failed to parse the react property, that's fine, it'll return the original description
    }
    return description;
  };
  return Object.keys(props).map((name) => {
    const { type, description, required, defaultValue, tsType } = props[name];

    return {
      name,
      description: description ? parseDescription(description) : "",
      required,
      type: stringifyType(type || tsType),
      defaultValue: defaultValue as PropDefaultValue,
    };
  });
}

export function formatComponentDoc(componentDoc: ComponentDoc, filePath: string): Doclet {
  return {
    filePath: pathNormalizeToLinux(filePath),
    name: componentDoc.displayName,
    description: componentDoc.description,
    properties: formatProperties(componentDoc.props || {}),
    access: "public",
    methods: formatMethods(componentDoc.methods || []),
    examples: [],
  };
}

export async function parse(data: string, filePath: PathOsBased): Promise<Doclet[] | undefined> {
  try {
    const componentsDoc: ComponentDoc[] | ComponentDoc = ReactDocs.parse(
      data,
      ReactDocs.resolver.findAllExportedComponentDefinitions,
      undefined,
      {
        configFile: false,
        filename: filePath,
      },
    ) as ComponentDoc[] | ComponentDoc;

    if (Array.isArray(componentsDoc) && componentsDoc.length) {
      return componentsDoc.map((componentDoc) => {
        const doc = formatComponentDoc(componentDoc, filePath);
        doc.args = [];

        const descDoc = extractDataRegex(doc.description, filePath, false);
        if (descDoc) {
          doc.description = descDoc.description;
          doc.examples = descDoc.examples;
        }

        return doc;
      });
    }
    return [];
  } catch (err) {
    logger.trace(`failed parsing docs using docgen on path ${filePath} with error`, err);
  }

  return undefined;
}
