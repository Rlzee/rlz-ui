import { type PropRow } from "@site/types/props";

export const badgeProps: PropRow[] = [
  {
    prop: "variant",
    type: '"primary" | "outline" | "background"',
    default: '"primary"',
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "...props",
    type: "Record<string, any>",
    default: "{}",
  }
];

const badgePropsExport = {
    main: badgeProps,
};
export { badgePropsExport };
