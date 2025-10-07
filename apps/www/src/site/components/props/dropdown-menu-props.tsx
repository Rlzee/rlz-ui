import { type PropRow } from "@site/types/props";

export const dropdownMenuProps: PropRow[] = [
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
    default: "true",
  },
  {
    prop: "dir",
    type: '"ltr" | "rtl"',
    default: '"ltr"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

export const dropdownMenuTriggerProps: PropRow[] = [
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.Trigger>",
    default: "{}",
  },
];

export const dropdownMenuContentProps: PropRow[] = [
  {
    prop: "sideOffset",
    type: "number",
    default: "4",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"bottom"',
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
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof DropdownMenuPrimitive.Content>",
    default: "{}",
  },
];

export const dropdownMenuItemProps: PropRow[] = [
  {
    prop: "inset",
    type: "boolean",
    default: "false",
  },
  {
    prop: "variant",
    type: '"default" | "destructive"',
    default: '"default"',
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onSelect",
    type: "(event: Event) => void",
    default: "undefined",
  },
  {
    prop: "textValue",
    type: "string",
    default: "undefined",
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.Item>",
    default: "{}",
  },
];

export const dropdownMenuCheckboxItemProps: PropRow[] = [
  {
    prop: "checked",
    type: "boolean | 'indeterminate'",
    default: "false",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onSelect",
    type: "(event: Event) => void",
    default: "undefined",
  },
  {
    prop: "textValue",
    type: "string",
    default: "undefined",
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>",
    default: "{}",
  },
];

export const dropdownMenuRadioGroupProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    default: "undefined",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>",
    default: "{}",
  },
];

export const dropdownMenuRadioItemProps: PropRow[] = [
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
    prop: "onSelect",
    type: "(event: Event) => void",
    default: "undefined",
  },
  {
    prop: "textValue",
    type: "string",
    default: "undefined",
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.RadioItem>",
    default: "{}",
  },
];

export const dropdownMenuLabelProps: PropRow[] = [
  {
    prop: "inset",
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.Label>",
    default: "{}",
  },
];

export const dropdownMenuSeparatorProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof DropdownMenuPrimitive.Separator>",
    default: "{}",
  },
];

export const dropdownMenuShortcutProps: PropRow[] = [
  {
    prop: "shortcutKey",
    type: "string",
    default: '""',
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
];

export const dropdownMenuSubProps: PropRow[] = [
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
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof DropdownMenuPrimitive.Sub>",
    default: "{}",
  },
];

export const dropdownMenuSubTriggerProps: PropRow[] = [
  {
    prop: "inset",
    type: "boolean",
    default: "false",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "textValue",
    type: "string",
    default: "undefined",
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>",
    default: "{}",
  },
];

export const dropdownMenuSubContentProps: PropRow[] = [
  {
    prop: "sideOffset",
    type: "number",
    default: "0",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"right"',
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
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
    type: "ComponentProps<typeof DropdownMenuPrimitive.SubContent>",
    default: "{}",
  },
];

const dropdownMenuPropsExport = {
    main: dropdownMenuProps,
    trigger: dropdownMenuTriggerProps,
    content: dropdownMenuContentProps,
    item: dropdownMenuItemProps,
    checkboxItem: dropdownMenuCheckboxItemProps,
    radioGroup: dropdownMenuRadioGroupProps,
    radioItem: dropdownMenuRadioItemProps,
    label: dropdownMenuLabelProps,
    separator: dropdownMenuSeparatorProps,
    shortcut: dropdownMenuShortcutProps,
    sub: dropdownMenuSubProps,
    subTrigger: dropdownMenuSubTriggerProps,
    subContent: dropdownMenuSubContentProps,
};
export { dropdownMenuPropsExport };
