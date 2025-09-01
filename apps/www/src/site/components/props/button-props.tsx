import { type PropRow } from "@site/types/props";

export const buttonProps: PropRow[] = [
  {
    prop: "variant",
    type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
    default: '"primary"',
  },
  {
    prop: "size",
    type: '"default" | "sm" | "lg" | "icon"',
    default: '"default"',
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

const buttonPropsExport = {
    main: buttonProps,
};
export { buttonPropsExport };
