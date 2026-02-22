import { getPackageManager } from "@/utils/get-package-manager";
import { installDependencies } from "@/utils/install-dependencies";
import { execa } from "execa";

import type { Framework } from "@/types/framework";
type createOptions = {
  cwd: string;
  project: {
    name: string;
    framework: Framework;
  };
};

export async function runCreateCommand({
  cwd,
  project,
}: createOptions): Promise<void> {
  const packageManager = await getPackageManager(cwd);

  if (project.framework === "next") {
    await execa(
      packageManager,
      [
        "create",
        "next-app",
        project.name,
        "--ts",
        "--eslint",
        "--app",
        "--src-dir",
        "--use-pnpm",
      ],
      { stdio: "inherit", cwd }
    );
  }

  if (project.framework === "vite") {
    await execa(
      packageManager,
      ["create", "vite", project.name, "--template", "react-swc-ts"],
      { stdio: "inherit", cwd }
    );
  }

  if (project.framework === "react") {
    await execa(
      packageManager,
      ["create", "vite", project.name, "--template", "react-ts"],
      { stdio: "inherit", cwd }
    );
  }
}
