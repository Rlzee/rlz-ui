import { type PropRow } from "@site/types/props";

export const inputOtpProps: PropRow[] = [
  {
    prop: "type",
    type: '"number" | "alphanumeric"',
    default: '"number"',
  },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    default: "undefined",
  },
  {
    prop: "className",
    type: "string",
    default: '"flex gap-2"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

export const inputOtpSlotProps: PropRow[] = [
  {
    prop: "index",
    type: "number",
    default: "Auto-assigned",
  },
  {
    prop: "className",
    type: "string",
    default: "Predefined styles",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
  },
  {
    prop: "placeholder",
    type: "string",
    default: "undefined",
  },
  {
    prop: "onInput",
    type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
    default: "Internal handler",
  },
  {
    prop: "onKeyDown",
    type: "(e: React.KeyboardEvent<HTMLInputElement>) => void",
    default: "Internal handler",
  },
  {
    prop: "onPaste",
    type: "(e: React.ClipboardEvent<HTMLInputElement>) => void",
    default: "Internal handler",
  },
  {
    prop: "onFocus",
    type: "() => void",
    default: "Internal handler",
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof Input>",
    default: "{}",
  },
];

export const inputOtpGroupProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: '"flex"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

export const inputOtpSeparatorProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: '"flex items-center justify-center"',
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "undefined",
  },
];

const inputOtpPropsExport = {
    main: inputOtpProps,
    slot: inputOtpSlotProps,
    group: inputOtpGroupProps,
    separator: inputOtpSeparatorProps,
};
export { inputOtpPropsExport };
