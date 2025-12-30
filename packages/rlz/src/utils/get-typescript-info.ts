import fs from "fs";
import path from "path";
import type { PackageJson } from "type-fest";
import type { TypeScriptInfo } from "../types/typescript.js";

export function getTypeScriptInfo(
  cwd: string,
  pkg: PackageJson
): TypeScriptInfo {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const has = (name: string) => Boolean(deps[name]);

  if (!has("typescript")) {
    return {
      installed: false,
      version: null,
      rawVersion: null,
      configPath: null,
      jsx: false,
      moduleResolution: null,
    };
  }

  const rawVersion = String(deps.typescript ?? "");
  const major = parseInt(rawVersion.replace(/^[^\d]*/, ""), 10);

  const configPath = path.join(cwd, "tsconfig.json");
  if (!fs.existsSync(configPath)) {
    return {
      installed: true,
      version: Number.isNaN(major) ? null : major,
      rawVersion,
      configPath: null,
      jsx: false,
      moduleResolution: null,
    };
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const compilerOptions = config.compilerOptions ?? {};

  return {
    installed: true,
    version: Number.isNaN(major) ? null : major,
    rawVersion,
    configPath,
    jsx: Boolean(compilerOptions.jsx),
    moduleResolution: compilerOptions.moduleResolution ?? null,
  };
}
