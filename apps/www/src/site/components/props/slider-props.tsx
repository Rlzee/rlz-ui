import { type PropRow } from "@site/types/props";

export const sliderProps: PropRow[] = [
  {
    prop: "value",
    type: "number[]",
    default: "undefined",
  },
  {
    prop: "defaultValue",
    type: "number[]",
    default: "[min, max]",
  },
  {
    prop: "onValueChange",
    type: "(value: number[]) => void",
    default: "undefined",
  },
  {
    prop: "onValueCommit",
    type: "(value: number[]) => void",
    default: "undefined",
  },
  {
    prop: "min",
    type: "number",
    default: "0",
  },
  {
    prop: "max",
    type: "number",
    default: "100",
  },
  {
    prop: "step",
    type: "number",
    default: "1",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
  },
  {
    prop: "dir",
    type: '"ltr" | "rtl"',
    default: '"ltr"',
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "inverted",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof SliderRoot>",
    default: "{}",
  },
];

export const sliderRootProps: PropRow[] = [
  {
    prop: "value",
    type: "number[]",
    default: "undefined",
  },
  {
    prop: "defaultValue",
    type: "number[]",
    default: "undefined",
  },
  {
    prop: "onValueChange",
    type: "(value: number[]) => void",
    default: "undefined",
  },
  {
    prop: "onValueCommit",
    type: "(value: number[]) => void",
    default: "undefined",
  },
  {
    prop: "min",
    type: "number",
    default: "0",
  },
  {
    prop: "max",
    type: "number",
    default: "100",
  },
  {
    prop: "step",
    type: "number",
    default: "1",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
  },
  {
    prop: "dir",
    type: '"ltr" | "rtl"',
    default: '"ltr"',
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "inverted",
    type: "boolean",
    default: "false",
  },
  {
    prop: "name",
    type: "string",
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
    type: "ComponentProps<typeof SliderPrimitive.Root>",
    default: "{}",
  },
];

export const sliderTrackProps: PropRow[] = [
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
    type: "ComponentProps<typeof SliderPrimitive.Track>",
    default: "{}",
  },
];

export const sliderRangeProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof SliderPrimitive.Range>",
    default: "{}",
  },
];

export const sliderThumbProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof SliderPrimitive.Thumb>",
    default: "{}",
  },
];

const sliderPropsExport = {
    main: sliderProps,
    root: sliderRootProps,
    track: sliderTrackProps,
    range: sliderRangeProps,
    thumb: sliderThumbProps,
};
export { sliderPropsExport };
