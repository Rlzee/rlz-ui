import { type PropRow } from "@site/types/props";

export const tableProps: PropRow[] = [
	{
		prop: "containerClassName",
		type: "string",
		default: "-",
		description: "Additional classes applied to the table wrapper (responsive overflow container).",
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional classes applied to the table element.",
	},
	{
		prop: "...props",
		type: "ComponentProps<'table'>",
		default: "{}",
		description: "All other table element props are forwarded.",
	},
];

export const tableHeaderProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'border-b border-border'", description: "Classes applied to the table header (thead)." },
	{ prop: "...props", type: "ComponentProps<'thead'>", default: "{}", description: "All other thead props forwarded." },
];

export const tableBodyProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'[_&tr:last-child]:border-0'", description: "Classes applied to the table body (tbody)." },
	{ prop: "...props", type: "ComponentProps<'tbody'>", default: "{}", description: "All other tbody props forwarded." },
];

export const tableFooterProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'border-t border-border font-medium'", description: "Classes applied to the table footer (tfoot)." },
	{ prop: "...props", type: "ComponentProps<'tfoot'>", default: "{}", description: "All other tfoot props forwarded." },
];

export const tableRowProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'border-b border-border'", description: "Classes applied to each table row (tr)." },
	{ prop: "...props", type: "ComponentProps<'tr'>", default: "{}", description: "All other tr props forwarded." },
];

export const tableHeadProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'h-12 px-3 text-left font-semibold'", description: "Classes applied to table head cells (th)." },
	{ prop: "...props", type: "ComponentProps<'th'>", default: "{}", description: "All other th props forwarded." },
];

export const tableCellProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'align-middle px-3 py-3'", description: "Classes applied to table cells (td)." },
	{ prop: "...props", type: "ComponentProps<'td'>", default: "{}", description: "All other td props forwarded." },
];

export const tableCaptionProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'mt-4 text-sm text-muted-foreground'", description: "Classes applied to the caption element." },
	{ prop: "...props", type: "ComponentProps<'caption'>", default: "{}", description: "All other caption props forwarded." },
];

const tablePropsExport = {
	main: tableProps,
	header: tableHeaderProps,
	body: tableBodyProps,
	footer: tableFooterProps,
	row: tableRowProps,
	head: tableHeadProps,
	cell: tableCellProps,
	caption: tableCaptionProps,
};

export { tablePropsExport };
