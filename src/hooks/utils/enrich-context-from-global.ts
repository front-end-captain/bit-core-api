import gitconfig from "gitconfig";
import yn from "yn";

import * as globalConfig from "../../global-config";
import {
  CFG_REPOSITORY_REPORTING_KEY,
  CFG_USER_EMAIL_KEY,
  CFG_USER_NAME_KEY,
  CFG_USER_TOKEN_KEY,
} from "../../constants";
import { logger } from "../../logger";

type Context = {
  username?: string;
  email?: string;
  token?: string;
  repo?: Array<string> | string;
  [key: string]: unknown;
};

interface EnrichContextFromGlobal {
  (context: Context): void;
  context?: Context;
}

/**
 * Add more keys to the context which will be passed to hooks
 * @param {Object} context
 */
export const enrichContextFromGlobal: EnrichContextFromGlobal = (
  context: Record<string, unknown> = {},
) => {
  logger.debug("enrich context from global config");
  const getContextToEnrich = () => {
    if (!enrichContextFromGlobal.context) {
      const username = globalConfig.getSync(CFG_USER_NAME_KEY) as string;
      const email = globalConfig.getSync(CFG_USER_EMAIL_KEY) as string;

      // const sshKeyFile = globalConfig.getSync(CFG_SSH_KEY_FILE_KEY);
      const token = globalConfig.getSync(CFG_USER_TOKEN_KEY) as string;

      // const pubSshKeyFile = sshKeyFile ? `${sshKeyFile}.pub` : undefined;
      // const pubSshKey = _getSshPubKey(pubSshKeyFile);
      const repo = yn(globalConfig.getSync(CFG_REPOSITORY_REPORTING_KEY), { default: true })
        ? gitconfig.fetchRepo()
        : undefined;

      enrichContextFromGlobal.context = { username, email, token, repo };
    }

    return enrichContextFromGlobal.context;
  };

  const contextToEnrich = getContextToEnrich();

  Object.assign(context, contextToEnrich);
};

// function _getSshPubKey(pubSshKeyFile = `${DEFAULT_SSH_KEY_FILE}.pub`) {
//   logger.debug(`reading ssh public key from ${pubSshKeyFile}`);
//   if (!fs.pathExistsSync(pubSshKeyFile)) {
//     return null;
//   }
//   const buf = fs.readFileSync(pubSshKeyFile);
//   return buf.toString();
// }
