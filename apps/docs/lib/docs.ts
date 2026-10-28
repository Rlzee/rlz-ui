import { source } from "@/lib/source";
import { defaultPreset } from "@rlz/ui/styles/presets";
import { registryBaseComponents } from "@rlz/ui/registry/base_components";
import type { RegistryPreset } from "@rlz/registry";

export const PAGES_NEW = [""];

const COMPONENTS_URL = "/docs/components";

const FOUNDATION_TITLE = "Foundation";
const BASE_COMPONENTS_TITLE = "Base Components";
const FOUNDATION_COMPONENTS_TITLE = "Foundation Components";
const COMPONENTS_TITLE = "Components";

export type DocsNavItem = {
  /** Docs page URL for components, preset section key for foundation. */
  id: string;
  name: string;
  description?: string;
  /** Explorer section the entry belongs to. */
  section: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export function getDocsComponents() {
  const children = Array.isArray((source.pageTree as any).children)
    ? (source.pageTree as any).children
    : [];

  const componentsSection = children.find(
    (section: any) =>
      section.name?.toLowerCase() === "components" ||
      section.url?.includes("/components")
  );

  return Array.isArray(componentsSection?.children)
    ? componentsSection.children.filter((component: any) => !!component.url)
    : [];
}

/** Collects every page of the docs tree, flattening nested folders. */
function collectDocsPages(
  node: any,
  pages: Omit<DocsNavItem, "section">[] = []
): Omit<DocsNavItem, "section">[] {
  if (!node) return pages;

  if (node.type === "page" && node.url) {
    pages.push({ id: node.url, name: node.name });
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child: any) => collectDocsPages(child, pages));
  }

  return pages;
}

export type PresetSection = keyof Pick<
  RegistryPreset,
  "base" | "colors" | "recommendations"
>;

const PRESET_SECTIONS: Record<
  PresetSection,
  { name: string; description: string }
> = {
  base: {
    name: "Base",
    description: "Typography and layout scale of the preset",
  },
  colors: {
    name: "Colors",
    description: "Color tokens, light and dark values",
  },
  recommendations: {
    name: "Recommendations",
    description: "Suggested fonts and icon library",
  },
};

/** Explorer entries built from the sections of a registry preset. */
export function getPresetFoundationItems(
  preset: RegistryPreset = defaultPreset
): DocsNavItem[] {
  const sections = Object.keys(PRESET_SECTIONS) as PresetSection[];

  return sections
    .filter((key) => preset[key] !== undefined)
    .map((key) => ({
      id: key,
      section: FOUNDATION_TITLE,
      ...PRESET_SECTIONS[key],
    }));
}

/** Explorer entries built from the base primitives of the registry. */
export function getBaseComponentItems(): DocsNavItem[] {
  return Object.entries(registryBaseComponents).map(([id, item]) => ({
    id,
    name: item.name,
    description: item.description,
    section: BASE_COMPONENTS_TITLE,
  }));
}

/**
 * Entries of the preset explorer.
 * Foundation and Base Components come from the registry, Components from the MDX docs.
 */
export function getDocsExplorerSections(
  preset: RegistryPreset = defaultPreset
): DocsNavSection[] {
  const descriptions = new Map(
    source.getPages().map((page) => [page.url, page.data.description])
  );

  const components = collectDocsPages(source.pageTree)
    .filter((page) => page.id.startsWith(`${COMPONENTS_URL}/`))
    .map((page) => ({
      ...page,
      section: COMPONENTS_TITLE,
      description: descriptions.get(page.id),
    }));

  return [
    { title: FOUNDATION_TITLE, items: getPresetFoundationItems(preset) },
    { title: BASE_COMPONENTS_TITLE, items: getBaseComponentItems() },
    // { title: FOUNDATION_COMPONENTS_TITLE, items: [] },
    { title: COMPONENTS_TITLE, items: components },
  ];
}
