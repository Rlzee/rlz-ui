"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/src/lib/utils"

type Orientation = "horizontal" | "vertical"

interface SeparatorProps extends HTMLMotionProps<"div"> {
  orientation?: Orientation
  className?: string
}

const SeparatorBorder = ({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => {
  const isHorizontal = orientation === "horizontal"

  return (
    <motion.div
      role="separator"
      data-slot="separator-border"
      className={cn(
        isHorizontal ? "w-full h-6 border-y" : "h-full w-6 border-x",
        "separator-diagonal-bg border-[var(--border)]",
        className
      )}
      {...props}
    />
  )
}

export { SeparatorBorder }
