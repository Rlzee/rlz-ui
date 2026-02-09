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

export function resolveComponentSubDirs(resolvedDirs: { components: string }) {
  return {
    uiComponents: path.join(resolvedDirs.components, "ui"),
    baseComponents: path.join(resolvedDirs.components, "ui/base"),
  };
}

export function resolveComponentTypeFromAlias(
  importPath: string,
  aliases: rlzConfig["aliases"]
): "ui" | "base" {
  const entries = [
    { type: "ui" as const, path: aliases.uiComponents },
    { type: "base" as const, path: aliases.baseComponents },
  ];

  const matches = entries
    .filter((e) => importPath.startsWith(e.path))
    .sort((a, b) => b.path.length - a.path.length); // most specific first

  if (matches.length === 0) {
    throw new Error(`Unknown internal component import: ${importPath}`);
  }

  return matches[0].type;
}
