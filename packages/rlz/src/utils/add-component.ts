import { uiUrl } from "../config";
import { Project } from "ts-morph";
import { getUiFile } from "./get-ui-file";
import path from "path";
import fs from "fs/promises";
import { installDependencies } from "./install-dependencies";
import { getConfigOrDefault } from "./config-manager";

export type componentType = "text" | "background" | "animation" | null;

export const addComponent = async ({
  component,
  options,
}: {
  component: string;
  options: { type?: componentType };
}) => {
  const config = await getConfigOrDefault();

  const baseUiPath = config.uiPath;

  if (!baseUiPath) {
    throw new Error("UI path is not configured");
  }

  const componentsDir = path.join(process.cwd(), baseUiPath, "components");
  try {
    await fs.access(componentsDir);
  } catch {
    await fs.mkdir(componentsDir, { recursive: true });
  }

  let componentUrl;
  let componentPath;

  if (!options.type) {
    componentUrl = `${uiUrl}/components/${component}.tsx`;
    componentPath = `${baseUiPath}/components/${component}.tsx`;
  } else {
    componentUrl = `${uiUrl}/components/${options.type}s/${component}.tsx`;
    componentPath = `${baseUiPath}/components/${options.type}s/${component}.tsx`;
  }

  const componentDir = path.join(process.cwd(), componentPath);

  await getUiFile(componentUrl, componentDir);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(componentDir);

  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const internalComponents = allImports.filter(
    (pkg) =>
      pkg.startsWith(config.aliases?.components || "@ui/components") ||
      pkg.startsWith(`${config.uiPath}/components/`)
  );

  for (const ic of internalComponents) {
    const compName = path.basename(ic); // ex: "@ui/components/Button" -> "Button"
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
    if (config.aliases) {
      for (const aliasValue of Object.values(config.aliases)) {
        if (pkg.startsWith(aliasValue)) return false;
      }
    }
    return true;
  });

  if (npmDeps.length > 0) {
    await installDependencies(npmDeps);
  }
};
