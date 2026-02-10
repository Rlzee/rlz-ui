import path from "path";
import { DIR_DEFINITION } from "./def";
import type { rlzConfig } from "./types";

export function resolveDirs({
  dirs,
  cwd,
}: {
  dirs: rlzConfig["dirs"];
  cwd: string;
}) {
  const root = dirs.root || ".";
  const rootPath = path.isAbsolute(root)
    ? path.normalize(root)
    : path.resolve(cwd, root);

  const resolved: Record<string, string> = {
    root: rootPath,
  };

  for (const [key, defaultSegments] of Object.entries(DIR_DEFINITION)) {
    const value = (dirs as any)[key];

    if (value) {
      resolved[key] = path.isAbsolute(value)
        ? path.normalize(value)
        : path.resolve(rootPath, value);
    } else {
      resolved[key] = path.join(rootPath, ...defaultSegments);
    }
  }

  return resolved as {
    root: string;
  } & Record<keyof typeof DIR_DEFINITION, string>;
}
