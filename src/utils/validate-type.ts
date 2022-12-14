import { GeneralError } from "../error/general-error";
import { ValidationError } from "../error/validation-error";

type Value = "string" | "number" | "array" | "object" | "boolean" | "undefined";

export function validateType(
  message: string,
  value: unknown,
  fieldName: string,
  expectedType: Value,
) {
  validate(message, value, fieldName, expectedType, false);
}

export function validateUserInputType(
  message: string,
  value: unknown,
  fieldName: string,
  expectedType: Value,
) {
  validate(message, value, fieldName, expectedType, true);
}

function validate(
  message: string,
  value: unknown,
  fieldName: string,
  expectedType: Value,
  isUserInput: boolean,
) {
  let type: string = typeof value;
  if ((expectedType === "array" || expectedType === "object") && Array.isArray(value))
    type = "array";
  if (type !== expectedType) {
    const errorMessage = `${message}, expected ${fieldName} to be ${expectedType}, got ${type}`;
    if (isUserInput) throw new GeneralError(errorMessage);
    throw new ValidationError(
      `${message}, expected ${fieldName} to be ${expectedType}, got ${type}`,
    );
  }
}
