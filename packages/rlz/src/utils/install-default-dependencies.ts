import { execSync } from "child_process";
import { getPackageManager } from "./get-package-manager";

/**
 * Installs the default dependencies required for rlz-ui.
 * @param cwd The working directory where dependencies should be installed (default: process.cwd())
 */
export async function installDefaultDependencies(cwd: string = process.cwd()) {
  const deps = ["@radix-ui/react-slot", "clsx", "tailwind-merge"];
  const pkgManager = await getPackageManager(cwd);
  let installCmd = "";
  if (pkgManager === "npm") {
    installCmd = `npm install ${deps.join(" ")}`;
  } else if (pkgManager === "yarn") {
    installCmd = `yarn add ${deps.join(" ")}`;
  } else {
    installCmd = `pnpm add ${deps.join(" ")}`;
  }
  console.log(
    `Installing default dependencies: ${deps.join(", ")} using ${pkgManager}`
  );
  execSync(installCmd, { stdio: "inherit", cwd });
  console.log("Default dependencies have been installed.");
}
