import { type PropRow } from "@site/types/props";

export const dividerProps: PropRow[] = [
  {
    prop: "position",
    type: '"left" | "right" | "center"',
    default: '"center"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "gradient",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "undefined",
  }
];

const dividerPropsExport = {
    main: dividerProps,
};
export { dividerPropsExport };
