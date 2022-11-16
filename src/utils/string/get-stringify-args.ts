/**
 * Get pretty value (boolean) and return args to pass to the json.stringify method
 *
 * @export
 * @param {boolean} pretty - pretty print or not
 * @returns {Array} args to pass to the json.stringify
 * */
export function getStringifyArgs(pretty?: boolean): [null, string] {
  const args: [null, string] = [null, ""];
  if (pretty) args[1] = "  ";
  return args;
}
