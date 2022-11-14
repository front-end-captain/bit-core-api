import type { Schema } from "prompt";

/**
 * schema for passphrase prompt on SSH.
 */
export const userpassSchema: Schema = {
  properties: {
    username: {
      required: true,
    },
    password: {
      hidden: true,
      required: true,
    },
  },
};

export type UserpassSchema = {
  username: string;
  password: string;
};
