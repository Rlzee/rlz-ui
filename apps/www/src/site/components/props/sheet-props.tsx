import { type PropRow } from "@site/types/props";

export const sheetProps: PropRow[] = [
  { prop: "direction", type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: "Slide direction for the sheet (controls enter/exit animations and placement)." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Sheet structure (Trigger, Content, Header, Body, Footer, etc)." },
  { prop: "open", type: "boolean", default: "undefined", description: "Controlled open state forwarded to the underlying Radix Root." },
  { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state for uncontrolled usage." },
  { prop: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Callback fired when the open state changes." },
];

export const sheetTriggerProps: PropRow[] = [
  { prop: "asChild", type: "boolean", default: "false", description: "When true the trigger renders its child directly and attaches event handlers to it." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Trigger content (element that toggles the sheet)." },
  { prop: "...props", type: "ComponentProps<typeof HTMLDivElement>", default: "{}", description: "Additional HTML attributes forwarded to the trigger element." },
];

export const sheetContentProps: PropRow[] = [
  { prop: "overlay", type: "boolean", default: "true", description: "When true renders an overlay behind the sheet content." },
  { prop: "className", type: "string", default: "Predefined styles", description: "Additional classes applied to the content wrapper." },
  { prop: "style", type: "CSSProperties", default: "-", description: "Inline styles applied to the content wrapper (positioning is handled by the component)." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Content inside the sheet (Header, Body, Footer, etc)." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Content>", default: "{}", description: "Additional props forwarded to the underlying Radix Content primitive." },
];

export const sheetOverlayProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Additional classes applied to the overlay element." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Overlay>", default: "{}", description: "Additional props forwarded to the overlay primitive." },
];

export const sheetHeaderProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the header element." },
  { prop: "...props", type: "ComponentProps<'header'>", default: "{}", description: "Additional props forwarded to the header element." },
];

export const sheetBodyProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the main/body element." },
  { prop: "...props", type: "ComponentProps<'main'>", default: "{}", description: "Additional props forwarded to the body element." },
];

export const sheetFooterProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the footer element." },
  { prop: "...props", type: "ComponentProps<'footer'>", default: "{}", description: "Additional props forwarded to the footer element." },
];

export const sheetTitleProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the title element." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Title content." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Title>", default: "{}", description: "Additional props forwarded to the Radix Title primitive." },
];

export const sheetDescriptionProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the description element." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Description content." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Description>", default: "{}", description: "Additional props forwarded to the Radix Description primitive." },
];

const sheetPropsExport = {
  main: sheetProps,
  trigger: sheetTriggerProps,
  content: sheetContentProps,
  overlay: sheetOverlayProps,
  header: sheetHeaderProps,
  body: sheetBodyProps,
  footer: sheetFooterProps,
  title: sheetTitleProps,
  description: sheetDescriptionProps,
};

export { sheetPropsExport };
