import { type PropRow } from "@site/types/props";

export const breadcrumbProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: "-",
  }
];

export const breadcrumbRootProps: PropRow[] = [
  {
    prop: "...props",
    type: "All native <nav> element props",
    default: "{}",
  }
];

export const breadcrumbGroupProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "All native <ol> element props",
    default: "{}",
  }
];

export const breadcrumbListProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "All native <li> element props",
    default: "{}",
  }
];

export const breadcrumbItemProps: PropRow[] = [
  {
    prop: "isActive",
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
  },
  {
    prop: "...props",
    type: "All native <a> element props",
    default: "{}",
  }
];

export const breadcrumbSeparatorProps: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    default: '"/"',
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "All native <span> element props",
    default: "{}",
  }
];

const breadcrumbPropsExport = {
    main: breadcrumbProps,
    root: breadcrumbRootProps,
    group: breadcrumbGroupProps,
    list: breadcrumbListProps,
    item: breadcrumbItemProps,
    separator: breadcrumbSeparatorProps,
};
export { breadcrumbPropsExport };
