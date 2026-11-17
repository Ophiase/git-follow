import { type App, PluginSettingTab, Setting, type TextAreaComponent } from "obsidian";
import type GitFollow from "./main.ts";

export interface GitFollowSettings {
  readonly repositories: string;
}

/** The settings `saved` holds, the defaults for what it lacks or holds wrong. */
export function settingsFrom(saved: unknown): GitFollowSettings {
  const repositories =
    typeof saved === "object" && saved !== null && "repositories" in saved
      ? saved.repositories
      : null;
  return { repositories: typeof repositories === "string" ? repositories : "" };
}

export class GitFollowTab extends PluginSettingTab {
  private readonly plugin: GitFollow;

  constructor(app: App, plugin: GitFollow) {
    super(app, plugin);
    this.plugin = plugin;
  }

  override display() {
    this.containerEl.empty();
    new Setting(this.containerEl)
      .setName("Repositories")
      .setDesc(
        "One folder per line, from the vault root. Empty: every folder holding a .git is found.",
      )
      .addTextArea((area) => this.repositoriesArea(area));
  }

  private repositoriesArea(area: TextAreaComponent) {
    area
      .setValue(this.plugin.settings.repositories)
      .onChange((value) => this.plugin.saveRepositories(value));
    area.inputEl.rows = 8;
    area.inputEl.cols = 40;
  }
}
