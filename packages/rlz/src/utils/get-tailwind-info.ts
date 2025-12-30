import fs from "fs";
import path from "path";
import type { PackageJson } from "type-fest";
import type { TailwindInfo } from "../types/tailwind.js";

export function getTailwindInfo(cwd: string, pkg: PackageJson) {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const has = (name: string) => Boolean(deps[name]);

  if (!has("tailwindcss")) {
    return {
      installed: false,
      version: null,
      configPath: null,
    };
  }

  const rawVersion = String(deps["tailwindcss"] ?? "");
  const major = parseInt(rawVersion.replace(/^[^\d]*/, ""), 10);

  const configFiles = [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];

  const configPath =
    configFiles.map((f) => path.join(cwd, f)).find(fs.existsSync) ?? null;

  const tailwindInfo: TailwindInfo = {
    installed: true,
    version: Number.isNaN(major) ? null : major,
    rawVersion,
    configPath,
  };

  return tailwindInfo;
}
