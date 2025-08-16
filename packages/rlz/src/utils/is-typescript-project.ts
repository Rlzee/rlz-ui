import { getPackageInfo } from "./get-package-info";
import fs from "fs";
import path from "path";

export function isTypeScriptProject(cwd: string = process.cwd()): boolean {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    return true;
  }

  const packageInfo = getPackageInfo(cwd, false);
  if (!packageInfo) {
    return false;
  }

  const dependencies = {
    ...packageInfo.dependencies,
    ...packageInfo.devDependencies,
  };

  return !!(
    dependencies.typescript ||
    dependencies["@types/node"] ||
    dependencies["@types/react"] ||
    dependencies["@types/react-dom"]
  );
}
