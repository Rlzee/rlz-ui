import { source } from "@/lib/source";

export const PAGES_NEW = [""];

const COMPONENTS_URL = "/docs/components";

export type DocsNavItem = {
  name: string;
  url: string;
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
function collectDocsPages(node: any, pages: DocsNavItem[] = []): DocsNavItem[] {
  if (!node) return pages;

  if (node.type === "page" && node.url) {
    pages.push({ name: node.name, url: node.url });
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child: any) => collectDocsPages(child, pages));
  }

  return pages;
}

/**
 * Docs pages grouped for the preset explorer.
 * Only the Components section is driven by the MDX docs; Foundation is a
 * placeholder until its own data source is defined.
 */
export function getDocsExplorerSections(): DocsNavSection[] {
  const components = collectDocsPages(source.pageTree).filter((page) =>
    page.url.startsWith(`${COMPONENTS_URL}/`)
  );

  return [
    { title: "Foundation", items: [] },
    { title: "Components", items: components },
  ];
}
