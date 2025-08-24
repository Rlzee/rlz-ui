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

  const filePathTs = `${uiUrl}/${validatedParams.type}/${fileName}.ts`;
  const filePathTsx = `${uiUrl}/${validatedParams.type}/${fileName}.tsx`;
  const filePathDts = `${uiUrl}/${validatedParams.type}/${fileName}.d.ts`;
  const config = await getConfigOrDefault();
  const baseUiPath = config.uiPath;
  const localPathTs = `${baseUiPath}/${validatedParams.type}/${fileName}.ts`;
  const localPathTsx = `${baseUiPath}/${validatedParams.type}/${fileName}.tsx`;
  const localPathDts = `${baseUiPath}/${validatedParams.type}/${fileName}.d.ts`;

  let sourceFilePath;
  try {
    await getUiFile(filePathTs, localPathTs);
    sourceFilePath = localPathTs;
  } catch (err) {
    try {
      await getUiFile(filePathTsx, localPathTsx);
      sourceFilePath = localPathTsx;
    } catch (err2) {
      await getUiFile(filePathDts, localPathDts);
      sourceFilePath = localPathDts;
    }
  }

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(sourceFilePath);
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
