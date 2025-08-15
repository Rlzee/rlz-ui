import { SourceFile } from "ts-morph";
import { getConfigOrDefault } from "./config-manager";

export const resolveAliases = async (sourceFile: SourceFile) => {
  const config = await getConfigOrDefault();
  const importDeclarations = sourceFile.getImportDeclarations();

  importDeclarations.forEach((importDeclaration) => {
    const importPath = importDeclaration.getModuleSpecifierValue();
    
    // Skip if not a @ui/ import
    if (!importPath.startsWith("@ui/")) {
      return;
    }

    const pathAfterUi = importPath.replace("@ui/", "");
    const segments = pathAfterUi.split("/");
    const firstSegment = segments[0];

    // Find matching alias for the first segment
    for (const [aliasKey, aliasValue] of Object.entries(config.aliases || {})) {
      if (firstSegment === aliasKey) {
        // Replace @ui/lib/utils with @rlz/lib/utils
        // aliasValue is "@rlz/lib", we want to replace "@ui/lib" with "@rlz/lib"
        const newImportPath = importPath.replace(`@ui/${aliasKey}`, aliasValue);
        importDeclaration.setModuleSpecifier(newImportPath);
        break;
      }
    }
  });
};
