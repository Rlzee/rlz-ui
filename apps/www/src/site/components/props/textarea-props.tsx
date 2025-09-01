import { type PropRow } from "@site/types/props";

export const textareaProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "Record<string, any>",
    default: "{}",
  },
];

const textareaPropsExport = {
  main: textareaProps,
};
export { textareaPropsExport };
