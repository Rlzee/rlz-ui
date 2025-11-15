import { type PropRow } from "@site/types/props";

export const colorPickerProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Slots and subcomponents (Saturation, Hue, Alpha, Preview, FormatSelector, Input, EyeDropper)." },
  { prop: "className", type: "string", default: "'w-[360px] p-4'", description: "Classes applied to the root container." },
  { prop: "defaultColor", type: "string", default: "'#3b82f6'", description: "Initial color in hex used to seed the picker state." },
];

export const colorPickerSaturationProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the saturation block wrapper." },
];

export const colorPickerHueProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the hue slider wrapper." },
  { prop: "min", type: "number", default: "0", description: "Minimum hue value forwarded to the underlying slider." },
  { prop: "max", type: "number", default: "360", description: "Maximum hue value forwarded to the underlying slider." },
];

export const colorPickerAlphaProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the alpha slider wrapper." },
  { prop: "min", type: "number", default: "0", description: "Minimum alpha value (0)." },
  { prop: "max", type: "number", default: "100", description: "Maximum alpha value (100)." },
];

export const colorPickerPreviewProps: PropRow[] = [
  { prop: "className", type: "string", default: "'w-full h-12 rounded-md'", description: "Classes applied to the preview box showing the selected color." },
];

export const colorPickerFormatSelectorProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger button (format selector)." },
  { prop: "contentClassName", type: "string", default: "undefined", description: "Classes applied to the popover/content area of the selector." },
];

export const colorPickerInputProps: PropRow[] = [
  { prop: "readOnly", type: "boolean", default: "true", description: "Whether the input is read-only (default true)." },
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the input wrapper." },
  { prop: "classNameAddon", type: "string", default: "undefined", description: "Classes applied to the input addon (right area)." },
  { prop: "clipboardProps", type: "ComponentProps<typeof Clipboard>", default: "undefined", description: "Props forwarded to the internal `Clipboard` trigger (text is auto-filled)." },
];

export const colorPickerEyeDropperProps: PropRow[] = [
  { prop: "className", type: "string", default: "undefined", description: "Classes applied to the eye-dropper button." },
  { prop: "onClick", type: "(e: MouseEvent) => void", default: "undefined", description: "Click handler forwarded to the underlying `Button` element." },
  { prop: "size", type: "string", default: "'icon'", description: "Button size variant used for the eye-dropper (component uses `size='icon'`)." },
];

const colorPickerPropsExport = {
  main: colorPickerProps,
  saturation: colorPickerSaturationProps,
  hue: colorPickerHueProps,
  alpha: colorPickerAlphaProps,
  preview: colorPickerPreviewProps,
  formatSelector: colorPickerFormatSelectorProps,
  input: colorPickerInputProps,
  eyeDropper: colorPickerEyeDropperProps,
};

export { colorPickerPropsExport };
