/**
 * Resolves a docs page id (or registry key) to its registry/demo id.
 * Shared by properties, edits, resets, animations and demo filtering.
 */
export function slugFromId(id: string) {
  return id.split("/").filter(Boolean).pop() ?? id;
}
