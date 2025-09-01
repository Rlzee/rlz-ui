import { type PropRow } from "@site/types/props";

export const buttonGroupProps: PropRow[] = [
	{ prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"primary"' },
	{ prop: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"' },
	{ prop: "className", type: "string", default: 'Predefined styles' },
	{ prop: "children", type: "ReactNode", default: '-' },
	{ prop: "...props", type: "Record<string, any>", default: '{}' },
];

export const buttonGroupItemProps: PropRow[] = [
	{ prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"primary"' },
	{ prop: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"' },
	{ prop: "asChild", type: "boolean", default: 'false' },
	{ prop: "className", type: "string", default: 'Predefined styles' },
	{ prop: "...props", type: "Record<string, any>", default: '{}' },
];

const buttonGroupPropsExport = {
	main: buttonGroupProps,
	item: buttonGroupItemProps,
};

export { buttonGroupPropsExport };
