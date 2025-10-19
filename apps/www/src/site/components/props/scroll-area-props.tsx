import { type PropRow } from "@site/types/props";

export const scrollAreaProps: PropRow[] = [
	{
		prop: "children",
		type: "ReactNode",
		default: "-",
		description: "Scrollable content."
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes."
	},
	{
		prop: "...props",
		type: "ComponentProps<typeof ScrollAreaPrimitive.Root>",
		default: "-",
		description: "Radix UI Root props."
	}
];

export const scrollAreaRootProps: PropRow[] = [
	{
		prop: "children",
		type: "ReactNode",
		default: "-",
		description: "Scrollable content."
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes."
	},
	{
		prop: "...props",
		type: "ComponentProps<typeof ScrollAreaPrimitive.Root>",
		default: "-",
		description: "Radix UI Root props."
	}
];

export const scrollAreaViewportProps: PropRow[] = [
	{
		prop: "children",
		type: "ReactNode",
		default: "-",
		description: "Content displayed in the scroll area."
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes."
	},
	{
		prop: "...props",
		type: "ComponentProps<typeof ScrollAreaPrimitive.Viewport>",
		default: "-",
		description: "Radix UI Viewport props."
	}
];

export const scrollBarProps: PropRow[] = [
	{
		prop: "orientation",
		type: '"vertical" | "horizontal"',
		default: '"vertical"',
		description: "Scrollbar orientation."
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes."
	},
	{
		prop: "...props",
		type: "ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>",
		default: "-",
		description: "Radix UI Scrollbar props."
	}
];

const scrollAreaPropsExport = {
	main: scrollAreaProps,
	root: scrollAreaRootProps,
	viewport: scrollAreaViewportProps,
	scrollbar: scrollBarProps,
};

export { scrollAreaPropsExport };
