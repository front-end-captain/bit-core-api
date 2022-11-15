import * as R from "ramda";
import { inspect } from "util";
import { HOOKS_NAMES } from "../constants";
import { logger } from "../logger";
import { HookNotExists, HookAlreadyExists } from "./exceptions";

type ObjectList = {
  count?: () => number;
};
type Args = {
  componentObjects?: Array<unknown> | number;
  objectList?: number | ObjectList;
};
type Context = Record<string, unknown>;
type Headers = {
  context?: {
    pubSshKey?: string;
  };
};

type RunFunc = (
  args: Args,
  headers: Headers,
  context: Context,
) => Promise<HookFailures[] | null | undefined>;

export type HookAction = {
  name: string | null | undefined;
  run: RunFunc;
};

export type Hooks = {
  [key: string]: HookAction[];
};

type HookFailures = {
  [key: string]: Error;
};

/*
 * Setting up block level variable to store class state
 * set's to null by default.
 */
let instance: HooksManager | null = null;

/**
 * A class which manage all the hooks
 * This is a singelton class which expose getInstance method
 * This class used for register new hooks, actions for existing hooks and trigger hooks
 */
export class HooksManager {
  public hooks: Map<string, HookAction[]> = new Map();

  constructor() {
    if (!instance) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      instance = this;
    }

    return instance;
  }

  /**
   * Initialize the default hooks
   */
  static init() {
    const self = new HooksManager();
    HOOKS_NAMES.forEach((hookName) => self.hooks.set(hookName, []));
  }

  /**
   * Get the instance of the HooksManager
   * @return {HooksManager} instance of the HooksManager
   *
   */
  static getInstance(): HooksManager {
    return instance as HooksManager;
  }

  /**
   * register new hook name
   * @param {string} hookName
   * @param {boolean} throwIfExist - whether to throw an error if the hook name already exists
   * @return {boolean} whether the hook has been registerd
   */
  registerNewHook(
    hookName: string,
    context: Record<string, string> = {},
    throwIfExist = false,
  ): boolean {
    if (this.hooks.has(hookName)) {
      const contextMsg = context.extension ? `from ${context.extension}` : "";

      logger.warn(`trying to register an already existing hook ${hookName} ${contextMsg}`);

      if (throwIfExist) {
        throw new HookAlreadyExists(hookName);
      }

      return false;
    }

    this.hooks.set(hookName, []);

    return true;
  }

  /**
   * Register action to an existing hook
   * @param {string} hookName - hook to register action to
   * @param {HookAction} hookAction - The action to register to the hook
   * @param {boolean} throwIfNotExist - whether to throw an exception in case the hook doesn't exists
   * @return {boolean} whether the action has been registerd successfully
   */
  registerActionToHook(
    hookName: string,
    hookAction: HookAction,
    context: Record<string, string> = {},
    throwIfNotExist = false,
  ) {
    if (!this.hooks.has(hookName)) {
      const contextMsg = context.extension ? `from ${context.extension}` : "";
      logger.warn(`trying to register to a non existing hook ${hookName} ${contextMsg}`);
      if (throwIfNotExist) {
        throw new HookNotExists(hookName);
      }
      return false;
    }
    this.hooks.get(hookName)?.push(hookAction);
    return true;
  }

  /**
   * Trigger a hook - run all the actions registerd to this hook
   * The actions will be run in parallel and the errors will be aggregated
   * @param {string} hookName - The hook name to trigger
   * @return {HookFailures} Aggregated errors of the actions failures
   */
  async triggerHook(
    hookName: string,
    args: Args = {},
    headers: Headers = {},
    context: Record<string, unknown> = {},
  ): Promise<HookFailures[] | null | undefined> {
    const resultErrors: HookFailures[] = [];

    if (!this.hooks.has(hookName)) {
      logger.warn(`trying to trigger a non existing hook ${hookName}`);
      throw new HookNotExists(hookName);
    }

    if (process.env.BIT_LOG) {
      // this is disabled by default due to performance implications
      // prefix your command with "BIT_LOG=*" to log all args and headers
      logger.info(
        `triggering hook ${hookName} with args:\n ${_stringifyIfNeeded(
          _stripArgs(args),
        )} \n and headers \n ${_stringifyIfNeeded(
          _stripHeaders(headers),
        )} \n and context ${_stringifyIfNeeded(context)}`,
      );
    } else {
      logger.info(`triggering hook ${hookName}`);
    }

    const actions = this.hooks.get(hookName);
    if (!actions) {
      return resultErrors;
    }

    const actionsP = actions.map((action) => {
      // Catch errors in order to aggregate them
      // Wrap in a promise in case the action doesn't return a promise
      return Promise.resolve()
        .then(() => {
          logger.info(`running action ${action.name} on hook ${hookName}`);
          return action.run(args, headers, context);
        })
        .catch((e) => {
          logger.error(`running action ${action.name} on hook ${hookName} failed, err:`, e);
          resultErrors.push({ [action.name || "unknown"]: e });
        });
    });

    await Promise.all(actionsP);
    return resultErrors;
  }
}

function _stringifyIfNeeded(val: unknown) {
  return typeof val === "string" ? val : inspect(val, { depth: 5 });
}

/**
 * Remove some data from the logs (because it's too verbose or because it's sensitive)
 * @param {Object} args
 */
function _stripArgs(args: Args) {
  // Create deep clone
  const res = R.clone(args);
  if (Array.isArray(res.componentObjects)) {
    res.componentObjects = res.componentObjects.length;
  }
  if (res.objectList) {
    res.objectList = (args.objectList as ObjectList).count
      ? (args.objectList as Required<ObjectList>).count()
      : undefined;
  }
  return res;
}

/**
 * Remove some data from the logs (because it's too verbose or because it's sensitive)
 * @param {Object} headers
 */
function _stripHeaders(headers: Headers) {
  if (!headers) return;
  // Create deep clone
  const res = R.clone(headers);
  if (res.context && res.context.pubSshKey) {
    const key = res.context.pubSshKey;
    res.context.pubSshKey = `last 70 characters: ${key.slice(key.length - 70)}`;
  }
  return res;
}
