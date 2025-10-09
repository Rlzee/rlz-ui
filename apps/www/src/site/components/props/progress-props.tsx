import { type PropRow } from "@site/types/props";

export const progressProps: PropRow[] = [
  {
    prop: "value",
    type: "number | null",
    default: "0",
  },
  {
    prop: "max",
    type: "number",
    default: "100",
  },
  {
    prop: "getValueLabel",
    type: "(value: number, max: number) => string",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof ProgressPrimitive.Root>",
    default: "{}",
  },
];

export const progressRootProps: PropRow[] = [
  {
    prop: "value",
    type: "number | null",
    default: "undefined",
  },
  {
    prop: "max",
    type: "number",
    default: "100",
  },
  {
    prop: "getValueLabel",
    type: "(value: number, max: number) => string",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof ProgressPrimitive.Root>",
    default: "{}",
  },
];

export const progressIndicatorProps: PropRow[] = [
  {
    prop: "value",
    type: "number | null",
    default: "0",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof ProgressPrimitive.Indicator>",
    default: "{}",
  },
];

const progressPropsExport = {
    main: progressProps,
    root: progressRootProps,
    indicator: progressIndicatorProps,
};
export { progressPropsExport };
