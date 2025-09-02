import { type PropRow } from "@site/types/props";

export const kbdProps: PropRow[] = [
  {
    prop: "shortcutKey",
    type: "string",
    default: "-",
  },
  {
    prop: "onShortcutPressed",
    type: "() => void",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "...props",
    type: "All native <kbd> element props",
    default: "{}",
  }
];

const kbdPropsExport = {
    main: kbdProps,
};
export { kbdPropsExport };
