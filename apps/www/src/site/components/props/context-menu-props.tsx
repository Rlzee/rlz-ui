import { type PropRow } from "@site/types/props";

export const contextMenuProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Context menu structure (Trigger, Content, Items, etc)." },
];

export const contextMenuTriggerProps: PropRow[] = [
	{ prop: "asChild", type: "boolean", default: "false", description: "When true, renders the trigger's child directly and attaches event handlers to it." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Trigger content (element to right-click)." },
	{ prop: "...props", type: "React.HTMLAttributes<HTMLElement>", default: "{}", description: "Additional HTML attributes forwarded to the trigger element." },
];

export const contextMenuContentProps: PropRow[] = [
	{ prop: "className", type: "string", default: "Predefined styles", description: "Additional classes applied to the content wrapper." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Content of the context menu (groups, items, separators...)." },
	{ prop: "style", type: "CSSProperties", default: "-", description: "Inline styles. The component positions the content using fixed positioning based on the cursor location." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.Content>", default: "{}", description: "Additional props forwarded to the underlying DropdownMenu.Content." },
];

export const contextMenuItemProps: PropRow[] = [
	{ prop: "inset", type: "boolean", default: "false", description: "If true, renders the item inset (aligned with labels/shortcuts)." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the item; keyboard and pointer interactions are prevented." },
	{ prop: "onSelect", type: "(event: Event) => void", default: "undefined", description: "Callback fired when the item is selected." },
	{ prop: "textValue", type: "string", default: "undefined", description: "Optional text value used for type-to-select behavior." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the item." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.Item>", default: "{}", description: "Additional props forwarded to the underlying item primitive." },
];

export const contextMenuCheckboxItemProps: PropRow[] = [
	{ prop: "checked", type: "boolean | 'indeterminate'", default: "false", description: "Checked state for checkbox items." },
	{ prop: "onCheckedChange", type: "(checked: boolean) => void", default: "undefined", description: "Change handler when the checked state changes." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the item." },
	{ prop: "onSelect", type: "(event: Event) => void", default: "undefined", description: "Callback fired when the item is selected." },
	{ prop: "textValue", type: "string", default: "undefined", description: "Optional text value used for type-to-select behavior." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the item." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.CheckboxItem>", default: "{}", description: "Additional props forwarded to the underlying primitive." },
];

export const contextMenuRadioGroupProps: PropRow[] = [
	{ prop: "value", type: "string", default: "undefined", description: "Controlled value for the radio group." },
	{ prop: "onValueChange", type: "(value: string) => void", default: "undefined", description: "Change handler when the selected value changes." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Radio items children." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.RadioGroup>", default: "{}", description: "Additional props forwarded to the radio group primitive." },
];

export const contextMenuRadioItemProps: PropRow[] = [
	{ prop: "value", type: "string", default: "undefined", description: "Value for the radio item." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the radio item." },
	{ prop: "onSelect", type: "(event: Event) => void", default: "undefined", description: "Callback fired when the item is selected." },
	{ prop: "textValue", type: "string", default: "undefined", description: "Optional text value used for type-to-select behavior." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the item." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.RadioItem>", default: "{}", description: "Additional props forwarded to the underlying primitive." },
];

export const contextMenuLabelProps: PropRow[] = [
	{ prop: "inset", type: "boolean", default: "false", description: "If true, label is inset to align with items." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the label." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Label content." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.Label>", default: "{}", description: "Additional props forwarded to the label primitive." },
];

export const contextMenuSeparatorProps: PropRow[] = [
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the separator." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.Separator>", default: "{}", description: "Additional props forwarded to the separator primitive." },
];

export const contextMenuShortcutProps: PropRow[] = [
	{ prop: "shortcutKey", type: "string", default: '""', description: "Display string for the keyboard shortcut (e.g., '⌘+K')." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the shortcut element." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Optional children rendered inside the shortcut element." },
];

export const contextMenuSubProps: PropRow[] = [
	{ prop: "open", type: "boolean", default: "undefined", description: "Controlled open state for the submenu." },
	{ prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state for uncontrolled submenu." },
	{ prop: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Callback when submenu open state changes." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Submenu children (SubTrigger, SubContent, etc)." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.Sub>", default: "{}", description: "Additional props forwarded to the submenu primitive." },
];

export const contextMenuSubTriggerProps: PropRow[] = [
	{ prop: "inset", type: "boolean", default: "false", description: "If true, renders the trigger inset." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the trigger." },
	{ prop: "textValue", type: "string", default: "undefined", description: "Optional text value used for type-to-select behavior." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the sub trigger." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "SubTrigger content." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.SubTrigger>", default: "{}", description: "Additional props forwarded to the underlying primitive." },
];

export const contextMenuSubContentProps: PropRow[] = [
	{ prop: "sideOffset", type: "number", default: "0", description: "Side offset for the submenu content." },
	{ prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "Preferred side for the submenu." },
	{ prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment for the submenu content." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to submenu content." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "SubContent children." },
	{ prop: "...props", type: "ComponentProps<typeof DropdownMenu.SubContent>", default: "{}", description: "Additional props forwarded to the underlying primitive." },
];

const contextMenuPropsExport = {
	main: contextMenuProps,
	trigger: contextMenuTriggerProps,
	content: contextMenuContentProps,
	item: contextMenuItemProps,
	checkboxItem: contextMenuCheckboxItemProps,
	radioGroup: contextMenuRadioGroupProps,
	radioItem: contextMenuRadioItemProps,
	label: contextMenuLabelProps,
	separator: contextMenuSeparatorProps,
	shortcut: contextMenuShortcutProps,
	sub: contextMenuSubProps,
	subTrigger: contextMenuSubTriggerProps,
	subContent: contextMenuSubContentProps,
};

export { contextMenuPropsExport };
