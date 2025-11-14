import { type PropRow } from "@site/types/props";

export const commandProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Command structure (Input, List, Groups, Items...)." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the root Command container." },
];

export const commandDialogProps: PropRow[] = [
	{ prop: "title", type: "string", default: "'Command Palette'", description: "Accessible title used inside the dialog header (sr-only by default)." },
	{ prop: "description", type: "string", default: "'Search for a command to run...'", description: "Accessible description for the dialog header." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the dialog Content wrapper." },
];

export const commandInputProps: PropRow[] = [
	{ prop: "placeholder", type: "string", default: "undefined", description: "Input placeholder text." },
	{ prop: "value", type: "string", default: "undefined", description: "Controlled input value." },
	{ prop: "onValueChange", type: "(value: string) => void", default: "undefined", description: "Change handler for controlled usage." },
	{ prop: "kbd", type: "boolean", default: "true", description: "Show the Esc keyboard hint (Kbd) by default." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the input element/wrapper." },
];

export const commandListProps: PropRow[] = [
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the list container (scrollable area)." },
	{ prop: "style", type: "CSSProperties", default: "-", description: "Inline styles forwarded to the list (e.g. custom scrollbars)." },
];

export const commandItemProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content (label, optional icon)." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the item (non-interactive)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the item element." },
];

export const commandGroupProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Group children including heading and items." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the group wrapper." },
];

export const commandSeparatorProps: PropRow[] = [
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the separator element." },
];

export const commandShortcutProps: PropRow[] = [
	{ prop: "shortcutKey", type: "string", default: "''", description: "Shortcut key label used when no children are provided (rendered with Kbd)." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Custom shortcut content (takes precedence over shortcutKey)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the shortcut element." },
];

export const commandFooterProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Footer content rendered below the list (e.g., hints)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the footer element." },
];

export const commandLoadingProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Loading indicator content (shown while results load)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the loading container." },
];

export const commandEmptyProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Content shown when no results are found." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the empty state element." },
];

const commandPropsExport = {
	main: commandProps,
	dialog: commandDialogProps,
	input: commandInputProps,
	list: commandListProps,
	item: commandItemProps,
	group: commandGroupProps,
	separator: commandSeparatorProps,
	shortcut: commandShortcutProps,
	footer: commandFooterProps,
	loading: commandLoadingProps,
	empty: commandEmptyProps,
};

export { commandPropsExport };
