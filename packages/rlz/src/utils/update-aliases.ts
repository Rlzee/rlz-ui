import type { rlzConfig } from "@/config/types";
import type { SourceFile } from "ts-morph";

export function updateAliases({
  sourceFile,
  config,
}: {
  sourceFile: SourceFile;
  config: rlzConfig;
}) {
  const aliases = config.aliases;

  if (!aliases) return;

  sourceFile.getImportDeclarations().forEach((imp) => {
    const specifier = imp.getModuleSpecifierValue();

    if (!specifier.startsWith("@rlz/ui/")) return;

    const path = specifier.replace("@rlz/ui/", "");

    if (path.startsWith("components/")) {
      imp.setModuleSpecifier(
        `${aliases.components}/${path.replace("components/", "")}`
      );
    }

    if (path.startsWith("hooks/")) {
      imp.setModuleSpecifier(`${aliases.hooks}/${path.replace("hooks/", "")}`);
    }

    if (path.startsWith("lib/")) {
      imp.setModuleSpecifier(`${aliases.lib}/${path.replace("lib/", "")}`);
    }
  });
}
