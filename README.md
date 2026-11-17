# Git Follow

[![Obsidian](https://img.shields.io/badge/Obsidian-plugin-483699.svg?logo=obsidian&logoColor=white)](manifest.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg?logo=typescript&logoColor=white)](tsconfig.json)
[![just](https://img.shields.io/badge/just-recipes-EE7700.svg)](justfile)
[![Kanon](https://img.shields.io/badge/%3C%3E-Kanon-blueviolet.svg)](.agents/kanon.md)

A simple Obsidian plugin for a vault that holds several Git repositories: the
[Git plugin](https://github.com/Vinzent03/obsidian-git) follows the one of the
note you open.

## Why

The Git plugin works on one repository, the one its *Custom base path*
names. A vault whose folders are repositories of their own, linked in or
cloned, needs that path changed by hand every time you move between them.

## What it does

When a note opens, Git Follow looks for its repository: the deepest folder above
it that holds a `.git`. It points the Git plugin there, and back at the base
path of its settings when the note belongs to none.

- The move happens in memory: the Git plugin's saved settings keep the base
  path you chose, and a base path you set there is the one Git Follow comes back
  to.
- A move waits in the Git plugin's own queue, so it never lands in the middle
  of a commit, a pull or a push.
- Disabling Git Follow points the Git plugin back at its saved base path.

The settings may list the repositories instead, one folder per line; the
command *Rescan repositories* picks up a repository added since.

Git Follow reaches into the Git plugin's internals, which are not a public
API: if a release of the Git plugin renames them, Git Follow does nothing
rather than something wrong.

## Network

None. Git Follow reads the vault's folders and nothing else.

## Install

From the sources, into the vault `.env` names:

```sh
cp .env.example .env    # set GIT_FOLLOW_VAULT
just setup
just install
```

## Make it yours

> [!TIP]
> Built for one vault and one pair of hands. Feel free to clone it and adapt
> it to your needs with your agents: the rules they follow are already in
> [AGENTS.md](AGENTS.md) ;)

## License

[Apache 2.0](LICENSE)
