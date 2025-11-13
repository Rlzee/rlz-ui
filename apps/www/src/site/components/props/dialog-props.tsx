import { type PropRow } from "@site/types/props";

export const dialogProps: PropRow[] = [
  { prop: "open", type: "boolean", default: "undefined", description: "Controlled open state for the dialog root." },
  { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state for uncontrolled usage." },
  { prop: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Callback fired when the open state changes." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Dialog structure (Trigger, Content, Header, Body, Footer...)." },
];

export const dialogTriggerProps: PropRow[] = [
  { prop: "asChild", type: "boolean", default: "false", description: "When true renders the trigger's child directly and attaches event handlers to it." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Trigger content (button or element that opens the dialog)." },
  { prop: "...props", type: "ComponentProps<typeof HTMLElement>", default: "{}", description: "Additional HTML props forwarded to the trigger element." },
];

export const dialogPortalProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Portal content (usually the Dialog.Content)." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Portal>", default: "{}", description: "Additional props forwarded to the Portal primitive." },
];

export const dialogCloseProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Close button content; often used with asChild to render a custom button." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Close>", default: "{}", description: "Additional props forwarded to the Close primitive." },
];

export const dialogOverlayProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the overlay element (backdrop)." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Overlay>", default: "{}", description: "Additional props forwarded to the overlay primitive." },
];

export const dialogContentProps: PropRow[] = [
  { prop: "overlay", type: "boolean", default: "true", description: "When true renders the overlay behind the dialog content." },
  { prop: "showCloseButton", type: "boolean", default: "true", description: "Toggles the built-in close button rendered inside the content." },
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the content wrapper." },
  { prop: "children", type: "ReactNode", default: "undefined", description: "Content children (Header, Body, Footer...)." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Content>", default: "{}", description: "Additional props forwarded to the Content primitive." },
];

export const dialogHeaderProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the header element." },
  { prop: "...props", type: "ComponentProps<'header'>", default: "{}", description: "Additional props forwarded to the header element." },
];

export const dialogBodyProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the main/body element." },
  { prop: "...props", type: "ComponentProps<'main'>", default: "{}", description: "Additional props forwarded to the body element." },
];

export const dialogFooterProps: PropRow[] = [
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the footer element." },
  { prop: "...props", type: "ComponentProps<'footer'>", default: "{}", description: "Additional props forwarded to the footer element." },
];

export const dialogTitleProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Title content." },
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the title element." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Title>", default: "{}", description: "Additional props forwarded to the Title primitive." },
];

export const dialogDescriptionProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "undefined", description: "Description content." },
  { prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the description element." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Description>", default: "{}", description: "Additional props forwarded to the Description primitive." },
];

const dialogPropsExport = {
  main: dialogProps,
  trigger: dialogTriggerProps,
  portal: dialogPortalProps,
  close: dialogCloseProps,
  overlay: dialogOverlayProps,
  content: dialogContentProps,
  header: dialogHeaderProps,
  body: dialogBodyProps,
  footer: dialogFooterProps,
  title: dialogTitleProps,
  description: dialogDescriptionProps,
};

export { dialogPropsExport };
