import { type PropRow } from "@site/types/props";

export const inputProps: PropRow[] = [
  {
    prop: "type",
    type: "string",
    default: '"text"',
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

const inputPropsExport = {
    main: inputProps,
};
export { inputPropsExport };
