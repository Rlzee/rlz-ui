/**
 * Last URL segment of a docs page id (or the registry key itself) is the demo
 * folder name and, for our pilots, the registry component id. Shared by the
 * properties panel (capability lookup) and the playground (demo filtering).
 */
export function slugFromId(id: string) {
  return id.split("/").filter(Boolean).pop() ?? id;
}
