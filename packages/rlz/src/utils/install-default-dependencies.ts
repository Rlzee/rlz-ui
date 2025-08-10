import { installDependencies } from "./install-dependencies";
/**
 * Installs the default dependencies required for rlz-ui.
 * @param cwd The working directory where dependencies should be installed (default: process.cwd())
 */
export async function installDefaultDependencies(cwd: string = process.cwd()) {
  const deps = ["@radix-ui/react-slot", "clsx", "tailwind-merge"];
  await installDependencies(deps, cwd);
}
