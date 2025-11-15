import { type PropRow } from "@site/types/props";

export const clipboardProps: PropRow[] = [
	{ prop: "text", type: "string", default: "''", description: "Text to copy to the clipboard." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the button wrapper." },
	{ prop: "size", type: "'sm' | 'md' | 'lg'", default: "'sm'", description: "Icon size variant (maps to CSS size classes)." },
	{ prop: "position", type: "'absolute' | 'relative'", default: "'relative'", description: "Positioning helper for the button (use 'absolute' to overlay)." },
	{ prop: "showTooltip", type: "boolean", default: "true", description: "Show a tooltip with copy state (true by default)." },
	{ prop: "tooltipContent", type: "{ copied: string; default: string }", default: "{ copied: 'Copied!', default: 'Copy to clipboard' }", description: "Tooltip text for the default and copied states." },
	{ prop: "successDuration", type: "number", default: "1500", description: "Milliseconds the copied state persists before reverting." },
	{ prop: "onCopy", type: "(text: string) => void", default: "undefined", description: "Callback invoked after a successful copy." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Custom trigger content; when provided it replaces the default icons." },
];

const clipboardPropsExport = {
	main: clipboardProps,
};

export { clipboardPropsExport };
