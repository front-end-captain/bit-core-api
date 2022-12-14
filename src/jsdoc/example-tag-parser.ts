import type { Example } from "./types";
import { GeneralError } from "../error";

const token = {
  CODE: "CODE",
  DESC_DELIMITER: "DESC_DELIMITER",
  RETURNS_DELIMITER: "RETURNS_DELIMITER",
  COMMENT: "COMMENT",
};
// @ts-ignore AUTO-ADDED-AFTER-MIGRATION-PLEASE-FIX!
type Token = $Keys<typeof token>;

const status = {
  IN_CODE: "IN_CODE",
  IN_DESCRIPTION: "IN_DESCRIPTION",
  IN_RETURNS: "IN_RETURNS",
  NONE: "NONE",
};

// @ts-ignore AUTO-ADDED-AFTER-MIGRATION-PLEASE-FIX!
type Status = $Keys<typeof status>;

function isComment(str: string): boolean {
  return str.startsWith("//");
}

function isCode(str: string): boolean {
  return !isComment(str);
}

function isDescriptionDelimiter(str: string): boolean {
  return str === "//-";
}

function isReturnsDelimiter(str: string): boolean {
  return str === "//=>";
}

function tokenize(str: string): Token {
  if (isCode(str)) return token.CODE;
  if (isDescriptionDelimiter(str)) return token.DESC_DELIMITER;
  if (isReturnsDelimiter(str)) return token.RETURNS_DELIMITER;
  return token.COMMENT;
}

function stripComment(str: string): string {
  return isComment(str) ? str.replace("//", "") : str;
}

function updateExample(line: string, field: keyof Example, example: Example) {
  line = stripComment(line).trim();
  if (example[field]) {
    example[field] += `\n${line}`;
  } else {
    example[field] = line;
  }
}

function parseToken(
  currentToken: Token,
  line: string,
  currentStatus: Status,
  example: Example,
): Status {
  switch (currentToken) {
    case token.DESC_DELIMITER:
      if (currentStatus === status.NONE) currentStatus = status.IN_DESCRIPTION;
      else if (currentStatus === status.IN_DESCRIPTION) {
        currentStatus = status.NONE;
      } else {
        throw new GeneralError(
          `${
            currentToken // end desc block
          } can't appear after code or returns block`,
        );
      }
      break;
    case token.RETURNS_DELIMITER:
      if (currentStatus === status.NONE || currentStatus === status.IN_CODE)
        currentStatus = status.IN_RETURNS;
      else if (currentStatus === status.IN_RETURNS) {
        currentStatus = status.NONE;
      } else {
        throw new GeneralError(
          `${
            currentToken // end returns block
          } must appear after code block`,
        );
      }
      break;
    case token.CODE:
      if (currentStatus === status.NONE || currentStatus === status.IN_CODE)
        updateExample(line, "code", example);
      else throw new GeneralError(`${currentToken} can't appear inside desc or returns block`);
      break;
    case token.COMMENT:
      if (currentStatus === status.IN_DESCRIPTION) updateExample(line, "description", example);
      else if (currentStatus === status.IN_RETURNS) updateExample(line, "returns", example);
      else throw new GeneralError(`${currentToken} must appear inside desc or returns block`);
      break;
    default:
      throw new GeneralError("Unrecognized token");
  }
  return currentStatus;
}

/**
 * An example of an "example" tag
 *
 * * @example
 * //-
 * // Adds two numbers
 * //-
 * add(2, 3);
 * //=>
 * // 5
 * //=>
 *
 * @returns {Example} Returns the parsed "example" tag
 * {
 *   raw: '//-\n// Adds two numbers\n//-\nadd(2, 3);\n//=>\n// 5\n//=>',
 *   description: 'Adds two numbers',
 *   code: 'add(2, 3);',
 *   returns: '5'
 * }
 */
export function parse(exampleRaw: string): Example {
  const example: Example = { raw: "" };
  let currentStatus: Status = status.NONE;
  example.raw = exampleRaw;
  try {
    const lines = exampleRaw.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (line) {
        const currentToken = tokenize(line);
        currentStatus = parseToken(currentToken, line, currentStatus, example);
      }
    }
  } catch (_e) {
    // That's fine. The example probably doesn't comply with our standard
  }

  return example;
}
