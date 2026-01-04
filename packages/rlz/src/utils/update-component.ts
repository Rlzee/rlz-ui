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

  if (config.framework === "next") {
    addUseClient(sourceFile);
  }

  const aliases = config.aliases;

  sourceFile.getImportDeclarations().forEach((imp) => {
    const specifier = imp.getModuleSpecifierValue();
    if (!specifier.startsWith("@/")) return;

    for (const [key, userAlias] of Object.entries(aliases)) {
      const canonical = `@/${key}`;

      if (specifier === canonical || specifier.startsWith(canonical + "/")) {
        const rest = specifier.slice(canonical.length + 1);
        const parts = rest.split("/");

        if (parts.length >= 2 && parts.at(-1) === parts.at(-2)) {
          parts.pop();
        }

        const finalPath =
          parts.length > 0 ? `${userAlias}/${parts.join("/")}` : userAlias;

        imp.setModuleSpecifier(finalPath);
        return;
      }
    }
  });

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
