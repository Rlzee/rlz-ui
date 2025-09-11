import { type PropRow } from "@site/types/props";

export const alertProps: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "destructive" | "warning" | "info" | "success"',
    default: '"default"',
  },
  {
    prop: "icon",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "title",
    type: "string",
    default: "undefined",
  },
  {
    prop: "description",
    type: "string",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "ComponentProps<'div'>",
    default: "{}",
  },
];

export const alertRootProps: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "destructive" | "warning" | "info" | "success"',
    default: '"default"',
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'div'>",
    default: "{}",
  },
];

export const alertTitleProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'h4'>",
    default: "{}",
  },
];

export const alertDescriptionProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
  {
    prop: "...props",
    type: "ComponentProps<'p'>",
    default: "{}",
  },
];

const alertPropsExport = {
    main: alertProps,
    root: alertRootProps,
    title: alertTitleProps,
    description: alertDescriptionProps,
};
export { alertPropsExport };
