// import { BIT_VERSION } from "../constants";
import { PackData } from "./pack-command";

export function buildCommandMessage(
  payload: Record<string, string>,
  context: Record<string, string>,
  compress = true,
  extraHeaders = {},
): PackData {
  return {
    payload,
    headers: {
      // version: BIT_VERSION,
      compressed: compress,
      ...extraHeaders,
      context,
    },
  };
}
