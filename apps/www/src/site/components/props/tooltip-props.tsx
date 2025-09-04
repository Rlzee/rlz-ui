import { type PropRow } from "@site/types/props";

export const tooltipProps: PropRow[] = [
  {
    prop: "content",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "children",
    type: "ReactElement",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: "undefined",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
  },
  {
    prop: "delayDuration",
    type: "number",
    default: "500",
  },
];

export const tooltipRootProps: PropRow[] = [
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
    prop: "openDelay",
    type: "number",
    default: "500",
  },
  {
    prop: "closeDelay",
    type: "number",
    default: "100",
  },
];

export const tooltipTriggerProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "true",
  },
];

export const tooltipContentProps: PropRow[] = [
  {
    prop: "id",
    type: "string",
    default: "undefined",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
  },
  {
    prop: "sideOffset",
    type: "number",
    default: "6",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    default: '"center"',
  },
  {
    prop: "alignOffset",
    type: "number",
    default: "0",
  },
  {
    prop: "avoidCollisions",
    type: "boolean",
    default: "true",
  },
  {
    prop: "collisionBoundary",
    type: "Element | null | Array<Element | null>",
    default: "[]",
  },
  {
    prop: "collisionPadding",
    type: "number | Partial<Record<Side, number>>",
    default: "0",
  },
  {
    prop: "arrowPadding",
    type: "number",
    default: "0",
  },
  {
    prop: "sticky",
    type: '"partial" | "always"',
    default: '"partial"',
  },
  {
    prop: "hideWhenDetached",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
];

const tooltipPropsExport = {
    main: tooltipProps,
    root: tooltipRootProps,
    trigger: tooltipTriggerProps,
    content: tooltipContentProps,
};
export { tooltipPropsExport };
