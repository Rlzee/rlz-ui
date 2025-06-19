"use client"

import * as React from "react"
import { cn } from "@/src/lib/utils"

interface SeparatorProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
}

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <div
      role="separator"
      data-slot="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "vertical"
          ? "w-px h-6 bg-border"
          : "h-px w-full bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
