# AGENTS.md

Instructions for any coding agent in this repository. Claude Code reads them
through `.claude/CLAUDE.md`.

## What this project is

Git Follow, an Obsidian plugin: the Git plugin (`obsidian-git`) follows the
repository of the active note, in a vault that holds several.

## Language

English everywhere: code, comments, markdown, commits. The author may write to
you in French; answer in French, write files in English.

## The canon

Rules first, code second. The canon is
[.agents/kanon.md](.agents/kanon.md); the `<>` in the README is its sign.

## Layout

| Path | What it holds |
| --- | --- |
| `src/main.ts` | the plugin: the active note, the command, the settings |
| `src/repos/` | the repository a note belongs to |
| `src/git/` | the Git plugin's internals, and moving its base path |
| `src/settings.ts` | the saved settings and the settings tab |
| `tests/` | `node --test`, on what runs without Obsidian |
| `dist/main.js` | the bundle, built, never edited, gitignored |

## The harness

TypeScript follows
[.agents/portable/rules/javascript.md](.agents/portable/rules/javascript.md)
and [.agents/portable/rules/typescript.md](.agents/portable/rules/typescript.md);
`biome.json` extends the shared config and `tsconfig.json` is strict, and
neither is loosened locally. A type the Obsidian API lacks is declared, as in
`src/git/plugin.ts`.

- `just agent gate` is the one command to declare work done: `just check`,
  then `just guards`.
- `just fmt` fixes the formatting; `just build` bundles; `just install`
  copies the bundle into `$GIT_FOLLOW_VAULT`, which comes from `.env`.
- A change to the plugin that passes the gate is installed right away, so the
  author can try it: the `update-in-obsidian` skill finds the vault when `.env`
  does not name it.
- `just install-hooks` once: every commit runs `just guards`.

## Never

- A local path, a vault name or a machine name in a tracked file or a commit:
  they belong in `.env`, which is gitignored.
- A runtime dependency: `obsidian` is provided by the app.
- A network call: the plugin reads the vault and nothing else.
- A write to the Git plugin's saved settings: a move stays in memory.
- Commit or push without being asked.
