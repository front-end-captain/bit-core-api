import globlib from "glob";
import path from "path";

export function glob(pattern: string, options: globlib.IOptions = {}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    globlib(pattern, options, (err, matches) => {
      if (err) return reject(err);
      return resolve(matches.map((match) => path.normalize(match)));
    });
  });
}
