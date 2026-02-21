import type { IconLib } from "./libs";
import { ICON_LIBS } from "./libs";
import { ICON_MAP } from "./map";
import type { SourceFile } from "ts-morph";
import type { IconName } from "./names";

type updateIconsProps = {
  sourceFile: SourceFile;
  iconLib: IconLib;
};

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

      let replacement: string;
      if (aliasText) {
        replacement = `${desiredName} as ${aliasText}`;
      } else if (desiredName !== importedName) {
        replacement = `${desiredName} as ${importedName}`;
      } else {
        replacement = desiredName;
      }

      ni.replaceWithText(replacement);
    }

    if (changeModuleSpecifier) {
      imp.setModuleSpecifier(targetPackage);
    }
  }

  await sourceFile.save();
}
