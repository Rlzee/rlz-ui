import { type PropRow } from "@site/types/props";

export const selectProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Select children (Trigger, Content, Group, Item...)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the root Select container." },
];

export const selectTriggerProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Trigger content (usually a button or custom element)." },
	{ prop: "placeholder", type: "string", default: "undefined", description: "Placeholder text shown when no value is selected." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger element." },
];

export const selectContentProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Content children (groups, lists, items, empty state)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the content/popover element." },
];

export const selectGroupProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Group children (Label + Items)." },
	{ prop: "label", type: "string", default: "undefined", description: "Group label text." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the group wrapper." },
];

export const selectItemProps: PropRow[] = [
	{ prop: "value", type: "string", default: "undefined", description: "Item value used for selection." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Item content (label / icon)." },
	{ prop: "disabled", type: "boolean", default: "false", description: "Disable the item (non-interactive)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the item element." },
];

const selectPropsExport = {
	main: selectProps,
	trigger: selectTriggerProps,
	content: selectContentProps,
	group: selectGroupProps,
	item: selectItemProps,
};

export { selectPropsExport };
