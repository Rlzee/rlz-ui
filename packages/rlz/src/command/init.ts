import { Command } from "commander";
import prompts from "prompts";
import { getPackageInfo } from "../utils/get-package-info";
import { replaceGlobalsCss } from "../utils/css-variables";
import { installDependencies } from "../utils/install-dependencies";
import { defaultDepencies } from "../config";
import { defaultStructure } from "../utils/default-structure";
import { saveConfig } from "../utils/config-manager";

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

      const srcDirResponse = await prompts({
        type: "confirm",
        name: "srcDir",
        message: "Do you want to use the src directory?",
        initial: true,
      });

      const cssPathResponse = await prompts({
        type: "text",
        name: "cssPath",
        message: "Enter the path to your css file:",
        initial: "app/globals.css",
      });

      await saveConfig({ srcDir: srcDirResponse.srcDir, cssPath: cssPathResponse.cssPath });
      await replaceGlobalsCss();
      await installDependencies(defaultDepencies, process.cwd());
      await defaultStructure(srcDirResponse.srcDir);

      console.log("✅ rlz-ui initialized successfully!");
    } catch (error) {
      console.error("An error occurred during initialization:", error);
    }
  });
