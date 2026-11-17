# Changelog

Each release of Git Follow, newest first. `just release` refuses a version without
its section here, and the GitHub release takes its notes from it.

## 0.1.0

- The Git plugin follows the repository of the active note: the deepest
  folder above it that holds a `.git`, or one the settings list.
- A move waits for the Git plugin's running operation, and never reaches its
  saved settings.
- Rescan repositories, after a repository is added or removed.
