import type { rlzConfig } from "@/config/types";
import { addUseClient } from "./add-use-client";
import { defaultUiComponentsAliases } from "@/config/constants";
import { SourceFile } from "ts-morph";

type UpdateComponentParams = {
  sourceFile: SourceFile;
  config: rlzConfig;
};

export async function UpdateComponent({
  sourceFile,
  config,
}: UpdateComponentParams): Promise<void> {
  if (config.framework === "next") {
    addUseClient(sourceFile);
  }

  sourceFile.getImportDeclarations().forEach((imp) => {
    const specifier = imp.getModuleSpecifierValue();
    if (!specifier.startsWith("@/")) return;

    // normalize the path after the leading "@/":
    const specPath = specifier.slice(2); // remove leading "@/"

    // FIRST: If the import uses one of the default UI-component aliases (from installed components),
    // replace it with the user's configured alias for that key (if present).
    // This ensures that packages installed with the default aliases (e.g. "@/components/base")
    // are normalized to whatever the user configured (e.g. "@/components/ui/base") before
    // the general alias matching below runs.
    for (const [key, defaultAliasValue] of Object.entries(
      defaultUiComponentsAliases
    )) {
      const defaultAliasFull = String(defaultAliasValue);
      const defaultAliasPath = defaultAliasFull.startsWith("@/")
        ? defaultAliasFull.slice(2)
        : defaultAliasFull;

      const userAliasFull =
        config.aliases && (config.aliases as any)[key]
          ? String((config.aliases as any)[key])
          : null;
      if (!userAliasFull) continue;

      if (
        specPath === defaultAliasPath ||
        specPath.startsWith(defaultAliasPath + "/")
      ) {
        const newImportPath = specifier.replace(
          `@/${defaultAliasPath}`,
          userAliasFull
        );
        imp.setModuleSpecifier(newImportPath);
        return;
      }
    }
  });

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
