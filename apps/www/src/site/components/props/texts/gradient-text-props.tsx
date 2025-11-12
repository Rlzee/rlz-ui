import { type PropRow } from "@site/types/props";

export const gradientTextProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "-", description: "Text or elements to render with the gradient." },
	{ prop: "className", type: "string", default: "''", description: "Additional classes applied to the outer wrapper." },
	{ prop: "colors", type: "string[]", default: "['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']", description: "Array of color stops used to build the linear-gradient." },
	{ prop: "animationSpeed", type: "number", default: "8", description: "Animation duration (seconds) for the gradient keyframes loop." },
	{ prop: "showBorder", type: "boolean", default: "false", description: "When true, renders an animated gradient border behind the content." },
];

const gradientTextPropsExport = {
	main: gradientTextProps,
};

export { gradientTextPropsExport };
