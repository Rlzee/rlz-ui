import { getPackageInfo } from "./get-package-info";

export function getTailwindVersion(): string | undefined {
  const packageInfo = getPackageInfo();

  if (!packageInfo) {
    return undefined;
  }

  const tailwindDep =
    packageInfo.dependencies?.["tailwindcss"] ||
    packageInfo.devDependencies?.["tailwindcss"];

  return tailwindDep ? tailwindDep.replace(/^[\^~><= ]+/, "") : undefined;
}