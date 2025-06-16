"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/src/lib/utils"

type Orientation = "horizontal" | "vertical"

interface SeparatorProps extends HTMLMotionProps<"div"> {
  orientation?: Orientation
  className?: string
}

const SeparatorBorder: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  className,
  ...props
}) => {
  const isHorizontal = orientation === "horizontal"

  return (
    <motion.div
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
