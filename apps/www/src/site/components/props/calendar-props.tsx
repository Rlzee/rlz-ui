import { type PropRow } from "@site/types/props";

export const calendarProps: PropRow[] = [
	{
		prop: "className",
		type: "string",
		default: "-",
		description: "Additional CSS classes applied to the calendar container."
	},
	{
		prop: "classNames",
		type: "Partial<Record<string, string>>",
		default: "-",
		description: "Override or extend internal DayPicker class names (see available keys)."
	},
	{
		prop: "showOutsideDays",
		type: "boolean",
		default: "true",
		description: "Whether days from adjacent months are shown in the month grid."
	},
	{
		prop: "localeKey",
		type: "LocaleKey",
		default: '"en-US"',
		description: "Locale key used to resolve the locale from the internal `locales` map."
	},
	{
		prop: "components",
		type: "Partial<Record<string, any>>",
		default: "-",
		description: "Custom renderer components passed to react-day-picker (e.g. custom Chevron)."
	},
	{
		prop: "...props",
		type: "ComponentProps<typeof import('react-day-picker').DayPicker>",
		default: "-",
		description: "All other props supported by react-day-picker are forwarded."
	}
];

export const calendarClassNamesProps: PropRow[] = [
	{ prop: "months", type: "string", default: "'relative flex flex-col sm:flex-row gap-4'", description: "Container for months." },
	{ prop: "month", type: "string", default: "'w-full'", description: "Single month container." },
	{ prop: "month_caption", type: "string", default: "'relative mx-10 mb-1 flex h-9 items-center justify-center z-20'", description: "Caption container styling." },
	{ prop: "caption_label", type: "string", default: "'text-sm font-medium'", description: "Caption text styling." },
	{ prop: "nav", type: "string", default: "'absolute top-0 flex w-full justify-between z-10'", description: "Navigation wrapper styling." },
	{ prop: "button_previous", type: "string", default: "buttonVariants(ghost)", description: "Previous button classes." },
	{ prop: "button_next", type: "string", default: "buttonVariants(ghost)", description: "Next button classes." },
	{ prop: "weekday", type: "string", default: "'size-9 p-0 text-xs font-medium text-muted-foreground/80'", description: "Weekday header styling." },
	{ prop: "day_button", type: "string", default: "'relative flex size-9 ...'", description: "Day button styling (states handled via data attributes)." },
	{ prop: "day", type: "string", default: "'group size-9 px-0 text-sm'", description: "Day wrapper styling." },
	{ prop: "range_start", type: "string", default: "'range-start'", description: "Class for range start placeholder." },
	{ prop: "range_end", type: "string", default: "'range-end'", description: "Class for range end placeholder." },
	{ prop: "range_middle", type: "string", default: "'range-middle'", description: "Class for range middle placeholder." },
	{ prop: "today", type: "string", default: "'today styling'", description: "Decoration styling for today's date." },
	{ prop: "outside", type: "string", default: "'text-muted-foreground'", description: "Styling for days outside the current month." },
	{ prop: "hidden", type: "string", default: "'invisible'", description: "Hidden elements styling." },
	{ prop: "week_number", type: "string", default: "'size-9 p-0 text-xs font-medium text-muted-foreground/80'", description: "Week number cell styling." }
];

export const calendarLocalesProps: PropRow[] = [
	{ prop: "localeKey", type: "LocaleKey", default: '"en-US"', description: "Key selecting the locale used by the calendar (maps to internal locales object)." },
	{ prop: "locales", type: "Record<string, Locale>", default: "internal map", description: "Available locales bundled with the calendar component." }
];

const calendarPropsExport = {
	main: calendarProps,
	classNames: calendarClassNamesProps,
	locales: calendarLocalesProps,
};

export { calendarPropsExport };
