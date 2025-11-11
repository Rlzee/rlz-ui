import { type PropRow } from "@site/types/props";

export const blurTextProps: PropRow[] = [
	{ prop: "text", type: "string", default: "'Blur Text Animation'", description: "The text to animate." },
	{ prop: "delay", type: "number", default: "0", description: "Delay (in seconds) before children animations start." },
	{ prop: "className", type: "string", default: "''", description: "Additional classes applied to the wrapper element." },
	{ prop: "animateBy", type: "'words' | 'letters'", default: "'words'", description: "Animate by splitting the text into words or letters." },
	{ prop: "direction", type: "'top' | 'bottom'", default: "'top'", description: "Direction used to compute the initial Y offset for the animation." },
	{ prop: "threshold", type: "number", default: "0.1", description: "Intersection observer threshold (how much of the element should be visible to start)." },
	{ prop: "rootMargin", type: "string", default: "'0px'", description: "Root margin for the intersection observer (CSS margin syntax)." },
	{ prop: "animationFrom", type: "Record<string, string | number>", default: "{ filter: 'blur(10px)', opacity: 0, y: direction === 'top' ? -20 : 20 }", description: "Initial animation style for each element." },
	{ prop: "animationTo", type: "Array<Record<string, string | number>>", default: "[ { filter: 'blur(5px)', opacity: 0.5, y: 0 }, { filter: 'blur(0px)', opacity: 1, y: 0 } ]", description: "Array of style targets; the last item is used as the final state." },
	{ prop: "easing", type: "(t: number) => number", default: "(t) => t * (2 - t)", description: "Easing function used for the animation timing." },
	{ prop: "onAnimationComplete", type: "() => void", default: "undefined", description: "Callback called when the animation completes." },
	{ prop: "stepDuration", type: "number", default: "0.4", description: "Duration (in seconds) of each element's animation step." },
];

export const blurTextElementProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "-", description: "Individual text element (word or letter)." },
	{ prop: "style", type: "CSSProperties", default: "-", description: "Inline style applied to the element (for spacing)." },
];

const blurTextPropsExport = {
	main: blurTextProps,
	element: blurTextElementProps,
};

export { blurTextPropsExport };
