import { fork } from "child_process";
import hashObj from "object-hash";
import os from "os";
import * as path from "path";
import * as R from "ramda";
import { serializeError } from "serialize-error";
import { v4 as uniqId } from "uuid";
import yn from "yn";

import { getSync, setSync, GlobalConfig } from "../global-config";
import {
  CFG_ANALYTICS_ANONYMOUS_KEY,
  CFG_ANALYTICS_ENVIRONMENT_KEY,
  CFG_ANALYTICS_ERROR_REPORTS_KEY,
  CFG_ANALYTICS_REPORTING_KEY,
  CFG_ANALYTICS_USERID_KEY,
  CFG_USER_EMAIL_KEY,
  CFG_USER_NAME_KEY,
  DEFAULT_BIT_ENV,
} from "../constants";
import { analyticsPrompt, errorReportingPrompt } from "../prompts";

type CLIArgs = Array<string[] | string>;

type Item = undefined | number | boolean | string | null | string[];

export enum LEVEL {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  FATAL = "fatal",
}

class Breadcrumb {
  category: string;
  message: string;
  data: Record<string, unknown>;

  constructor(category: string, message: string, data?: Record<string, unknown> | null) {
    this.category = category;
    this.message = message;
    this.data = data || {};
  }
}
export class Analytics {
  static username: string;
  static command: string;
  static release: string;
  static args: CLIArgs;
  static flags: Record<string, Item> = {};
  static success = true;
  static nodeVersion: string;
  static os: string;
  static extra: Record<string, number> = {};
  static level: LEVEL;
  static error: Error | string | Record<string, unknown>;
  static breadcrumbs: Array<Breadcrumb> = [];
  static analytics_usage: boolean;
  static error_usage: boolean;
  static anonymous: boolean;
  static environment: string;

  static getID(): string {
    const id = getSync(CFG_ANALYTICS_USERID_KEY);
    if (id) return id as string;
    const newId = uniqId();
    setSync(CFG_ANALYTICS_USERID_KEY, newId);
    return newId;
  }

  static promptAnalyticsIfNeeded(): Promise<void | null | GlobalConfig> {
    const cmd = process.argv.slice(2);
    function shouldPromptForAnalytics() {
      // do not prompt analytics approval for bit config command (so you can configure it in CI envs)
      if (cmd.length && cmd[0] !== "config" && !process.env.CI) {
        const analyticsReporting = getSync(CFG_ANALYTICS_REPORTING_KEY);
        const errorReporting = getSync(CFG_ANALYTICS_ERROR_REPORTS_KEY);
        return R.isNil(analyticsReporting) && R.isNil(errorReporting);
      }
      return false;
    }

    if (shouldPromptForAnalytics()) {
      const newId = uniqId();
      if (!getSync(CFG_ANALYTICS_USERID_KEY)) setSync(CFG_ANALYTICS_USERID_KEY, newId);
      return analyticsPrompt().then(({ analyticsResponse }) => {
        setSync(CFG_ANALYTICS_REPORTING_KEY, yn(analyticsResponse) || false);
        if (!yn(analyticsResponse)) {
          return errorReportingPrompt().then(({ errResponse }) => {
            return setSync(CFG_ANALYTICS_ERROR_REPORTS_KEY, yn(errResponse) || false);
          });
        }
        return null;
      });
    }
    return Promise.resolve();
  }

  static _maskString(str: string): string {
    return str.replace(/[A-Za-z]/g, "x");
  }

  static _hashLightly(value: Item | Array<Item>): Item | Array<Item> {
    if (Array.isArray(value)) {
      return value.map((item) => this._hashLightly(item) as Item);
    }

    switch (typeof value) {
      case "undefined":
      case "number":
      case "boolean":
        return value;
      case "string":
        return this._maskString(value);
      case "object":
        if (value === null) return value;
        return hashObj(value);
      default:
        return hashObj(value);
    }
  }

  static _hashFlags(flags: Record<string, Item>) {
    const hashedFlags: Record<string, Item> = {};
    const definedFlags = R.filter((flag) => typeof flag !== "undefined", flags);
    if (this.anonymous && !R.isEmpty(definedFlags)) {
      Object.keys(definedFlags).forEach((key) => {
        hashedFlags[key] = this._hashLightly(flags[key]) as Item;
      });
      return hashedFlags;
    }
    return definedFlags;
  }

  static _hashArgs(args: CLIArgs): CLIArgs {
    if (!this.anonymous) return args;
    return args.map((arg) => this._hashLightly(arg) as string);
  }

  static init(command: string, flags: Record<string, Item>, args: CLIArgs, bitVersion: string) {
    this.anonymous = yn(getSync(CFG_ANALYTICS_ANONYMOUS_KEY), { default: true });
    this.command = command;
    this.flags = this._hashFlags(flags);
    this.release = bitVersion;
    this.args = this._hashArgs(args);
    this.nodeVersion = process.version;
    this.os = process.platform;
    this.level = LEVEL.INFO;
    this.username = !this.anonymous
      ? (getSync(CFG_USER_EMAIL_KEY) as string) ||
        (getSync(CFG_USER_NAME_KEY) as string) ||
        os.hostname() ||
        this.getID()
      : this.getID();
    this.analytics_usage = yn(getSync(CFG_ANALYTICS_REPORTING_KEY), { default: false });
    this.error_usage = this.analytics_usage
      ? true
      : yn(getSync(CFG_ANALYTICS_ERROR_REPORTS_KEY), { default: false });
    this.environment = (getSync(CFG_ANALYTICS_ENVIRONMENT_KEY) as string) || DEFAULT_BIT_ENV;
  }

  static sendData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.analytics_usage || (this.error_usage && !this.success)) {
        const file = path.join(__dirname, "analytics-sender.js");
        // @ts-ignore AUTO-ADDED-AFTER-MIGRATION-PLEASE-FIX!
        const forked = fork(file, { silent: true }); // switch to `false` to debug the child
        // console.log('sending', this.toObject()); // un-comment to see the data sent to Analytics
        forked.send(this.toObject());
        forked.on("message", () => {
          // makes sure the data has been sent to the child.
          // without it, when the message is large, it exits before the child got the complete message
          resolve();
        });
        forked.on("error", (err) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  }

  static setError(level: string = LEVEL.ERROR, err: Error): void {
    (this.level as string) = level;
    this.error = serializeError(err);
    this.success = false;
  }

  /**
   * eventually goes to the "ADDITIONAL DATA" section in Sentry
   */
  static setExtraData(key: string, value: number) {
    this.extra[key] = value;
  }

  static incExtraDataKey(key: string, value: number) {
    if (this.extra[key]) {
      this.extra[key] += value || 1;
    } else {
      this.extra[key] = value || 1;
    }
  }
  static hashData(data: unknown) {
    if (this.anonymous) {
      return hashObj(data);
    }
    return data;
  }

  static addBreadCrumb(category: string, message: string, data?: Record<string, unknown> | null) {
    this.breadcrumbs.push(new Breadcrumb(category, message, data));
  }

  static toObject() {
    return {
      username: this.username,
      command: this.command,
      flags: this.flags,
      args: this.args,
      release: this.release,
      extra: this.extra,
      nodeVersion: this.nodeVersion,
      os: this.os,
      level: this.level,
      error: this.error,
      success: this.success,
      breadcrumbs: this.breadcrumbs,
      analytics_usage: this.analytics_usage,
      error_usage: this.analytics_usage,
      environment: this.environment,
    };
  }
}
