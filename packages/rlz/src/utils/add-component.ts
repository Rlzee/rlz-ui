import { uiUrl } from "../config";
import { Project } from "ts-morph";
import { getUiFile } from "./get-ui-file";
import path from "path";
import fs from "fs/promises";
import { installDependencies } from "./install-dependencies";
import { getConfigOrDefault } from "./config-manager";
import { addUseClient } from "./add-use-client";
import { resolveAliases } from "./aliases-resolver";
import { getFramework } from "./get-framework";
import { addUtils } from "./add-utils";
import {
  addComponentParamsSchema,
  type ComponentType,
  type AddComponentParams,
  type UtilsType,
} from "../schemas";

export type componentType = ComponentType;

export const addComponent = async (params: AddComponentParams) => {
  const { component, options } = addComponentParamsSchema.parse(params);
  const config = await getConfigOrDefault();
  const baseUiPath = config.uiPath;
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

  const framework = getFramework(process.cwd());
  if (framework === "next.js") {
    addUseClient(sourceFile);
  }

  await resolveAliases(sourceFile);
  await sourceFile.save();

  const allImports = sourceFile
    .getImportDeclarations()
    .map((imp) => imp.getModuleSpecifierValue());

  const internalComponents = allImports.filter(
    (pkg) =>
      pkg.startsWith(config.aliases.components) ||
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
    if (pkg.startsWith("@ui/")) return false;
    if (config.aliases) {
      for (const aliasValue of Object.values(config.aliases)) {
        if (pkg.startsWith(aliasValue)) return false;
      }
    }
    return true;
  });

  if (npmDeps.length > 0) {
    // Extract the actual package names from imports
    const packageNames = npmDeps.map((dep) => {
      if (dep.startsWith("@")) {
        // Scoped package: @scope/package/subpath -> @scope/package
        const parts = dep.split("/");
        return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : dep;
      } else {
        // Regular package: package/subpath -> package
        return dep.split("/")[0];
      }
    });
    
    // Remove duplicates
    const uniquePackages = Array.from(new Set(packageNames));
    await installDependencies(uniquePackages, process.cwd(), true);
  }

  const utilsDeps = allImports.filter((pkg) => {
    if (config.aliases) {
      for (const aliasValue of Object.values(config.aliases)) {
        if (pkg.startsWith(aliasValue)) return true;
      }
    }
    return false;
  });

  for (const utilDep of utilsDeps) {
    const pathMatch = utilDep.match(
      /\/(helpers|hooks|lib|types|stores|utils)\/([^\/]+)$/
    );
    if (pathMatch) {
      const type = pathMatch[1] as UtilsType;
      const name = pathMatch[2].replace(/\.tsx?$/, "");
      await addUtils(name, type);
    }
  }

  await sourceFile.save();
};
