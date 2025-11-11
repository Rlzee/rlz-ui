import { type PropRow } from "@site/types/props";

export const hoverCardProps: PropRow[] = [
  { prop: "className", type: "string", default: "-", description: "Additional CSS classes applied to the root hover card." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-hover-card').Root>", default: "-", description: "All other props forwarded to Radix HoverCard Root." }
];

export const hoverCardTriggerProps: PropRow[] = [
  { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the trigger element." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-hover-card').Trigger>", default: "-", description: "All other props forwarded to Radix HoverCard.Trigger." }
];

export const hoverCardPortalProps: PropRow[] = [
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-hover-card').Portal>", default: "-", description: "Props forwarded to the Portal component." }
];

export const hoverCardContentProps: PropRow[] = [
  { prop: "className", type: "string", default: "-", description: "Additional CSS classes applied to the content wrapper." },
  { prop: "align", type: "'start' | 'center' | 'end'", default: "'center'", description: "Content alignment relative to the trigger." },
  { prop: "sideOffset", type: "number", default: "4", description: "Offset in pixels from the side when positioning the content." },
  { prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-hover-card').Content>", default: "-", description: "All other props forwarded to Radix HoverCard.Content." }
];

const hoverCardPropsExport = {
  main: hoverCardProps,
  trigger: hoverCardTriggerProps,
  portal: hoverCardPortalProps,
  content: hoverCardContentProps,
};

export { hoverCardPropsExport };
