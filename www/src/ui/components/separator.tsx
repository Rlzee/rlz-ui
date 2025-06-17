"use client"

import * as React from "react"
import { cn } from "@/src/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <div
      role="separator"
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

Separator.displayName = "Separator"

export { Separator }
