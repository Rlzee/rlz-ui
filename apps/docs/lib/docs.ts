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

// The sections a preset carries, plus the one entry that stands above them: `info`
// is not a key of the preset data, it is the preset itself - what it is called,
// keyed and versioned.
type PresetDataSection = "base" | "colors" | "recommendations";

export type PresetSection = "info" | PresetDataSection;

const PRESET_SECTIONS: Record<
  PresetSection,
  { name: string; description: string }
> = {
  info: {
    name: "Info",
    description: "Name, description and registry coordinates of the preset",
  },
  base: {
    name: "Base",
    description:
      "Typography, layout scale and shared utility classes of the preset",
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
  // A section the draft does not carry has nothing to edit, so it stays out of the
  // explorer. The identity never does: every preset has one.
  const carried: PresetSection[] = (
    ["base", "colors", "recommendations"] as const
  ).filter((key) => preset[key] !== undefined);

  const entries: PresetSection[] = ["info", ...carried];

  return entries.map((key) => ({
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
