import { uiUrl } from "../config";
import { Project } from "ts-morph";
import { getUiFile } from "./get-ui-file";
import path from "path";
import { installDependencies } from "./install-dependencies";
import { getConfigOrDefault } from "./config-manager";

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
  const config = await getConfigOrDefault();

  let componentUrl;
  let componentPath;

  const baseUiPath = config.srcDir ? "/src/ui/components" : "/ui/components";

  if (!options.type) {
    componentUrl = `${uiUrl}/components/${component}.tsx`;
    componentPath = `${baseUiPath}/${component}.tsx`;
  } else {
    componentUrl = `${uiUrl}/components/${options.type}s/${component}.tsx`;
    componentPath = `${baseUiPath}/${options.type}s/${component}.tsx`;
  }

  const componentDir = path.join(process.cwd(), componentPath);

  await getUiFile(componentUrl, componentDir);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(componentDir);

  const removeSrc = !config.srcDir;

  sourceFile.getImportDeclarations().forEach((imp) => {
    let modulePath = imp.getModuleSpecifierValue();
    if (removeSrc && modulePath.startsWith("@/src/")) {
      const newPath = modulePath.replace(/^@\/src\//, "@/");
      imp.setModuleSpecifier(newPath);
    }
  });

  await sourceFile.save();

  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const internalComponents = allImports.filter(
    (pkg) =>
      pkg.startsWith("@/ui/components") ||
      pkg.startsWith("@/src/ui/components") ||
      pkg.startsWith("~/ui/components")
  );

  for (const ic of internalComponents) {
    const compName = path.basename(ic); // ex: "@/src/ui/components/Button" -> "Button"
    const compTypeMatch = ic.match(/components\/([^/]+)s\//);
    const compType = compTypeMatch ? (compTypeMatch[1] as componentType) : null;

    await addComponent({
      component: compName.replace(/\.tsx?$/, ""),
      options: { type: compType },
    });
  }

  const npmDeps = allImports.filter((pkg) => {
    if (pkg.startsWith(".") || pkg.startsWith("/")) return false;
    if (pkg.startsWith("@/") || pkg.startsWith("~/")) return false;
    return true;
  });

  if (npmDeps.length > 0) {
    await installDependencies(npmDeps);
  }
};
