import { get } from "../../global-config";
import { CFG_SSH_KEY_FILE_KEY, DEFAULT_SSH_KEY_FILE } from "../../constants";

export async function getPathToIdentityFile() {
  const identityFile = await get(CFG_SSH_KEY_FILE_KEY);
  return identityFile || DEFAULT_SSH_KEY_FILE;
}
