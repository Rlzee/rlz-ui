import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "@/lib/utils";

function ToolbarRoot({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "relative flex gap-2 rounded-md border bg-popover not-dark:bg-clip-padding p-1 text-foreground shadow-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function ToolbarButton(props: ToolbarPrimitive.Button.Props) {
  return <ToolbarPrimitive.Button data-slot="toolbar-button" {...props} />;
}

function ToolbarSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:my-0.5 data-[orientation=vertical]:my-1.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarLink(props: ToolbarPrimitive.Link.Props) {
  return <ToolbarPrimitive.Link data-slot="toolbar-link" {...props} />;
}

function ToolbarInput(props: ToolbarPrimitive.Input.Props) {
  return <ToolbarPrimitive.Input data-slot="toolbar-input" {...props} />;
}

const ToolbarExports = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  Input: ToolbarInput,
});

export {
  ToolbarExports as Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarInput,
};
