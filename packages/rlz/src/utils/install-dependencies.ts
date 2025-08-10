import { execSync } from "child_process";
import { getPackageInfo } from "./get-package-info";
import { getPackageManager } from "./get-package-manager";

/**
 * Installs the given dependencies if they are not already installed.
 * @param deps Array of package names to install
 * @param cwd Working directory (default: process.cwd())
 */
export async function installDependencies(
  deps: string[],
  cwd: string = process.cwd()
) {
  if (!deps.length) return;
  const pkgInfo = await getPackageInfo(cwd);
  const installed = {
    ...pkgInfo?.dependencies,
    ...pkgInfo?.devDependencies,
  };
  const toInstall = deps.filter((dep) => !installed[dep]);
  if (toInstall.length === 0) {
    console.log("All specified dependencies are already installed.");
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
