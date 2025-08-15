import { SourceFile } from "ts-morph";
import { getConfigOrDefault } from "./config-manager";

export const resolveAliases = async (sourceFile: SourceFile) => {
  const config = await getConfigOrDefault();
  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const aliasMap = new Map<string, string>();

  allImports.forEach((importPath) => {
    const exactAlias = config.aliases?.[importPath];
    if (exactAlias) {
      aliasMap.set(exactAlias, importPath);
      return;
    }

    if (!importPath.startsWith("@ui/")) {
      return;
    }

    const pathAfterUi = importPath.replace("@ui/", "");
    const segments = pathAfterUi.split("/");
    const firstSegment = segments[0];

    for (const [aliasKey, aliasValue] of Object.entries(config.aliases || {})) {
      if (firstSegment === aliasKey) {
        if (importPath !== aliasValue) {
          aliasMap.set(aliasValue, importPath);
        }
        break;
      }
    }
  });

  return aliasMap;
};
