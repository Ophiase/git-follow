import assert from "node:assert/strict";
import { test } from "node:test";
import { Attachment } from "../src/git/attachment.ts";
import type { GitPlugin } from "../src/git/plugin.ts";

function gitAt(basePath: string) {
  const saved: unknown[] = [];
  const save = async (data: unknown) => {
    saved.push(data);
  };
  const git: GitPlugin = {
    settings: { basePath },
    gitManager: { updateBasePath: async () => undefined },
    promiseQueue: { addTask: () => undefined },
    saveData: save,
  };
  return { git, saved, save };
}

test("a move changes the base path in memory, never on disk", async () => {
  const { git, saved } = gitAt("home");
  const attachment = new Attachment(git);
  assert.equal(await attachment.move("repo"), true);
  assert.equal(git.settings.basePath, "repo");
  await git.saveData({ basePath: "repo", other: 1 });
  assert.deepEqual(saved, [{ basePath: "home", other: 1 }]);
});

test("moving to the current base path is no move", async () => {
  const { git } = gitAt("home");
  const attachment = new Attachment(git);
  assert.equal(await attachment.move("home"), false);
});

test("a base path the user sets while followed becomes home", async () => {
  const { git, saved } = gitAt("home");
  const attachment = new Attachment(git);
  await attachment.move("repo");
  await git.saveData({ basePath: "chosen" });
  assert.deepEqual(saved, [{ basePath: "chosen" }]);
  assert.equal(attachment.target(null), "chosen");
});

test("release goes back home and gives saveData back", async () => {
  const { git, save } = gitAt("home");
  const attachment = new Attachment(git);
  await attachment.move("repo");
  await attachment.release();
  assert.equal(git.settings.basePath, "home");
  assert.equal(git.saveData, save);
});
