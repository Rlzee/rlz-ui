import { type PropRow } from "@site/types/props";

export const labelProps: PropRow[] = [
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

const labelPropsExport = {
    main: labelProps,
};
export { labelPropsExport };
