import type { PackageJson } from "type-fest";
import type { TailwindInfo } from "../types/tailwind.js";

export function getTailwindInfo(cwd: string, pkg: PackageJson): TailwindInfo {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const has = (name: string) => Boolean(deps[name]);

  if (!has("tailwindcss")) {
    return {
      installed: false,
      version: null,
      rawVersion: null,
    };
  }

  const rawVersion = String(deps["tailwindcss"] ?? "");
  const major = parseInt(rawVersion.replace(/^[^\d]*/, ""), 10);

  return {
    installed: true,
    version: Number.isNaN(major) ? null : major,
    rawVersion,
  };
}
