"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/src/lib/utils"

/* ------------------------------ Root Popover ------------------------------ */

interface PopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {}
const Popover: React.FC<PopoverProps> = (props) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
)
Popover.displayName = "Popover"

/* ------------------------------ Trigger Popover ------------------------------ */

interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {}
const PopoverTrigger: React.FC<PopoverTriggerProps> = (props) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
)
PopoverTrigger.displayName = "PopoverTrigger"

/* ------------------------------ Content Popover ------------------------------ */

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  className?: string
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

const PopoverContent: React.FC<PopoverContentProps> = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
)
PopoverContent.displayName = "PopoverContent"

/* ------------------------------ Anchor Popover ------------------------------ */

interface PopoverAnchorProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor> {}
const PopoverAnchor: React.FC<PopoverAnchorProps> = (props) => (
  <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
)
PopoverAnchor.displayName = "PopoverAnchor"

/* ------------------------------ Exports ------------------------------ */

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
