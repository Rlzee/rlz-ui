import { type PropRow } from "@site/types/props";

export const radioGroupProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "undefined",
  },
  {
    prop: "defaultValue",
    type: "string",
    default: "undefined",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
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
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"vertical"',
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

export const radioGroupItemProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    default: "-",
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

export const radioGroupItemBaseProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "value",
    type: "string",
    default: "-",
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

export const radioGroupIndicatorProps: PropRow[] = [
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

export const radioGroupIconProps: PropRow[] = [
  {
    prop: "icon",
    type: "ReactNode",
    default: "CircleIcon",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

const radioGroupPropsExport = {
    main: radioGroupProps,
    item: radioGroupItemProps,
    itemBase: radioGroupItemBaseProps,
    indicator: radioGroupIndicatorProps,
    icon: radioGroupIconProps,
};
export { radioGroupPropsExport };
