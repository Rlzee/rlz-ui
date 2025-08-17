import { uiUrl } from "../config";
import { getUiFile } from "./get-ui-file";
import { getConfigOrDefault } from "./config-manager";
import { resolveAliases } from "./aliases-resolver";
import { Project } from "ts-morph";
import { installDependencies } from "./install-dependencies";
import { addUtilsParamsSchema, type UtilsType } from "../schemas";

export type utils = UtilsType;

export const addUtils = async (name: string, type: UtilsType) => {
  const validatedParams = addUtilsParamsSchema.parse({ name, type });

  let fileName = validatedParams.name;
  if (
    validatedParams.type === "helpers" &&
    !validatedParams.name.endsWith(".helper")
  ) {
    fileName = `${validatedParams.name}.helper`;
  } else if (
    validatedParams.type === "stores" &&
    !validatedParams.name.endsWith(".store")
  ) {
    fileName = `${validatedParams.name}.store`;
  }

  const filePath = `${uiUrl}/${validatedParams.type}/${fileName}.ts`;
  const config = await getConfigOrDefault();
  const baseUiPath = config.uiPath;
  const localPath = `${baseUiPath}/${validatedParams.type}/${fileName}.ts`;

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
