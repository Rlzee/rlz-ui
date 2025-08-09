
import { execSync } from 'child_process';
import { getPackageInfo } from './get-package-info';

/**
 * Checks if 'lucide-react' is installed in the project, installs it if not present.
 * @param cwd The root directory of the project (where package.json is located)
 */
export function ensureLucideReactInstalled(cwd: string = process.cwd()) {
  const pkg = getPackageInfo(cwd);
  if (!pkg) {
    throw new Error(`No package.json found in ${cwd}`);
  }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (!deps['lucide-react']) {
    console.log("Installing 'lucide-react'...");
    execSync('pnpm add lucide-react', { stdio: 'inherit', cwd });
    console.log("'lucide-react' has been installed.");
  } else {
    console.log("'lucide-react' is already installed.");
  }
}
