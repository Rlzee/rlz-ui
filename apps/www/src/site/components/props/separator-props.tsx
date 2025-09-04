import { type PropRow } from "@site/types/props";

export const separatorProps: PropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"vertical"',
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "All native <div> element props",
    default: "{}",
  }
];

const separatorPropsExport = {
    main: separatorProps,
};
export { separatorPropsExport };
