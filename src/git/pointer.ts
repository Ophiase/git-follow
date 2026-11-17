import type { App } from "obsidian";
import { Attachment } from "./attachment.ts";
import { gitPlugin } from "./plugin.ts";

/**
 * Where the Git plugin looks. Every move waits in the Git plugin's own queue,
 * so it never lands in the middle of a commit, a pull or a push.
 */
export class Pointer {
  private attachment: Attachment | null = null;
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  /** Points the Git plugin at `path`, or back at its saved base path when null. */
  point(path: string | null) {
    const attachment = this.attach();
    if (!attachment) {
      return;
    }
    const target = attachment.target(path);
    attachment.git.promiseQueue.addTask(() => this.move(attachment, target));
  }

  /** Points the Git plugin back at its saved base path and lets it go. */
  release() {
    const attachment = this.attachment;
    this.attachment = null;
    attachment?.git.promiseQueue.addTask(() => attachment.release());
  }

  private attach() {
    const git = gitPlugin(this.app);
    if (git === this.attachment?.git) {
      return this.attachment;
    }
    this.release();
    this.attachment = git ? new Attachment(git) : null;
    return this.attachment;
  }

  private async move(attachment: Attachment, path: string) {
    const moved = await attachment.move(path);
    if (moved) {
      this.app.workspace.trigger("obsidian-git:refresh");
    }
  }
}
