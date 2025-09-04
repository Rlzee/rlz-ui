import { type PropRow } from "@site/types/props";

export const separatorBorderProps: PropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
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

const separatorBorderPropsExport = {
    main: separatorBorderProps,
};
export { separatorBorderPropsExport };
