import prompt from "prompt";

import { loader } from "../loader";
import { PromptCanceled } from "./exceptions";

const DEFAULT_PROMPT_MSG = "";
const CANCEL_ERROR_MSG = "canceled";

export function _prompt<T extends prompt.Properties>(schema: prompt.Schema): () => Promise<T> {
  return function (): Promise<T> {
    return new Promise((resolve, reject) => {
      loader.stop();
      prompt.start();
      prompt.message = DEFAULT_PROMPT_MSG;

      prompt.get<T>(schema, (err, res) => {
        if (err) {
          if (err.message === CANCEL_ERROR_MSG) {
            reject(new PromptCanceled());
          }
          return reject(err);
        }
        loader.start();
        return resolve(res);
      });
    });
  };
}
