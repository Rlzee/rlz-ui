import { Command } from "commander";
import prompts from "prompts";
import { getPackageInfo } from "../utils/get-package-info";
import { replaceGlobalsCss } from "../utils/css-variables";

export const init = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .action(async () => {
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
    
    // Ask the user if they want to use the src directory
    // const response = await prompts({
    //   type: 'confirm',
    //   name: 'srcDir',
    //   message: 'Do you want to use the src directory?',
    //   initial: true
    // });
    // const useSrcDir = response.srcDir;
    // console.log(`Using src directory: ${useSrcDir}`);
  });
