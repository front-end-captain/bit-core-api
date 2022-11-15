import doctrine from "doctrine";
import ReactDocs from "react-docgen";
import type {
  DocumentationObject,
  MethodDescriptor,
  PropDescriptor,
  PropTypeDescriptor,
  TypeDescriptor,
  TSFunctionSignatureType,
} from "react-docgen/dist/Documentation";

import { logger } from "../../logger";
import { pathNormalizeToLinux } from "../../utils";
import { PathOsBased } from "../../utils/path";
import { extractDataRegex } from "../extract-data-regex";
import { Doclet, PropDefaultValue } from "../types";

type ComponentInfo = { description: string; displayName: string } & DocumentationObject;

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
      description: parseDescription(description || ""),
      required,
      type: stringifyType(type || tsType!),
      defaultValue: defaultValue as PropDefaultValue,
    };
  });
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

function fromReactDocs(componentInfo: ComponentInfo, filePath: string): Doclet {
  return {
    filePath: pathNormalizeToLinux(filePath),
    name: componentInfo.displayName,
    description: componentInfo.description,
    properties: formatProperties(componentInfo.props || {}),
    access: "public",
    methods: formatMethods(componentInfo.methods || []),
  };
}

function stringifyType(
  propType: PropTypeDescriptor | TypeDescriptor<TSFunctionSignatureType>,
): string {
  if (!propType) return "?"; // TODO!

  const { name } = propType;
  let transformed;

  switch (name) {
    default:
      transformed = name;
      break;
    case "func":
      transformed = "function";
      break;
    case "shape":
      transformed = JSON.stringify(
        Object.keys(propType.value).reduce((acc = {}, current) => {
          acc[current] = stringifyType(propType.value[current]);
          return acc;
        }, {}),
      );
      break;
    case "enum":
      transformed = propType.value.map((enumProp) => enumProp.value).join(" | ");
      break;
    case "instanceOf":
      transformed = propType.value;
      break;
    case "union":
      transformed = propType.value
        ? propType.value.map((p) => stringifyType(p)).join(" | ")
        : propType.raw;
      break;
    case "arrayOf":
      transformed = `${stringifyType(propType.value)}[]`;
      break;
  }

  return transformed;
}

export async function parse(data: string, filePath: PathOsBased): Promise<Doclet[] | undefined> {
  const doclets: Array<Doclet> = [];
  try {
    const componentsInfo: ComponentInfo | ComponentInfo[] = ReactDocs.parse(
      data,
      ReactDocs.resolver.findAllExportedComponentDefinitions,
      undefined,
      {
        configFile: false,
        filename: filePath, // should we use pathNormalizeToLinux(filePath) ?
      },
    ) as ComponentInfo | ComponentInfo[];

    if (Array.isArray(componentsInfo)) {
      return componentsInfo.map((componentInfo) => {
        const formatted = fromReactDocs(componentInfo, filePath);
        formatted.args = [];
        // this is a workaround to get the 'example' tag parsed when using react-docs
        // because as of now Docgen doesn't parse @example tag, instead, it shows it inside
        // the @description tag.
        extractDataRegex(formatted.description, doclets, filePath, false);
        formatted.description = doclets[0].description;
        formatted.examples = doclets[0].examples;
        return formatted;
      });
    }
  } catch (err) {
    logger.trace(`failed parsing docs using docgen on path ${filePath} with error`, err);
  }

  return undefined;
}
