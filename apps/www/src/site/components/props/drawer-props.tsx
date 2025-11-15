import { type PropRow } from "@site/types/props";

export const drawerProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Drawer children (Trigger, Content, etc.)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the root Drawer container." },
];

export const drawerTriggerProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Trigger content (button or custom element)." },
	{ prop: "asChild", type: "boolean", default: "false", description: "Render trigger as child to forward props to a child element." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the trigger element." },
];

export const drawerPortalProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Portal children (usually Drawer.Content)." },
];

export const drawerOverlayProps: PropRow[] = [
	{ prop: "className", type: "string", default: "'fixed inset-0 bg-black/50 z-50'", description: "Classes applied to the overlay/backdrop." },
	{ prop: "onClick", type: "() => void", default: "undefined", description: "Callback when overlay is clicked (commonly used to close the drawer)." },
];

export const drawerContentProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Content children (Header, Body, Footer...)." },
	{ prop: "overlay", type: "boolean", default: "true", description: "Whether to render the overlay/backdrop." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the content element (position/size vary by direction)." },
	{ prop: "direction", type: "'top' | 'bottom' | 'left' | 'right'", default: "'right'", description: "Direction the drawer opens from (affects positioning/styles)." },
];

export const drawerHandleProps: PropRow[] = [
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the handle element (used for bottom/top drawers)." },
];

export const drawerHeaderProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Header content (Title + Description)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the header element." },
];

export const drawerTitleProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Title text/content." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the title element." },
];

export const drawerDescriptionProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Description text/content shown under the title." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the description element." },
];

export const drawerBodyProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Main body content of the drawer." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the body container (scroll area)." },
];

export const drawerFooterProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Footer content (actions/buttons)." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the footer element." },
];

export const drawerCloseProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "undefined", description: "Close button content or icon." },
	{ prop: "className", type: "string", default: "undefined", description: "Classes applied to the close element." },
];

const drawerPropsExport = {
	main: drawerProps,
	trigger: drawerTriggerProps,
	portal: drawerPortalProps,
	overlay: drawerOverlayProps,
	content: drawerContentProps,
	handle: drawerHandleProps,
	header: drawerHeaderProps,
	title: drawerTitleProps,
	description: drawerDescriptionProps,
	body: drawerBodyProps,
	footer: drawerFooterProps,
	close: drawerCloseProps,
};

export { drawerPropsExport };
