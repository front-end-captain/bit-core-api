/**
 * Creates a string with the same length as `numSpaces` parameter
 * */
export function indent(numSpaces: number) {
  return new Array(numSpaces + 1).join(" ");
}

/**
 * Gets the string length of the longer index in a hash
 * */
export function getMaxIndexLength(input: Record<string, unknown>) {
  let maxWidth = 0;

  Object.getOwnPropertyNames(input).forEach(function (key) {
    // Skip undefined values.
    if (input[key] === undefined) {
      return;
    }

    maxWidth = Math.max(maxWidth, key.length);
  });
  return maxWidth;
}
