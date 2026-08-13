import { source } from "@/lib/source";

export const PAGES_NEW = [""];

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
