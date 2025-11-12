import { type PropRow } from "@site/types/props";

export const generatingTextProps: PropRow[] = [
	{ prop: "words", type: "string", default: "-", description: "Text content — words separated by spaces." },
	{ prop: "className", type: "string", default: "''", description: "Additional classes applied to the container wrapper." },
	{ prop: "blur", type: "boolean", default: "false", description: "If true, words are initially blurred and animate to sharpness." },
	{ prop: "duration", type: "number", default: "0.5", description: "Duration (s) of the word animation; used as the Framer Motion duration." },
];

const generatingTextPropsExport = {
	main: generatingTextProps
};

export { generatingTextPropsExport };
