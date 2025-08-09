import { Command } from "commander";
import prompts from "prompts";
import { getPackageInfo } from "../utils/get-package-info";
import { replaceGlobalsCss } from "../utils/css-variables";
import fs from "fs-extra";
import path from "path";

export const init = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .action(async () => {
    try {
      const packageInfo = await getPackageInfo();
      if (!packageInfo) {
        console.error("No package information found.");
        return;
      }

      const tailwindDep =
        packageInfo.dependencies?.["tailwindcss"] ||
        packageInfo.devDependencies?.["tailwindcss"];

      if (!tailwindDep) {
        console.error(
          "You must install tailwindcss v4 or higher before initializing rlz-ui.\nRun: pnpm add -D tailwindcss@^4"
        );
        return;
      }

      const cleanedVersion = tailwindDep.replace(/^[\^~><= ]+/, "");
      const versionMatch = cleanedVersion.match(/^(\d+)/);

      if (!versionMatch) {
        console.error(
          "Could not determine tailwindcss version. Please install tailwindcss v4 or higher."
        );
        return;
      }

      const major = Number(versionMatch[1]);
      if (isNaN(major) || major < 4) {
        console.error(
          "You must install tailwindcss v4 or higher before initializing rlz-ui.\nRun: pnpm add -D tailwindcss@^4"
        );
        return;
      }

      await replaceGlobalsCss();

      const response = await prompts({
        type: "confirm",
        name: "srcDir",
        message: "Do you want to use the src directory?",
        initial: true,
      });

      if (response.srcDir) {

        const srcDir = path.join(process.cwd(), "src");
        await fs.ensureDir(srcDir);
        const uiDir = path.join(srcDir, "ui");
        await fs.ensureDir(uiDir);
        console.log(`Created src directory at ${srcDir}`);
        console.log(`Created ui directory at ${uiDir}`);
      } else {
        const uiDir = path.join(process.cwd(), "ui");
        await fs.ensureDir(uiDir);
        console.log(`Created ui directory at ${uiDir}`);
      }

      console.log("✅ rlz-ui initialized successfully!");
    } catch (error) {
      console.error("An error occurred during initialization:", error);
    }
  });
