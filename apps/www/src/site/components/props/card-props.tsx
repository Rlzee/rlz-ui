import { type PropRow } from "@site/types/props";

export const cardProps: PropRow[] = [
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

export const cardHeaderProps: PropRow[] = [
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
    type: "ComponentProps<'header'>",
    default: "{}",
  },
];

export const cardTitleProps: PropRow[] = [
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
    type: "ComponentProps<'h3'>",
    default: "{}",
  },
];

export const cardDescriptionProps: PropRow[] = [
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

export const cardBodyProps: PropRow[] = [
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

export const cardFooterProps: PropRow[] = [
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
    type: "ComponentProps<'footer'>",
    default: "{}",
  },
];

const cardPropsExport = {
    main: cardProps,
    header: cardHeaderProps,
    title: cardTitleProps,
    description: cardDescriptionProps,
    body: cardBodyProps,
    footer: cardFooterProps,
};
export { cardPropsExport };
