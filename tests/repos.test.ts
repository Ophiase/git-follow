import assert from "node:assert/strict";
import { test } from "node:test";
import { RepoFinder } from "../src/repos/finder.ts";
import { ancestors, folderList } from "../src/repos/folders.ts";

function adapterWith(repos: readonly string[]) {
  const probed: string[] = [];
  const exists = async (path: string) => {
    probed.push(path);
    return repos.some((repo) => `${repo}/.git` === path);
  };
  return { adapter: { exists }, probed };
}

test("the folders above a note, deepest first, without the vault root", () => {
  assert.deepEqual(ancestors("a/b/note.md"), ["a/b", "a"]);
  assert.deepEqual(ancestors("note.md"), []);
});

test("the listed folders are the trimmed lines that are not blank", () => {
  assert.deepEqual(folderList(" a \n\n  \nb/c\n"), ["a", "b/c"]);
});

test("the repository of a note is the deepest folder holding a .git", async () => {
  const { adapter } = adapterWith(["a", "a/b"]);
  const finder = new RepoFinder(adapter, []);
  assert.equal(await finder.repoOf("a/b/c/note.md"), "a/b");
  assert.equal(await finder.repoOf("z/note.md"), null);
});

test("listed folders replace the search for .git", async () => {
  const { adapter, probed } = adapterWith(["a/b"]);
  const finder = new RepoFinder(adapter, ["a"]);
  assert.equal(await finder.repoOf("a/b/note.md"), "a");
  assert.deepEqual(probed, []);
});

test("each folder is probed once", async () => {
  const { adapter, probed } = adapterWith(["a"]);
  const finder = new RepoFinder(adapter, []);
  await finder.repoOf("a/b/one.md");
  await finder.repoOf("a/b/two.md");
  assert.deepEqual(probed, ["a/b/.git", "a/.git"]);
});
