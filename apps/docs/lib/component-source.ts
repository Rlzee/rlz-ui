import fs from "fs/promises";
import path from "path";
import registry from "../../../packages/ui/registry.json";
import type { RegistryItem } from "@rlz/registry";

const UI_ROOT = path.resolve(process.cwd(), "../../packages/ui/src");

export type ComponentSourceResult = {
  source: string;
  path: string;
};

export async function getComponentSource(
  name: string
): Promise<ComponentSourceResult | null> {
  const item = (registry as Record<string, RegistryItem>)[name];
  if (!item) return null;

  const filePath = path.join(UI_ROOT, item.path);

  try {
    const source = await fs.readFile(filePath, "utf-8");
    return { source, path: item.path };
  } catch {
    return null;
  }
}

//

import { demoPaths } from "@rlz/ui/components/examples";
const UI_DEMO_ROOT = path.resolve(
  process.cwd(),
  "../../packages/ui/src/components/examples/ui"
);

export async function getDemoSource(name: string): Promise<string | null> {
  const demoPath = demoPaths[name];
  if (!demoPath) return null;

  const filePath = path.join(UI_DEMO_ROOT, demoPath + ".tsx");
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (e) {
    console.error(`[getDemoSource] error:`, e);
    return null;
  }
}
