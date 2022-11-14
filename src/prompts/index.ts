import { _prompt as prompt } from "./prompt";
import {
  userpassSchema,
  approvingOperationSchema,
  resolveConflictScheme,
  errorReportSchema,
  analyticsReportSchema,
  forkComponentSchema,
  remoteComponentSchema,
  passphraseSSHSchema,
  UserpassSchema,
  ApprovingOperationSchema,
  RemoteComponentSchema,
  ResolveConflictScheme,
  ErrorReportSchema,
  AnalyticsReportSchema,
  PassphraseSSHSchema,
  ForkComponentSchema,
} from "./schemas";

import type { BitId } from "../bit-id";

const passphrase = prompt<PassphraseSSHSchema>(passphraseSSHSchema);
const userpass = prompt<UserpassSchema>(userpassSchema);
const approveOperation = prompt<ApprovingOperationSchema>(approvingOperationSchema);
const removePrompt = (deleteFiles: boolean, remote: boolean) =>
  prompt<RemoteComponentSchema>(remoteComponentSchema(deleteFiles, remote));
const resolveConflictPrompt = prompt<ResolveConflictScheme>(resolveConflictScheme);
const analyticsPrompt = prompt<AnalyticsReportSchema>(analyticsReportSchema);
const errorReportingPrompt = prompt<ErrorReportSchema>(errorReportSchema);
const forkComponentsPrompt = (bitIds: BitId[], remote: string) =>
  prompt<ForkComponentSchema>(forkComponentSchema(bitIds, remote));

export {
  passphrase,
  userpass,
  approveOperation,
  removePrompt,
  resolveConflictPrompt,
  analyticsPrompt,
  errorReportingPrompt,
  forkComponentsPrompt,
};
