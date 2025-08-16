import { uiUrl } from "../config";
import { getUiFile } from "./get-ui-file";
import { getConfigOrDefault } from "./config-manager";
import { resolveAliases } from "./aliases-resolver";
import { Project } from "ts-morph";
import { installDependencies } from "./install-dependencies";

export type utils = "helpers" | "hooks" | "lib" | "types" | "stores" | "utils";

export const addUtils = async (name: string, type: utils) => {
  const filePath = `${uiUrl}/${type}/${name}.ts`;
  const config = await getConfigOrDefault();
  const baseUiPath = config.uiPath;
  const localPath = `${baseUiPath}/${type}/${name}.ts`;

  await getUiFile(filePath, localPath);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(localPath);
  await resolveAliases(sourceFile);
  await sourceFile.save();

  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const npmDeps = allImports.filter((pkg) => {
    if (pkg.startsWith(".") || pkg.startsWith("/")) return false;
    if (pkg.startsWith("@/") || pkg.startsWith("~/")) return false;
    if (pkg.startsWith("@ui/")) return false;
    if (config.aliases) {
      for (const aliasValue of Object.values(config.aliases)) {
        if (pkg.startsWith(aliasValue)) return false;
      }
    }
    return true;
  });

  if (npmDeps.length > 0) {
    await installDependencies(npmDeps, process.cwd(), true);
  }
};
