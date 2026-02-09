import type { rlzConfig } from "@/config/types";
import { addUseClient } from "./add-use-client";
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

    const pathAfterUi = specifier.replace("@/", "");
    const segments = pathAfterUi.split("/");
    const firstSegment = segments[0];

    // Find matching alias for the first segment
    for (const [aliasKey, aliasValue] of Object.entries(config.aliases || {})) {
      if (firstSegment === aliasKey) {
        // Replace @ui/lib/utils with @rlz/lib/utils
        // aliasValue is "@rlz/lib", we want to replace "@ui/lib" with "@rlz/lib"
        const newImportPath = specifier.replace(`@/${aliasKey}`, aliasValue);
        imp.setModuleSpecifier(newImportPath);
        break;
      }
    }
  });

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
