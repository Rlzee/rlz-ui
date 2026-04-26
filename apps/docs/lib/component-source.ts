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

const UI_DEMO_ROOT = path.resolve(
  process.cwd(),
  "../../packages/ui/src/components/examples/ui"
);

export async function getDemoSource(name: string): Promise<string | null> {
  const item = (registry as Record<string, RegistryItem>)[name];
  let filePath: string;

  if (item) {
    filePath = path.join(UI_DEMO_ROOT, name, "default.tsx");
  } else {
    const parts = name.split("-");
    const component = parts[0];
    const variant = parts.slice(1).join("-") || "default";
    filePath = path.join(UI_DEMO_ROOT, component, `${variant}.tsx`);
  }

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (e) {
    console.error(`[getDemoSource] error:`, e);
    return null;
  }
}
