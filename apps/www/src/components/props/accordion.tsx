import { type PropRow } from "../props-table";

export const accordionRootProps: PropRow[] = [
  { prop: "type", type: `"single" | "multiple"`, default: "-" },
  { prop: "collapsible", type: "boolean", default: "false" },
  { prop: "value", type: "string | string[]", default: "-" },
  { prop: "defaultValue", type: "string | string[]", default: "-" },
  { prop: "onValueChange", type: "(value: string | string[]) => void", default: "-" },
  { prop: "disabled", type: "boolean", default: "false" },
  { prop: "className", type: "string", default: "-" },
];

export const accordionItemProps: PropRow[] = [
  { prop: "value", type: "string", default: "-" },
  { prop: "disabled", type: "boolean", default: "false" },
  { prop: "className", type: "string", default: "-" },
];

export const accordionHeaderProps: PropRow[] = [
  { prop: "className", type: "string", default: `"flex"` },
];

export const accordionTriggerProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-" },
  { prop: "className", type: "string", default: "Styles prédéfinis" },
  { prop: "disabled", type: "boolean", default: "false" },
];

export const accordionIconProps: PropRow[] = [
  { prop: "Icon", type: "LucideIcon", default: "ChevronDownIcon" },
  { prop: "className", type: "string", default: "Styles prédéfinis" },
];

export const accordionContentProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-" },
  { prop: "className", type: "string", default: `"pt-0 pb-4"` },
];

const accordionProps = {
  root: accordionRootProps,
  item: accordionItemProps,
  header: accordionHeaderProps,
  trigger: accordionTriggerProps,
  icon: accordionIconProps,
  content: accordionContentProps,
};
export { accordionProps };