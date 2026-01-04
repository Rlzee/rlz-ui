import path from "path";
import fs from "fs-extra";
import { getUiFile } from "@/src/utils/get-ui-file";
import { logger } from "./logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { UI_URL } from "@/src/config";
import { installDependencies } from "@/src/utils/install-dependencies";
import { getJsonManifest } from "@/src/utils/get-json-manifest";

type DepsManifest = {
  dependencies?: string[];
};

export async function copyInternalFile(
  dep: string,
  dirs: ReturnType<typeof resolveDirs>,
  cwd: string
): Promise<void> {
  const [type, ...rest] = dep.split("/");

  const destBaseDir = dirs[type as keyof typeof dirs];
  if (!destBaseDir) {
    logger.warn(`No destination dir for internal file "${dep}"`);
    return;
  }

  const relativePath = rest.join("/");

  const sourceUrl = `${UI_URL}/${dep}.ts`;
  // Pass the base destination directory for this type (e.g. `dirs.lib`).
  // `getUiFile` accepts a directory or file path now and will derive filename.
  await getUiFile(sourceUrl, (dirs as any)[type]);

  if (type === "types") return;

  try {
    const depsUrl = `${UI_URL}/${type}/${path.dirname(relativePath)}/deps.json`;
    const depsManifest = await getJsonManifest<DepsManifest>(depsUrl);

    if (depsManifest.dependencies?.length) {
      await installDependencies(depsManifest.dependencies, cwd, true);
      // logger.info(
      //   `Installed deps for "${dep}": ${depsManifest.dependencies.join(", ")}`
      // );
    }
  } catch (err: any) {
    if (!err.message?.includes("404")) {
      logger.warn(`deps.json error for "${dep}": ${err.message}`);
    }
  }
}
