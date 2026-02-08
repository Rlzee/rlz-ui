import path from "path";
import type { rlzConfig } from "../types/config";

export function resolveDirs({
  dirs,
  cwd,
}: {
  dirs: rlzConfig["dirs"];
  cwd: string;
}): Required<
  rlzConfig["dirs"] & {
    uiComponents: string;
    baseComponents: string;
  }
> {
  const givenRoot = dirs.root || ".";
  const rootPath = path.isAbsolute(givenRoot)
    ? path.normalize(givenRoot)
    : path.resolve(cwd, givenRoot);

  function resolveField(value: string | undefined, defaultSegments: string[]) {
    if (value && value.length > 0) {
      return path.isAbsolute(value)
        ? path.normalize(value)
        : path.resolve(rootPath, value);
    }

    return path.join(rootPath, ...defaultSegments);
  }

  const components = resolveField(dirs.components, ["components"]);
  const uiComponents = path.join(components, "ui");
  const baseComponents = path.join(components, "base");
  const utils = resolveField(dirs.utils, ["utils"]);
  const types = resolveField(dirs.types, ["types"]);
  const lib = resolveField(dirs.lib, ["lib"]);
  const hooks = resolveField(dirs.hooks, ["hooks"]);
  const stores = resolveField(dirs.stores, ["hooks"]);

  return {
    root: rootPath,
    components,
    uiComponents,
    baseComponents,
    utils,
    types,
    lib,
    hooks,
    stores,
  };
}
