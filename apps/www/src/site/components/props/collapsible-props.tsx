import { type PropRow } from "@site/types/props";

export const collapsibleProps: PropRow[] = [
  {
    prop: "open",
    type: "boolean",
    default: "undefined",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "undefined",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'div'>",
    default: "{}",
  },
];

export const collapsibleTriggerProps: PropRow[] = [
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "undefined",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'button'>",
    default: "{}",
  },
];

export const collapsibleContentProps: PropRow[] = [
  {
    prop: "forceMount",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "undefined",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'div'>",
    default: "{}",
  },
];

const collapsiblePropsExport = {
    main: collapsibleProps,
    trigger: collapsibleTriggerProps,
    content: collapsibleContentProps,
};
export { collapsiblePropsExport };
