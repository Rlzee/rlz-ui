import { type PropRow } from "@site/types/props";

export const alertDialogProps: PropRow[] = [
	{ prop: "(store) params", type: "AlertDialogParams", default: "-", description: "Parameters passed to the dialog store when opening the alert (see AlertDialogParams: title, description, ConfirmText, CloseText, ConfirmVariant, CloseVariant, onConfirm)." },
	{ prop: "children", type: "ReactNode", default: "undefined", description: "You normally don't pass children — the AlertDialog is rendered once and reads state from the global dialog store." },
];

export const alertDialogContentProps: PropRow[] = [
	{ prop: "role", type: "string", default: "'alert-dialog'", description: "Role applied to the content element for accessibility." },
	{ prop: "aria-modal", type: "boolean", default: "true", description: "Marks the dialog as modal for assistive tech." },
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the content wrapper." },
	{ prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Content>", default: "{}", description: "Additional props forwarded to the underlying Radix Content primitive." },
];

export const alertDialogHeaderProps: PropRow[] = [
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the header element." },
	{ prop: "...props", type: "ComponentProps<'header'>", default: "{}", description: "Additional props forwarded to the header element." },
];

export const alertDialogTitleProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "'Are you absolutely sure?'", description: "Title text displayed in the alert dialog (comes from store params by default)." },
	{ prop: "id", type: "string", default: "auto-generated", description: "ARIA id used to reference the title." },
	{ prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Title>", default: "{}", description: "Additional props forwarded to the Radix Title primitive." },
];

export const alertDialogDescriptionProps: PropRow[] = [
	{ prop: "children", type: "ReactNode", default: "'This action cannot be undone.'", description: "Supporting description text (comes from store params by default)." },
	{ prop: "id", type: "string", default: "auto-generated", description: "ARIA id used to reference the description." },
	{ prop: "...props", type: "ComponentProps<typeof import('@radix-ui/react-dialog').Description>", default: "{}", description: "Additional props forwarded to the Radix Description primitive." },
];

export const alertDialogFooterProps: PropRow[] = [
	{ prop: "className", type: "string", default: "Predefined styles", description: "Classes applied to the footer element." },
	{ prop: "...props", type: "ComponentProps<'footer'>", default: "{}", description: "Additional props forwarded to the footer element." },
];

export const alertDialogCloseButtonProps: PropRow[] = [
	{ prop: "CloseText", type: "string", default: "'Close'", description: "Label for the close button — provided via store params when opening the dialog." },
	{ prop: "CloseVariant", type: "buttonVariantTypes", default: "'outline'", description: "Button variant used for the close action." },
	{ prop: "onClick", type: "() => void", default: "closeDialog()", description: "Closes the dialog; also forwarded when rendering a custom close button." },
	{ prop: "...props", type: "ComponentProps<typeof import('@ui/components/button').Button>", default: "{}", description: "Additional props forwarded to the Button component used as the close action." },
];

export const alertDialogConfirmButtonProps: PropRow[] = [
	{ prop: "ConfirmText", type: "string", default: "'Confirm'", description: "Label for the confirm button — provided via store params when opening the dialog." },
	{ prop: "ConfirmVariant", type: "buttonVariantTypes", default: "'primary'", description: "Button variant used for the confirm action." },
	{ prop: "onClick", type: "() => void | Promise<void>", default: "() => {}", description: "Callback executed when confirming; the dialog will close after the callback resolves." },
	{ prop: "autoFocus", type: "boolean", default: "true", description: "The confirm button is autoFocused by default to help keyboard users." },
	{ prop: "...props", type: "ComponentProps<typeof import('@ui/components/button').Button>", default: "{}", description: "Additional props forwarded to the Button component used as the confirm action." },
];

const alertDialogPropsExport = {
	main: alertDialogProps,
	content: alertDialogContentProps,
	header: alertDialogHeaderProps,
	title: alertDialogTitleProps,
	description: alertDialogDescriptionProps,
	footer: alertDialogFooterProps,
	closeButton: alertDialogCloseButtonProps,
	confirmButton: alertDialogConfirmButtonProps,
};

export { alertDialogPropsExport };
