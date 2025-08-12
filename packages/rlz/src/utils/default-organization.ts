import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";
import path from "path";
import fs from "fs-extra";

export async function defaultOrganization(srcDir: boolean) {
  let uiDir: string;
  if (srcDir) {
    const srcDir = path.join(process.cwd(), "src");
    await fs.ensureDir(srcDir);
    uiDir = path.join(srcDir, "ui");
    await fs.ensureDir(uiDir);
  } else {
    uiDir = path.join(process.cwd(), "ui");
    await fs.ensureDir(uiDir);
  }
  const libDir = path.join(uiDir, "lib");
  await fs.ensureDir(libDir);
  const url = `${uiUrl}/lib/utils.ts`;
  const filePath = path.join(libDir, "utils.ts");
  await getUiFile(url, filePath);
}
