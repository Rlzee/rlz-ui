import { type PropRow } from "@site/types/props";

export const toggleProps: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline"',
    default: '"default"',
  },
  {
    prop: "size",
    type: '"default" | "sm" | "lg"',
    default: '"default"',
  },
  {
    prop: "pressed",
    type: "boolean",
    default: "undefined",
  },
  {
    prop: "defaultPressed",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onPressedChange",
    type: "(pressed: boolean) => void",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "name",
    type: "string",
    default: "undefined",
  },
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "required",
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
    prop: "...props",
    type: "Record<string, any>",
    default: "{}",
  }
];

const togglePropsExport = {
    main: toggleProps,
};
export { togglePropsExport };
