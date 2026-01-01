import { execSync } from "child_process";
import { getPackageInfo } from "./get-package-info";
import { getPackageManager } from "./get-package-manager";
import { isZodError, formatZodError } from "./validation";
import { logger } from "./logger";
import { z } from "zod";

// Zod schema to validate npm package names

const npmPackageNameSchema = z
  .string()
  .regex(
    /^(@[a-zA-Z0-9-~][a-zA-Z0-9-._~]*\/)?[a-zA-Z0-9-~][a-zA-Z0-9-._~]*$/,
    "Invalid npm package name"
  );

/**
 * Installs the given dependencies if they are not already installed.
 * @param deps Array of package names to install
 * @param cwd Working directory (default: process.cwd())
 * @param silent If true, suppresses console output (default: false)
 */
export async function installDependencies(
  deps: string[],
  cwd: string = process.cwd(),
  silent: boolean = false
) {
  if (!deps.length) return;

  try {
    deps.forEach((dep) => {
      let packageName: string;

      if (dep.startsWith("@")) {
        // Scoped package: @scope/package or @scope/package@version
        const parts = dep.split("@");
        if (parts.length === 2) {
          // @scope/package (no version)
          packageName = dep;
        } else {
          // @scope/package@version
          packageName = `@${parts[1]}`;
        }
      } else {
        // Regular package: package or package@version
        packageName = dep.split("@")[0];
      }

      npmPackageNameSchema.parse(packageName);
    });
  } catch (error) {
    if (isZodError(error)) {
      logger.error("Invalid package name:", formatZodError(error));
      return;
    }
  }
  const pkgInfo = await getPackageInfo(cwd);
  const installed = {
    ...pkgInfo?.dependencies,
    ...pkgInfo?.devDependencies,
  };
  const toInstall = deps.filter((dep) => !installed[dep]);
  if (toInstall.length === 0) {
    if (!silent) {
      console.log("All specified dependencies are already installed.");
    }
    return;
  }
  const pkgManager = await getPackageManager(cwd);
  let installCmd = "";
  if (pkgManager === "npm") {
    installCmd = `npm install ${toInstall.join(" ")}`;
  } else if (pkgManager === "yarn") {
    installCmd = `yarn add ${toInstall.join(" ")}`;
  } else {
    installCmd = `pnpm add ${toInstall.join(" ")}`;
  }
  console.log(
    `Installing dependencies: ${toInstall.join(", ")} using ${pkgManager}`
  );
  execSync(installCmd, { stdio: "inherit", cwd });
  console.log("Dependencies have been installed.");
}
