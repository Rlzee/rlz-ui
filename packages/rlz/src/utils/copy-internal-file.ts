import path from "path";
import fs from "fs-extra";
import { getUiFile } from "@/src/utils/get-ui-file";
import { logger } from "./logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { UI_URL } from "@/src/config";
import { installDependencies } from "@/src/utils/install-dependencies";

type DepsManifest = {
  dependencies?: string[];
};

export async function copyInternalFile(
  dep: string,
  dirs: ReturnType<typeof resolveDirs>,
  cwd: string
): Promise<void> {
  const baseDirKey = Object.keys(dirs).find((key) => dep.startsWith(key));

  if (!baseDirKey) {
    logger.warn(
      `No matching directory found in config for internal file "${dep}". Skipping.`
    );
    return;
  }

  const destDir = dirs[baseDirKey as keyof typeof dirs] as string;
  const fileName = path.basename(dep);
  const destPath = path.join(destDir, `${fileName}.ts`);

  await fs.ensureDir(path.dirname(destPath));

  const sourceUrl = `${UI_URL}/${dep}.ts`;
  await getUiFile(sourceUrl, destPath);

  logger.info(`Copied internal file "${dep}" to ${destPath}`);

  if (baseDirKey === "types") {
    return;
  }

  const depsUrl = `${UI_URL}/${dep}/deps.json`;

  try {
    const tempDepsPath = path.join(destDir, `${fileName}.deps.json`);
    await getUiFile(depsUrl, tempDepsPath);

    const raw = await fs.readFile(tempDepsPath, "utf-8");

    let deps: string[] | undefined;

    try {
      const parsed = JSON.parse(raw) as DepsManifest;
      if (Array.isArray(parsed.dependencies)) {
        deps = parsed.dependencies;
      }
    } catch {
      logger.warn(`Invalid deps.json format for "${dep}"`);
    }

    if (deps?.length) {
      await installDependencies(deps, cwd);
      logger.info(
        `Installed dependencies for internal file "${dep}": ${deps.join(", ")}`
      );
    }

    await fs.remove(tempDepsPath);
  } catch (err: any) {
    if (!err.message?.includes("404")) {
      logger.warn(
        `Failed to fetch deps.json for internal file "${dep}": ${err.message}`
      );
    }
  }
}
