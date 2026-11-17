// None of this is public API: it is the Git plugin's instance as its own code uses it.
import type { App } from "obsidian";

export type Save = (data: unknown) => Promise<void>;

export interface GitPlugin {
  readonly settings: { basePath: string };
  readonly gitManager: { updateBasePath(path: string): Promise<unknown> };
  readonly promiseQueue: { addTask(task: () => Promise<unknown>): void };
  saveData: Save;
}

interface PluginHost {
  plugins?: { plugins?: Record<string, unknown> };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function field(owner: unknown, name: string) {
  return isRecord(owner) ? owner[name] : undefined;
}

function isMethod(owner: unknown, name: string) {
  const member = field(owner, name);
  return typeof member === "function";
}

function isGitPlugin(value: unknown): value is GitPlugin {
  const settings = field(value, "settings");
  const base = field(settings, "basePath");
  const manager = field(value, "gitManager");
  const queue = field(value, "promiseQueue");
  const movable = isMethod(manager, "updateBasePath") && isMethod(queue, "addTask");
  return typeof base === "string" && movable && isMethod(value, "saveData");
}

/** The Git plugin when it is loaded and still has the shape Git Follow knows, else null. */
export function gitPlugin(app: App) {
  const registry = (app as App & PluginHost).plugins?.plugins;
  const plugin = registry?.["obsidian-git"];
  return isGitPlugin(plugin) ? plugin : null;
}
