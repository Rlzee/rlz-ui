import { type PropRow } from "@site/types/props";

export const switchProps: PropRow[] = [
  {
    prop: "checked",
    type: "boolean",
    default: "undefined",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
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
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  }
];

export const switchRootProps: PropRow[] = [
  {
    prop: "checked",
    type: "boolean",
    default: "undefined",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
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

export const switchThumbProps: PropRow[] = [
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

const switchPropsExport = {
    main: switchProps,
    root: switchRootProps,
    thumb: switchThumbProps,
};
export { switchPropsExport };
