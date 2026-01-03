import type { rlzConfig } from "../types/config";
import { Project } from "ts-morph";
import { addUseClient } from "./add-use-client";
import { logger } from "./logger";

type UpdateComponentParams = {
  filePath: string;
  config: rlzConfig;
};

export async function UpdateComponent({
  filePath,
  config,
}: UpdateComponentParams): Promise<void> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Add "use client" if Next.js and needed
  if (config.framework === "next") {
    addUseClient(sourceFile);
  }

  // Update imports based on aliases
  const aliasMap: rlzConfig["aliases"] = config.aliases;

  sourceFile.getImportDeclarations().forEach((imp) => {
    const moduleSpecifier = imp.getModuleSpecifierValue();

    for (const [aliasKey, aliasPath] of Object.entries(aliasMap)) {
      const defaultAlias = aliasKey;

      if (
        moduleSpecifier === defaultAlias ||
        moduleSpecifier.startsWith(defaultAlias + "/")
      ) {
        imp.setModuleSpecifier(moduleSpecifier.replace(defaultAlias, aliasPath));
        break;
      }
    }
  });

  await sourceFile.save();
  logger.info(`Updated component file: ${filePath}`);
}
