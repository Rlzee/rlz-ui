import { type PropRow } from "@site/types/props";

export const menubarProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Menubar children (Menubar.Menu ...)." },
  { prop: "className", type: "string", default: "'bg-background-secondary flex h-9 ...'", description: "Classes for the root menubar container." },
];

export const menubarMenuProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Menu content (Trigger + Content)." },
];

export const menubarTriggerProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Trigger label/content." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger button." },
];

export const menubarContentProps: PropRow[] = [
  { prop: "align", type: "'start' | 'end' | 'center'", default: "'start'", description: "Alignment of the content relative to the trigger." },
  { prop: "alignOffset", type: "number", default: "-4", description: "Offset for alignment." },
  { prop: "sideOffset", type: "number", default: "8", description: "Offset from the side when positioned." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the content (popup) element." },
];

export const menubarGroupProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Group children." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the group wrapper." },
];

export const menubarItemProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Item content (label and optional Shortcut)." },
  { prop: "inset", type: "boolean", default: "false", description: "When true, add inset padding (useful for nested items)." },
  { prop: "variant", type: "'default' | 'destructive'", default: "'default'", description: "Visual variant for the item (destructive styles available)." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable the item." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the item element." },
];

export const menubarCheckboxItemProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Checkbox label content." },
  { prop: "checked", type: "boolean", default: "false", description: "Checked state." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the checkbox item." },
];

export const menubarRadioGroupProps: PropRow[] = [
  { prop: "value", type: "string", default: "undefined", description: "Selected radio value." },
  { prop: "onValueChange", type: "(val: string) => void", default: "undefined", description: "Callback on selected value change." },
];

export const menubarRadioItemProps: PropRow[] = [
  { prop: "value", type: "string", default: "undefined", description: "Radio item value." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Radio item label." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the radio item." },
];

export const menubarLabelProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Label text for sections." },
  { prop: "inset", type: "boolean", default: "false", description: "Apply inset styling to label." },
];

export const menubarSeparatorProps: PropRow[] = [
  { prop: "className", type: "string", default: "'bg-border -mx-1 my-1 h-px'", description: "Classes applied to the separator." },
];

export const menubarShortcutProps: PropRow[] = [
  { prop: "shortcutKey", type: "string", default: "''", description: "Keyboard shortcut string shown in the item (or pass children)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the shortcut element." },
];

export const menubarSubProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Submenu trigger and content." },
];

export const menubarSubTriggerProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Sub trigger label." },
  { prop: "inset", type: "boolean", default: "false", description: "Inset styling for sub trigger." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the sub trigger." },
];

export const menubarSubContentProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the sub-content popup." },
];

const menubarPropsExport = {
  main: menubarProps,
  menu: menubarMenuProps,
  trigger: menubarTriggerProps,
  content: menubarContentProps,
  group: menubarGroupProps,
  item: menubarItemProps,
  checkboxItem: menubarCheckboxItemProps,
  radioGroup: menubarRadioGroupProps,
  radioItem: menubarRadioItemProps,
  label: menubarLabelProps,
  separator: menubarSeparatorProps,
  shortcut: menubarShortcutProps,
  sub: menubarSubProps,
  subTrigger: menubarSubTriggerProps,
  subContent: menubarSubContentProps,
};

export { menubarPropsExport };
