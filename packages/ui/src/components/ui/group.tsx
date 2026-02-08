import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const groupVariants = cva("flex w-fit items-stretch", {
  variants: {
    orientation: {
      horizontal:
        "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
      vertical:
        "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

function GroupRoot({
  className,
  orientation,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof groupVariants>) {
  return (
    <div
      role="group"
      data-slot="group"
      data-orientation={orientation}
      className={cn(groupVariants({ orientation }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

function GroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "group-text",
    className: cn(
      "bg-secondary flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function GroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="group-separator"
      orientation={orientation}
      className={cn(
        "bg-border relative m-0! self-stretch data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

const GroupExports = Object.assign(GroupRoot, {
  Text: GroupText,
  Separator: GroupSeparator,
});

export { GroupExports as Group, GroupSeparator, GroupText };
