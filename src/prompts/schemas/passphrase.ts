import type { Schema } from "prompt";

import { identityFile } from "../../utils";

/**
 * // TODO: FIX if this function is used. identityFile() is now async.
 * schema for passphrase prompt on SSH.
 */
export const passphraseSSHSchema: Schema = {
  properties: {
    passphrase: {
      hidden: true,
      required: true,
      description: `enter passphrase for key '${identityFile()}'`,
    },
  },
};

export type PassphraseSSHSchema = {
  passphrase: string;
};
