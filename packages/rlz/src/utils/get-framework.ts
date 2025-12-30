import type { PackageJson } from "type-fest";
import type { FrameworkInfo } from "../types/framework.js";

export function getFramework(pkg: PackageJson): FrameworkInfo {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const has = (name: string) => Boolean(deps?.[name]);

  // Next.js
  if (has("next")) {
    return {
      framework: "next",
    };
  }

  // Vite + React
  if (has("vite") && has("react")) {
    return {
      framework: "vite",
    };
  }

  // React (CRA / custom)
  if (has("react")) {
    return {
      framework: "react",
    };
  }

  return {
    framework: "invalid",
  };
}
