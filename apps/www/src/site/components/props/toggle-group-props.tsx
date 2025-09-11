import { type PropRow } from "@site/types/props";

export const toggleGroupProps: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline"',
    default: '"default"',
  },
  {
    prop: "size",
    type: '"default" | "sm" | "lg" | "custom"',
    default: '"default"',
  },
  {
    prop: "type",
    type: '"single" | "multiple"',
    default: '"single"',
  },
  {
    prop: "value",
    type: "string | string[]",
    default: "undefined",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    default: "undefined",
  },
  {
    prop: "onValueChange",
    type: "(value: string | string[]) => void",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "rovingFocus",
    type: "boolean",
    default: "true",
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
    prop: "loop",
    type: "boolean",
    default: "true",
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
];

export const toggleGroupItemProps: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline"',
    default: "Inherited from ToggleGroup",
  },
  {
    prop: "size",
    type: '"default" | "sm" | "lg" | "custom"',
    default: "Inherited from ToggleGroup",
  },
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
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
];

const toggleGroupPropsExport = {
    main: toggleGroupProps,
    item: toggleGroupItemProps,
};
export { toggleGroupPropsExport };
