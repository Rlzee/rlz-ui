import type { PackageJson } from "type-fest";
import path from "path";
import fs from "fs";

import type { FrameworkInfo } from "../types/framework.js";

export function getFramework(
  cwd: string,
  pkg: PackageJson
): FrameworkInfo {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const has = (name: string) => Boolean(deps?.[name]);

  // Next.js
  if (has("next")) {
    return {
      framework: "next",
      appDir: fs.existsSync(path.join(cwd, "app")) ? "app" : "pages",
    };
  }

  // Vite + React
  if (has("vite") && has("react")) {
    return {
      framework: "vite",
      appDir: "src",
    };
  }

  // React (CRA / custom)
  if (has("react")) {
    return {
      framework: "react",
      appDir: "src",
    };
  }

  return {
    framework: "invalid",
    appDir: "",
  };
}
