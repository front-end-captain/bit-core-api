import type { Schema } from "prompt";

export type ApprovingOperationSchema = {
  shouldProceed: string;
};

/**
 * schema for approving an operation
 */
export const approvingOperationSchema: Schema = {
  properties: {
    shouldProceed: {
      required: true,
      description: "are you sure you would like to proceed with this operation? (yes[y]/no[n])'",
      message: "please type yes or no.",
      type: "string",
      conform(value: string) {
        return (
          value.toLowerCase() === "y" ||
          value.toLowerCase() === "n" ||
          value.toLowerCase() === "yes" ||
          value.toLowerCase() === "no"
        );
      },
    },
  },
};
