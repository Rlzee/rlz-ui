import { type PropRow } from "@site/types/props";

export const tabsProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "defaultValue",
    type: "string",
    default: "undefined",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    default: "undefined",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
  },
  {
    prop: "dir",
    type: '"ltr" | "rtl"',
    default: '"ltr"',
  },
  {
    prop: "activationMode",
    type: '"automatic" | "manual"',
    default: '"automatic"',
  },
  {
    prop: "className",
    type: "string",
    default: '"flex flex-col gap-2"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof TabsPrimitive.Root>",
    default: "{}",
  },
];

export const tabsListProps: PropRow[] = [
  {
    prop: "loop",
    type: "boolean",
    default: "true",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof TabsPrimitive.List>",
    default: "{}",
  },
];

export const tabsTriggerProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof TabsPrimitive.Trigger>",
    default: "{}",
  },
];

export const tabsContentProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "forceMount",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: '"flex-1 outline-none"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof TabsPrimitive.Content>",
    default: "{}",
  },
];

const tabsPropsExport = {
    main: tabsProps,
    list: tabsListProps,
    trigger: tabsTriggerProps,
    content: tabsContentProps,
};
export { tabsPropsExport };
