import { type PropRow } from "@site/types/props";

export const emptyProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Empty children (Header, Icon, Title, Description)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the root Empty container." },
];

export const emptyHeaderProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Header content (Icon, Title, Description)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the header container." },
];

export const emptyIconProps: PropRow[] = [
	{ prop: "variant", type: "'default' | 'secondary'", default: "'default'", description: "Visual variant for the icon (applies background/size styles)." },
	{ prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Icon size variant." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the icon wrapper." },
];

export const emptyTitleProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Title text or nodes." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the title element." },
];

export const emptyDescriptionProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Secondary description text or nodes." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the description element." },
];

const emptyPropsExport = {
	main: emptyProps,
	header: emptyHeaderProps,
	icon: emptyIconProps,
	title: emptyTitleProps,
	description: emptyDescriptionProps,
};

export { emptyPropsExport };
