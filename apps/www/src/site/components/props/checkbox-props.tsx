import { type PropRow } from "@site/types/props";

export const checkboxProps: PropRow[] = [
  {
    prop: "checked",
    type: "boolean | 'indeterminate'",
    default: "undefined",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean | 'indeterminate') => void",
    default: "undefined",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "required",
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
  }
];

export const checkboxRootProps: PropRow[] = [
  {
    prop: "checked",
    type: "boolean | 'indeterminate'",
    default: "undefined",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean | 'indeterminate') => void",
    default: "undefined",
  },
  {
    prop: "disabled",
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
  }
];

export const checkboxIndicatorProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
  },
  {
    prop: "forceMount",
    type: "boolean",
    default: "false",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

export const checkboxIconProps: PropRow[] = [
  {
    prop: "icon",
    type: "ReactNode",
    default: "CheckIcon",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

const checkboxPropsExport = {
    main: checkboxProps,
    root: checkboxRootProps,
    indicator: checkboxIndicatorProps,
    icon: checkboxIconProps,
};
export { checkboxPropsExport };
