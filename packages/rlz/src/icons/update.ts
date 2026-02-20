import type { IconLib } from "./libs";
import { ICON_LIBS } from "./libs";
import { ICON_MAP } from "./map";
import type { SourceFile } from "ts-morph";
import type { IconName } from "./names";

type updateIconsProps = {
  sourceFile: SourceFile;
  iconLib: IconLib;
};

/**
 * Rewrite icon imports from one icon package to another using ICON_MAP.
 *
 * Behavior:
 * - Finds import declarations that import from any known icon package (values in ICON_LIBS).
 * - For each named import (e.g. `import { Check } from "lucide-react"`), determine the "icon key"
 *   by looking up which key in ICON_MAP[sourceLib] maps to the imported name.
 * - Replace the imported name with the corresponding name for `iconLib`.
 * - Preserve local aliases (e.g. `Check as CheckIcon` -> `IconCheck as CheckIcon`).
 * - Update the module specifier to the target package (ICON_LIBS[iconLib].package).
 *
 * Notes:
 * - Default imports and namespace imports (e.g. `import * as Icons from ...`) are left untouched.
 * - If a named import cannot be mapped (no matching export name in ICON_MAP[sourceLib]),
 *   it will be skipped.
 */
export async function updateIcons({ sourceFile, iconLib }: updateIconsProps) {
  const libEntries = Object.entries(ICON_LIBS) as [
    IconLib,
    { package: string }
  ][];
  const knownPackages = new Map<string, IconLib>();
  for (const [libKey, libMeta] of libEntries) {
    knownPackages.set(libMeta.package, libKey);
  }

  if (!ICON_LIBS[iconLib]) return;

  const targetPackage = ICON_LIBS[iconLib].package;
  const targetMap = ICON_MAP[iconLib];

  for (const imp of sourceFile.getImportDeclarations()) {
    const specifier = imp.getModuleSpecifierValue();

    const sourceLib = knownPackages.get(specifier);
    if (!sourceLib) continue;

    const changeModuleSpecifier = specifier !== targetPackage;

    const sourceMap = ICON_MAP[sourceLib];

    const namedImports = imp.getNamedImports();
    if (namedImports.length === 0) {
      if (changeModuleSpecifier) {
        imp.setModuleSpecifier(targetPackage);
      }
      continue;
    }

    for (const ni of namedImports) {
      const importedName = ni.getName();

      const iconKey = (Object.keys(sourceMap) as IconName[]).find(
        (k) => sourceMap[k] === importedName
      );

      if (!iconKey) {
        continue;
      }

      const desiredName = targetMap[iconKey];
      if (!desiredName) continue;

      const aliasNode = ni.getAliasNode && ni.getAliasNode();
      const aliasText = aliasNode ? aliasNode.getText() : null;

      const replacement = aliasText
        ? `${desiredName} as ${aliasText}`
        : desiredName;

      ni.replaceWithText(replacement);
    }

    if (changeModuleSpecifier) {
      imp.setModuleSpecifier(targetPackage);
    }
  }

  await sourceFile.save();
}
