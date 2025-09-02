import { type PropRow } from "@site/types/props";

export const inputAddonProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "classNameContent",
    type: "string",
    default: "undefined",
  },
  {
    prop: "type",
    type: "string",
    default: '"text"',
  },
  {
    prop: "...props",
    type: "All native <input> element props",
    default: "{}",
  }
];

export const inputAddonLeftProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "-",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

export const inputAddonRightProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "-",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

const inputAddonPropsExport = {
    main: inputAddonProps,
    left: inputAddonLeftProps,
    right: inputAddonRightProps,
};
export { inputAddonPropsExport };
