import { SourceFile } from "ts-morph";
import type { rlzConfig } from "@/config/types";

type detectedImportsParams = {
  sourceFile: SourceFile;
  aliases: rlzConfig["aliases"];
};

type ReturnFunction = {
  dependencies: string[];
  internalComponents: string[];
  internalFiles?: string[];
};

export function detectImport({
  sourceFile,
  aliases,
}: detectedImportsParams): ReturnFunction {
  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const internalComponents = allImports.filter(
    (pkg) =>
      pkg.startsWith(aliases.uiComponents) ||
      pkg.startsWith(aliases.baseComponents)
  );

  const dependencies = allImports.filter((pkg) => {
    if (pkg.startsWith(".") || pkg.startsWith("/")) return false;

    if (Object.values(aliases).some((alias) => pkg.startsWith(alias)))
      return false;

    return true;
  });

  const internalFiles = allImports.filter((pkg) => {
    if (
      pkg.startsWith(aliases.uiComponents) ||
      pkg.startsWith(aliases.baseComponents)
    )
      return false;

    return Object.values(aliases).some((alias) => pkg.startsWith(alias));
  });

  return {
    dependencies,
    internalComponents,
    internalFiles,
  };
}
