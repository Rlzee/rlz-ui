"use client";

import type * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const groupVariants = cva(
  "flex w-fit items-center has-[>[data-slot=group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "flex-col",
      },
      attached: {
        true: "",
        false: "gap-0.5",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        attached: true,
        className:
          "*:data-slot:has-[~[data-slot]]:rounded-e-none *:data-slot:has-[~[data-slot]]:border-e-0 *:[[data-slot]~[data-slot]]:rounded-s-none *:[[data-slot]~[data-slot]]:border-s-0",
      },
      {
        orientation: "vertical",
        attached: true,
        className:
          "*:data-slot:has-[~[data-slot]]:rounded-b-none *:data-slot:has-[~[data-slot]]:border-b-0 *:[[data-slot]~[data-slot]]:rounded-t-none *:[[data-slot]~[data-slot]]:border-t-0",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      attached: true,
    },
  },
);

function GroupRoot({
  className,
  orientation = "horizontal",
  attached = true,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof groupVariants>) {
  return (
    <div
      role="group"
      data-slot="group"
      data-orientation={orientation}
      className={cn(groupVariants({ orientation, attached }), className)}
      {...props}
    />
  );
}

function GroupSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="group-separator"
      className={cn(
        "pointer-events-none relative z-2 shrink-0 bg-border",
        "in-data-[orientation=horizontal]:self-stretch in-data-[orientation=horizontal]:w-px",
        "in-data-[orientation=vertical]:h-px in-data-[orientation=vertical]:w-full",
        "in-data-[orientation=horizontal]:[[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px",
        "in-data-[orientation=horizontal]:has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px",
        "in-data-[orientation=vertical]:[[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-y-px",
        "in-data-[orientation=vertical]:has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-y-px",
        className,
      )}
      {...props}
    />
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
      "relative inline-flex self-stretch items-center gap-2 whitespace-nowrap rounded-md border bg-secondary px-[calc(--spacing(3)-1px)] text-sm text-muted-foreground",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

const GroupExports = Object.assign(GroupRoot, {
  Separator: GroupSeparator,
  Text: GroupText,
});

export { GroupExports as Group, GroupSeparator };
