import path from "path";
import fs from "fs-extra";
import { getUiFile } from "@/src/utils/get-ui-file";
import { logger } from "./logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { UI_URL } from "@/src/config";
import { installDependencies } from "@/src/utils/install-dependencies";

export async function copyInternalFile(
  dep: string,
  dirs: ReturnType<typeof resolveDirs>,
  cwd: string
) {
  const baseDirKey = Object.keys(dirs).find((key) => dep.startsWith(key));
  if (!baseDirKey) {
    logger.warn(
      `No matching directory found in config for internal file "${dep}". Skipping.`
    );
    return;
  }

  const destDir = dirs[baseDirKey as keyof typeof dirs] as string;
  const destPath = path.join(destDir, `${path.basename(dep)}.ts`);

  await fs.ensureDir(path.dirname(destPath));

  const sourceUrl = `${UI_URL}/${dep}.ts`;
  await getUiFile(sourceUrl, destPath);
  logger.info(`Copied internal file "${dep}" to ${destPath}`);

  if (!dep.startsWith("types")) {
    const depsUrl = `${UI_URL}/${dep}/deps.json`;
    try {
      const tempDepsPath = path.join(
        destDir,
        `${path.basename(dep)}-deps.json`
      );
      await getUiFile(depsUrl, tempDepsPath);

      const depsContent = await fs.readFile(tempDepsPath, "utf-8");
      const deps = JSON.parse(depsContent)?.npm as string[] | undefined;
      if (deps && deps.length) {
        await installDependencies(deps, cwd);
        logger.info(
          `Installed dependencies for internal file "${dep}": ${deps.join(
            ", "
          )}`
        );
      }

      await fs.remove(tempDepsPath);
    } catch (err: any) {
      if (!err.message.includes("404")) {
        logger.warn(`Failed to fetch deps.json for "${dep}": ${err.message}`);
      }
    }
  }
}
