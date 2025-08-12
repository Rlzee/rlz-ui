import { uiUrl } from "../config";
import { Project } from "ts-morph";
import { getUiFile } from "./get-ui-file";
import path from "path";
import { installDependencies } from "./install-dependencies";

export type componentType =
  | "text"
  | "background"
  | "custom"
  | "animation"
  | null;

export const addComponent = async ({
  component,
  options,
}: {
  component: string;
  options: { type?: componentType };
}) => {
  let componentUrl;
  let componentPath;

  if (!options.type) {
    componentUrl = `${uiUrl}/components/${component}.tsx`;
    componentPath = `/src/ui/components/${component}.tsx`;
  } else {
    componentUrl = `${uiUrl}/components/${options.type}s/${component}.tsx`;
    componentPath = `/src/ui/components/${options.type}s/${component}.tsx`;
  }

  const componentDir = path.join(process.cwd(), componentPath);

  await getUiFile(componentUrl, componentDir);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(componentDir);

  const imports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue())
    .filter((pkg) => {
      if (pkg.startsWith(".") || pkg.startsWith("/")) return false;
      if (pkg.startsWith("@/") || pkg.startsWith("~/")) return false;
      return true;
    });

  await installDependencies(imports);
};
