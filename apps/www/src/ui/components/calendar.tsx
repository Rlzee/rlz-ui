import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@ui/lib/utils";
import { buttonVariants } from "@ui/components/button";
import { enUS, fr, faIR, arSA, de, es, ja, ru } from "date-fns/locale";

export const locales = {
  "en-US": enUS,
  fr: fr,
  "fa-IR": faIR,
  "ar-SA": arSA,
  de: de,
  es: es,
  ja: ja,
  ru: ru,
};

export type LocaleKey = keyof typeof locales;

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  localeKey?: LocaleKey;
};

const DEFAULT_STYLE_CLASSES = {
  months: "relative flex flex-col sm:flex-row gap-4",
  month: "w-full",
  month_caption:
    "relative mx-10 mb-1 flex h-9 items-center justify-center z-20",
  caption_label: "text-sm font-medium",
  nav: "absolute top-0 flex w-full justify-between z-10",
  button_previous: cn(
    buttonVariants({ variant: "ghost" }),
    "size-9 text-muted-foreground/80 hover:text-foreground p-0"
  ),
  button_next: cn(
    buttonVariants({ variant: "ghost" }),
    "size-9 text-muted-foreground/80 hover:text-foreground p-0"
  ),
  weekday: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
  day_button:
    "relative flex size-9 items-center justify-center whitespace-nowrap rounded-lg p-0 text-foreground outline-offset-2 group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 focus:outline-none group-data-[disabled]:pointer-events-none focus-visible:z-10 hover:bg-secondary group-data-[selected]:bg-primary hover:text-muted-foreground group-data-[selected]:text-primary-foreground group-data-[disabled]:text-foreground/30 group-data-[disabled]:line-through group-data-[outside]:text-foreground/30 group-data-[outside]:group-data-[selected]:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-data-[selected]:group-[.range-middle]:bg-secondary group-data-[selected]:group-[.range-middle]:text-foreground",
  day: "group size-9 px-0 text-sm",
  range_start: "range-start",
  range_end: "range-end",
  range_middle: "range-middle",
  today:
    "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
  outside:
    "text-muted-foreground data-selected:bg-secondary/50 data-selected:text-muted-foreground",
  hidden: "invisible",
  week_number: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
};

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  localeKey = "en-US",
  components: userComponents,
  ...props
}: CalendarProps) => {
  const mergedClassNames: typeof DEFAULT_STYLE_CLASSES = Object.keys(
    DEFAULT_STYLE_CLASSES
  ).reduce(
    (acc, key) => ({
      ...acc,
      [key]: classNames?.[key as keyof typeof classNames]
        ? cn(
            DEFAULT_STYLE_CLASSES[key as keyof typeof DEFAULT_STYLE_CLASSES],
            classNames[key as keyof typeof classNames]
          )
        : DEFAULT_STYLE_CLASSES[key as keyof typeof DEFAULT_STYLE_CLASSES],
    }),
    {} as typeof DEFAULT_STYLE_CLASSES
  );

  const defaultComponents = {
    Chevron: (props: any) => {
      if (props.orientation === "left") {
        return (
          <ChevronLeft
            size={16}
            strokeWidth={2}
            {...props}
            aria-hidden="true"
          />
        );
      }
      return (
        <ChevronRight size={16} strokeWidth={2} {...props} aria-hidden="true" />
      );
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  const isRTL = ["fa-IR", "ar-SA", "he"].includes(localeKey);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <DayPicker
        data-slot="calendar"
        showOutsideDays={showOutsideDays}
        locale={locales[localeKey]}
        className={cn("w-fit", className)}
        classNames={mergedClassNames}
        components={mergedComponents}
        {...props}
      />
    </div>
  );
};

export { Calendar };
