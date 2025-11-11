import { type PropRow } from "@site/types/props";

export const carouselProps: PropRow[] = [
	{
		prop: "children",
		type: "ReactNode",
		default: "-",
		description: "Carousel children (usually `Carousel.Content` and controls)."
	},
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes applied to the carousel container."
	},
	{
		prop: "opts",
		type: "CarouselOptions",
		default: "-",
		description: "Options forwarded to `useEmblaCarousel` (alignment, loop, etc.)."
	},
	{
		prop: "plugins",
		type: "CarouselPlugin",
		default: "-",
		description: "Embla carousel plugins (e.g. autoplay)."
	},
	{
		prop: "orientation",
		type: '\"horizontal\" | \"vertical\"',
		default: '\"horizontal\"',
		description: "Carousel orientation (horizontal by default)."
	},
	{
		prop: "setApi",
		type: "(api: CarouselApi) => void",
		default: "-",
		description: "Optional callback that receives the Embla API instance."
	}
];

export const carouselProviderProps: PropRow[] = [
	{
		prop: "children",
		type: "ReactNode",
		default: "-",
		description: "Provider children that will have access to the carousel context."
	},
	{
		prop: "opts",
		type: "CarouselOptions",
		default: "-",
		description: "Embla options forwarded by the provider."
	},
	{
		prop: "plugins",
		type: "CarouselPlugin",
		default: "-",
		description: "Embla plugins forwarded by the provider."
	},
	{
		prop: "orientation",
		type: '\"horizontal\" | \"vertical\"',
		default: '\"horizontal\"',
		description: "Orientation handled by the provider."
	},
	{
		prop: "setApi",
		type: "(api: CarouselApi) => void",
		default: "-",
		description: "Callback to expose the Embla API from the provider."
	}
];

export const carouselInnerProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "-", description: "Inner content (wraps the carousel and handles keyboard navigation)." },
	{ prop: "className", type: "string", default: "-", description: "Additional CSS classes for the inner wrapper." }
];

export const carouselContentProps: PropRow[] = [
	{ prop: "className", type: "string", default: "-", description: "Classes applied to the inner content wrapper (the flex container)." },
	{ prop: "...props", type: 'ComponentProps<"div">', default: "-", description: "All other div props forwarded to the content element." }
];

export const carouselSlideProps: PropRow[] = [
	{ prop: "className", type: "string", default: "-", description: "Classes applied to each slide element." },
	{ prop: "...props", type: 'ComponentProps<"div">', default: "-", description: "All other div props forwarded to the slide element." }
];

export const carouselPreviousProps: PropRow[] = [
	{ prop: "variant", type: "ButtonVariant", default: '\"outline\"', description: "Button variant for the previous control." },
	{ prop: "size", type: "ButtonSize", default: '\"icon\"', description: "Button size for the previous control." },
	{ prop: "className", type: "string", default: "-", description: "Additional classes applied to the previous button." },
	{ prop: "...props", type: "ComponentProps<typeof Button>", default: "-", description: "All other Button props forwarded to the previous control." }
];

export const carouselNextProps: PropRow[] = [
	{ prop: "variant", type: "ButtonVariant", default: '\"outline\"', description: "Button variant for the next control." },
	{ prop: "size", type: "ButtonSize", default: '\"icon\"', description: "Button size for the next control." },
	{ prop: "className", type: "string", default: "-", description: "Additional classes applied to the next button." },
	{ prop: "...props", type: "ComponentProps<typeof Button>", default: "-", description: "All other Button props forwarded to the next control." }
];

export const carouselIndicatorsProps: PropRow[] = [
	{ prop: "className", type: "string", default: "-", description: "Classes applied to the indicators container." },
	{ prop: "...props", type: 'ComponentProps<"div">', default: "-", description: "All other div props forwarded to the indicators container." }
];

export const carouselCounterProps: PropRow[] = [
	{ prop: "className", type: "string", default: "-", description: "Classes applied to the counter element." },
	{ prop: "separator", type: "string", default: '\"/\"', description: "Separator between current and total slides." },
	{ prop: "...props", type: 'ComponentProps<"div">', default: "-", description: "All other div props forwarded to the counter element." }
];

const carouselPropsExport = {
	main: carouselProps,
	provider: carouselProviderProps,
	inner: carouselInnerProps,
	content: carouselContentProps,
	slide: carouselSlideProps,
	previous: carouselPreviousProps,
	next: carouselNextProps,
	indicators: carouselIndicatorsProps,
	counter: carouselCounterProps,
};

export { carouselPropsExport };
