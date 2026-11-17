import type { DataAdapter } from "obsidian";
import { ancestors } from "./folders.ts";

/**
 * The deepest folder above a note that is listed, or holds a `.git` when nothing is. Never the
 * vault root: that one is the Git plugin's own choice.
 */
export class RepoFinder {
  private readonly known = new Map<string, Promise<boolean>>();
  private readonly adapter: Pick<DataAdapter, "exists">;
  private readonly listed: readonly string[];

  constructor(adapter: Pick<DataAdapter, "exists">, listed: readonly string[]) {
    this.adapter = adapter;
    this.listed = listed;
  }

  async repoOf(path: string) {
    for (const folder of ancestors(path)) {
      if (await this.isRepo(folder)) {
        return folder;
      }
    }
    return null;
  }

  private isRepo(folder: string) {
    if (this.listed.length > 0) {
      return this.listed.includes(folder);
    }
    const found = this.known.get(folder) ?? this.adapter.exists(`${folder}/.git`);
    this.known.set(folder, found);
    return found;
  }
}
