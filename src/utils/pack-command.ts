import zlib from "zlib";

import { toBase64 } from "./string/to-base64";

export type PackData = {
  payload: Record<string, string>;
  headers: {
    context: Record<string, string>;
    [key: string]: string | boolean | Record<string, string>;
  };
};

type PackedData = {
  payload?: Buffer;
  headers: {
    context?: Buffer;
    [key: string]: string | boolean | Record<string, string> | Buffer | undefined;
  };
};

export function packCommand(obj: PackData, base64 = true, compress = true): string {
  const _obj: PackedData = {
    headers: { ...obj.headers, context: undefined },
  };

  if (compress) {
    if (obj.payload) {
      _obj.payload = zlib.deflateSync(JSON.stringify(obj.payload));
    }

    if (obj.headers && obj.headers.context) {
      _obj.headers.context = zlib.deflateSync(JSON.stringify(obj.headers.context));
    }
  }

  if (base64) {
    const res = toBase64(JSON.stringify(compress ? _obj : obj));
    return res;
  }

  return JSON.stringify(compress ? _obj : obj);
}
