// Git Follow: the Git plugin follows the repository of the active note. <>
import { debounce, normalizePath, Plugin, type TFile } from "obsidian";
import { Pointer } from "./git/index.ts";
import { folderList, RepoFinder } from "./repos/index.ts";
import { type GitFollowSettings, GitFollowTab, settingsFrom } from "./settings.ts";

export default class GitFollow extends Plugin {
  override settings: GitFollowSettings = settingsFrom(null);
  private finder = this.newFinder();
  private readonly pointer = new Pointer(this.app);
  private readonly rescanSoon = debounce(() => this.rescan(), 500, true);

  override async onload() {
    this.settings = settingsFrom(await this.loadData());
    this.finder = this.newFinder();
    this.addSettingTab(new GitFollowTab(this.app, this));
    this.addCommand({ id: "rescan", name: "Rescan repositories", callback: () => this.rescan() });
    this.registerEvent(this.app.workspace.on("file-open", (file) => this.follow(file)));
    this.app.workspace.onLayoutReady(() => this.rescan());
  }

  override onunload() {
    this.rescanSoon.cancel();
    this.pointer.release();
  }

  async saveRepositories(repositories: string) {
    this.settings = { ...this.settings, repositories };
    await this.saveData(this.settings);
    this.rescanSoon();
  }

  private newFinder() {
    const listed = folderList(this.settings.repositories).map(normalizePath);
    return new RepoFinder(this.app.vault.adapter, listed);
  }

  private async rescan() {
    this.finder = this.newFinder();
    const active = this.app.workspace.getActiveFile();
    await this.follow(active);
  }

  private async follow(file: TFile | null) {
    if (!file) {
      return;
    }
    const repo = await this.finder.repoOf(file.path);
    const active = this.app.workspace.getActiveFile();
    if (active === file) {
      this.pointer.point(repo);
    }
  }
}
