import { type GitPlugin, isRecord, type Save } from "./plugin.ts";

/**
 * A Git plugin instance whose saves carry `home`, the user's base path, so a move never reaches
 * the disk; a base path the user sets in its settings becomes `home`.
 */
export class Attachment {
  private home: string;
  private followed: string;
  private readonly save: Save;
  readonly git: GitPlugin;

  constructor(git: GitPlugin) {
    this.git = git;
    this.home = git.settings.basePath;
    this.followed = this.home;
    this.save = git.saveData;
    git.saveData = (data) => this.saveHome(data);
  }

  /** `path`, or `home` when the note belongs to no repository. */
  target(path: string | null) {
    return path ?? this.home;
  }

  /** Whether the base path changed. */
  async move(path: string) {
    if (this.git.settings.basePath === path) {
      return false;
    }
    this.followed = path;
    this.git.settings.basePath = path;
    await this.git.gitManager.updateBasePath(path);
    return true;
  }

  async release() {
    await this.move(this.home);
    this.git.saveData = this.save;
  }

  private saveHome(data: unknown) {
    if (!isRecord(data) || typeof data.basePath !== "string") {
      return this.save.call(this.git, data);
    }
    if (data.basePath !== this.followed) {
      this.home = data.basePath;
      this.followed = data.basePath;
    }
    const saved = { ...data, basePath: this.home };
    return this.save.call(this.git, saved);
  }
}
