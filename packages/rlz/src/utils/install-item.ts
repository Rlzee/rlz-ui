import fs from "fs-extra";
import path from "path";

import { Project } from "ts-morph";
import { UI_URL } from "@/config";
import { getUiFile } from "@/utils/get-ui-file";
import { UpdateComponent } from "@/utils/update-component";
import { installDependencies } from "@/utils/install-dependencies";

import type { rlzConfig } from "@/config/types";
import type { Registry, RegistryItem, RegistryPreset } from "@rlz/registry";

type InstallItemOptions = {
  item: RegistryItem;
  registry: Registry;
  dirs: Record<string, string>;
  config: rlzConfig;
  cwd: string;
  preset?: RegistryPreset;
  confirmOverwrite?: (filePath: string) => Promise<boolean>;
};

const typeToDir = {
  component: "components",
  hook: "hooks",
  lib: "lib",
} as const;

function getItemPath(item: RegistryItem, dirs: Record<string, string>) {
  const baseDir = dirs[typeToDir[item.type]];
  if (!baseDir) {
    throw new Error(`Target directory not found for type: ${item.type}`);
  }

  const subDir = item.type === "component" ? item.destPath ?? "ui" : "";
  if (subDir.includes("..")) {
    throw new Error(`Invalid destPath in registry for ${item.name}`);
  }
  return path.join(baseDir, subDir, path.basename(item.path));
}

export async function installItem(
  {
    item,
    registry,
    dirs,
    config,
    cwd,
    preset,
    confirmOverwrite,
  }: InstallItemOptions,
  download = getUiFile
) {
  const installed = new Set<string>();

  const prepareItem = async (item: RegistryItem, destination: string) => {
    const itemUrl = `${UI_URL}/${item.path}`;

    await download(itemUrl, destination);

    if (item.type === "component") {
      const project = new Project();
      const sourceFile = project.addSourceFileAtPath(destination);
      await UpdateComponent({
        sourceFile,
        config,
        componentId: item.id,
        customization: preset?.components?.[item.id],
      });
    }

    if (item.dependencies?.length) {
      await installDependencies(item.dependencies, cwd, true);
    }
  };

  const install = async (itemId: string) => {
    if (installed.has(itemId)) {
      return "skipped";
    }

    const registryItem = registry.items[itemId];

    if (!registryItem) {
      throw new Error(`Registry item not found: ${itemId}`);
    }

    installed.add(itemId);

    const itemPath = getItemPath(registryItem, dirs);
    const exists = await fs.pathExists(itemPath);
    const requested = itemId === item.id;
    const overwrite =
      exists &&
      requested &&
      registryItem.type === "component" &&
      (await confirmOverwrite?.(itemPath));

    if (requested && exists && !overwrite) return "skipped";
    if (overwrite && !(await fs.lstat(itemPath)).isFile()) {
      throw new Error(
        `Cannot overwrite "${itemPath}": it is not a regular file.`
      );
    }

    if (
      registryItem.type === "component" &&
      registryItem.registryDependencies?.length
    ) {
      for (const dependency of registryItem.registryDependencies) {
        await install(dependency);
      }
    }

    if (overwrite) {
      // Prepare the replacement on the same filesystem so a failed download,
      // transformation or dependency install never truncates the user's file.
      const staging = await fs.mkdtemp(
        path.join(path.dirname(itemPath), ".rlz-")
      );
      try {
        const replacement = path.join(staging, path.basename(itemPath));
        await prepareItem(registryItem, replacement);
        await fs.rename(replacement, itemPath);
      } finally {
        await fs.remove(staging);
      }
      return "overwritten";
    }

    if (exists || (await fs.pathExists(itemPath))) return "skipped";
    await fs.ensureDir(path.dirname(itemPath));
    await prepareItem(registryItem, itemPath);
    return "added";
  };

  return install(item.id);
}
