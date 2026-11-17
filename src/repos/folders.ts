/** The folders holding `path`, deepest first, the vault root left out. */
export function ancestors(path: string) {
  const folders: string[] = [];
  let end = path.lastIndexOf("/");
  while (end > 0) {
    folders.push(path.slice(0, end));
    end = path.lastIndexOf("/", end - 1);
  }
  return folders;
}

/** The lines of a text, trimmed, blank ones dropped. */
export function folderList(text: string) {
  const lines = text.split("\n").map((line) => line.trim());
  return lines.filter((line) => line.length > 0);
}
