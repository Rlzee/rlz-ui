import { execSync } from "child_process";
import { getPackageManager } from "./get-package-manager";
import { getPackageInfo } from './get-package-info';

/**
 * Installs the default dependencies required for rlz-ui.
 * @param cwd The working directory where dependencies should be installed (default: process.cwd())
 */
export async function installDefaultDependencies(cwd: string = process.cwd()) {
  const deps = ["@radix-ui/react-slot", "clsx", "tailwind-merge"];
  const pkgInfo = await getPackageInfo(cwd);
  const installed = {
    ...pkgInfo?.dependencies,
    ...pkgInfo?.devDependencies,
  };
  const toInstall = deps.filter(dep => !installed[dep]);
  if (toInstall.length === 0) {
    console.log('All default dependencies are already installed.');
    return;
  }
  const pkgManager = await getPackageManager(cwd);
  let installCmd = '';
  if (pkgManager === 'npm') {
    installCmd = `npm install ${toInstall.join(' ')}`;
  } else if (pkgManager === 'yarn') {
    installCmd = `yarn add ${toInstall.join(' ')}`;
  } else {
    installCmd = `pnpm add ${toInstall.join(' ')}`;
  }
  console.log(`Installing default dependencies: ${toInstall.join(', ')} using ${pkgManager}`);
  execSync(installCmd, { stdio: 'inherit', cwd });
  console.log('Default dependencies have been installed.');
}
