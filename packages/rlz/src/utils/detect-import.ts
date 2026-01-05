import { SourceFile } from "ts-morph";
import { resolveDirs } from "./resolve-dirs";
import type { rlzConfig } from "../types/config";

type detectedImportsParams = {
  sourceFile: SourceFile;
  dirs: ReturnType<typeof resolveDirs>;
  aliases: rlzConfig["aliases"];
};

type ReturnFunction = {
  dependencies: string[];
  internalComponents: string[];
  internalFiles?: string[];
};

export function detectImport({
  sourceFile,
  dirs,
  aliases,
}: detectedImportsParams): ReturnFunction {
  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const internalComponents = allImports.filter((pkg) =>
    pkg.startsWith(dirs.components)
  );

  const dependencies = allImports.filter((pkg) => {
    if (pkg.startsWith(".") || pkg.startsWith("/")) return false;
    if (pkg.startsWith("@/") || pkg.startsWith("~/")) return false;
    if (pkg.startsWith(dirs.components)) return false;
    if (Object.values(aliases).some((alias) => pkg.startsWith(alias)))
      return false;
    return true;
  });

  const internalFiles = allImports.filter((pkg) => {
    if (
      pkg.startsWith(aliases.baseComponent) ||
      pkg.startsWith(aliases.uiComponents)
    )
      return false;
    if (Object.values(aliases).some((alias) => pkg.startsWith(alias)))
      return true;
  });

  return {
    dependencies,
    internalComponents,
    internalFiles,
  };
}
