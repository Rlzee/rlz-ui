import { type PropRow } from "@site/types/props";

export const navigationMenuProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "NavigationMenu children (List, Item, etc.)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the root NavigationMenu container." },
  { prop: "viewport", type: "boolean", default: "true", description: "When false, the floating viewport is not rendered (useful for inline layouts)." },
];

export const navigationMenuListProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "List children (NavigationMenu.Item...)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the list wrapper." },
];

export const navigationMenuItemProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Item children (Trigger + Content or Link)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the item container." },
];

export const navigationMenuTriggerProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Trigger label/content." },
  { prop: "variant", type: "'default' | 'primary'", default: "'default'", description: "Visual variant used by the built-in trigger styling." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger element." },
];

export const navigationMenuContentProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Content shown when the Trigger is activated (grid of links/items)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the content popup element." },
];

export const navigationMenuLinkProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Link content (title + description)." },
  { prop: "asChild", type: "boolean", default: "false", description: "Forward props to a child anchor (use with `asChild`)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the Link slot." },
];

export const navigationMenuIndicatorProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the indicator element." },
];

export const navigationMenuViewportProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the floating viewport element." },
];

export const navigationMenuListItemProps: PropRow[] = [
  { prop: "title", type: "string", default: "undefined", description: "Title shown for the list item." },
  { prop: "href", type: "string", default: "undefined", description: "Href for the internal link." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Secondary description or children content." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the list item wrapper." },
];

const navigationMenuPropsExport = {
  main: navigationMenuProps,
  list: navigationMenuListProps,
  item: navigationMenuItemProps,
  trigger: navigationMenuTriggerProps,
  content: navigationMenuContentProps,
  link: navigationMenuLinkProps,
  indicator: navigationMenuIndicatorProps,
  viewport: navigationMenuViewportProps,
  listItem: navigationMenuListItemProps,
};

export { navigationMenuPropsExport };
