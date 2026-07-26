import fs from "fs-extra";
import path from "path";

import { Project } from "ts-morph";
import { UI_URL } from "@/config";
import { getUiFile } from "@/utils/get-ui-file";
import { UpdateComponent } from "@/utils/update-component";
import { installDependencies } from "@/utils/install-dependencies";

import type { rlzConfig } from "@/config/types";
import type { Registry, RegistryItem } from "@rlz/registry";

type InstallItemOptions = {
  item: RegistryItem;
  registry: Registry;
  dirs: Record<string, string>;
  config: rlzConfig;
  cwd: string;
};

export async function installItem({
  item,
  registry,
  dirs,
  config,
  cwd,
}: InstallItemOptions) {
  const installed = new Set<string>();

  const typeToDir = {
    component: "components",
    hook: "hooks",
    lib: "lib",
  } as const;

  const installSingleItem = async (item: RegistryItem) => {
    const baseDir = dirs[typeToDir[item.type]];
    if (!baseDir) {
      throw new Error(`Target directory not found for type: ${item.type}`);
    }

    let targetDir = baseDir;

    if (item.type === "component") {
      const subDir = item.destPath ?? "ui";

      if (subDir.includes("..")) {
        throw new Error(`Invalid destPath in registry for ${item.name}`);
      }
      targetDir = path.join(baseDir, subDir);
    }

    const fileName = path.basename(item.path);
    const itemPath = path.join(targetDir, fileName);

    if (await fs.pathExists(itemPath)) {
      installed.add(item.id);
      return;
    }

    const itemUrl = `${UI_URL}/${item.path}`;

    await fs.ensureDir(path.dirname(itemPath));
    await getUiFile(itemUrl, itemPath);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(itemPath);

    if (item.type === "component") {
      await UpdateComponent({ sourceFile, config });
    }

    if (item.dependencies?.length) {
      await installDependencies(item.dependencies, cwd, true);
    }
  };

  const install = async (itemId: string) => {
    if (installed.has(itemId)) {
      return;
    }

    const registryItem = registry.items[itemId];

    if (!registryItem) {
      throw new Error(`Registry item not found: ${itemId}`);
    }

    installed.add(itemId);

    if (
      registryItem.type === "component" &&
      registryItem.registryDependencies?.length
    ) {
      for (const dependency of registryItem.registryDependencies) {
        await install(dependency);
      }
    }

    await installSingleItem(registryItem);
  };

  await install(item.id);
}
