import { getSync } from "../../global-config";
import { CFG_GIT_EXECUTABLE_PATH } from "../../constants";

export function getGitExecutablePath() {
  const executablePath = getSync(CFG_GIT_EXECUTABLE_PATH) as string;
  return executablePath || "git";
}
