import { type PropRow } from "@site/types/props";

export const popoverProps: PropRow[] = [
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
    prop: "modal",
    type: "boolean",
    default: "false",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

export const popoverTriggerProps: PropRow[] = [
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof PopoverPrimitive.Trigger>",
    default: "{}",
  },
];

export const popoverContentProps: PropRow[] = [
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"bottom"',
  },
  {
    prop: "sideOffset",
    type: "number",
    default: "4",
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
    prop: "updatePositionStrategy",
    type: '"optimized" | "always"',
    default: '"optimized"',
  },
  {
    prop: "onEscapeKeyDown",
    type: "(event: KeyboardEvent) => void",
    default: "undefined",
  },
  {
    prop: "onPointerDownOutside",
    type: "(event: PointerEvent) => void",
    default: "undefined",
  },
  {
    prop: "onFocusOutside",
    type: "(event: FocusEvent) => void",
    default: "undefined",
  },
  {
    prop: "onInteractOutside",
    type: "(event: PointerEvent | FocusEvent) => void",
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
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof PopoverPrimitive.Content>",
    default: "{}",
  },
];

export const popoverAnchorProps: PropRow[] = [
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof PopoverPrimitive.Anchor>",
    default: "{}",
  },
];

export const popoverPortalProps: PropRow[] = [
  {
    prop: "forceMount",
    type: "boolean",
    default: "false",
  },
  {
    prop: "container",
    type: "HTMLElement | null",
    default: "document.body",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

const popoverPropsExport = {
    main: popoverProps,
    trigger: popoverTriggerProps,
    content: popoverContentProps,
    anchor: popoverAnchorProps,
    portal: popoverPortalProps,
};
export { popoverPropsExport };
