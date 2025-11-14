import { type PropRow } from "@site/types/props";

export const comboboxProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Combobox children (Trigger, Content, Input, List, Groups, Items...)." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the root Combobox (Popover) container." },
	{ prop: "open", type: "boolean", default: "undefined", description: "Controlled open state forwarded to the underlying Popover." },
	{ prop: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Callback when the Popover open state changes (forwarded to Popover)." },
];

export const comboboxTriggerProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Trigger children (usually a TriggerButton or custom element)." },
	{ prop: "asChild", type: "boolean", default: "true", description: "Render trigger as child (forward props to child)." },
];

export const comboboxTriggerButtonProps: PropRow[] = [
	{ prop: "placeholder", type: "string", default: "'Select an option'", description: "Text shown inside the trigger button when no value is selected." },
	{ prop: "chevron", type: "'up' | 'down' | 'both'", default: "'both'", description: "Which chevron icon to display on the trigger button." },
	{ prop: "variant", type: "buttonVariantTypes", default: "'outline'", description: "Button variant used by the trigger (component sets 'outline' by default)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger button." },
];

export const comboboxContentProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Content children (Command wrapper with input + list)." },
	{ prop: "className", type: "string", default: "'w-[200px] p-0'", description: "Classes applied to the popover content wrapper." },
];

export const comboboxInputProps: PropRow[] = [
	{ prop: "placeholder", type: "string", default: "'Search...'", description: "Placeholder shown in the combobox input." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the input slot." },
	{ prop: "note", type: "string", default: "'kbd=false'", description: "Note: the combobox input disables the Esc `kbd` hint (`kbd={false}`) by design." },
];

export const comboboxListProps: PropRow[] = [
	{ prop: "placeholder", type: "string", default: "'No results found'", description: "Empty state text rendered when there are no results." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the list container (scrollable area)." },
];

export const comboboxGroupProps: PropRow[] = [
	{ prop: "heading", type: "string", default: "undefined", description: "Group heading text (rendered by the demo/docs)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the group wrapper." },
];

export const comboboxItemProps: PropRow[] = [
	{ prop: "value", type: "string", default: "undefined", description: "Item value used when selecting an option." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content (label / icon)." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the item (non-interactive)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the item element." },
];

export const comboboxEmptyProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "'No results found'", description: "Empty state content shown when there are no results." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the empty state element." },
];

export const comboboxLabelProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Label content for groups/sections." },
	{ prop: "className", type: "string", default: "'px-2 py-1.5 text-xs font-medium text-muted-foreground'", description: "Classes applied to the label element." },
];

const comboboxPropsExport = {
	main: comboboxProps,
	trigger: comboboxTriggerProps,
	triggerButton: comboboxTriggerButtonProps,
	content: comboboxContentProps,
	input: comboboxInputProps,
	list: comboboxListProps,
	group: comboboxGroupProps,
	item: comboboxItemProps,
	empty: comboboxEmptyProps,
	label: comboboxLabelProps,
};

export { comboboxPropsExport };
