import path from "path";
import fs from "fs-extra";
import { getUiFile } from "@/src/utils/get-ui-file";
import { logger } from "./logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { UI_URL } from "@/src/config";

export async function copyInternalFile(dep: string, dirs: ReturnType<typeof resolveDirs>, cwd: string) {
  const matchedDirKey = Object.keys(dirs).find((key) => dep.startsWith(key));
  if (!matchedDirKey) {
    logger.warn(`No matching directory found in config for internal file "${dep}". Skipping.`);
    return;
  }

  const destDir = dirs[matchedDirKey as keyof typeof dirs] as string;
  const destPath = path.join(destDir, path.basename(dep) + ".ts");

  await fs.ensureDir(path.dirname(destPath));

  const sourceUrl = `${UI_URL}/${dep}.ts`;
  await getUiFile(sourceUrl, destPath);

  logger.info(`Copied internal file "${dep}" to ${destPath}`);
}
