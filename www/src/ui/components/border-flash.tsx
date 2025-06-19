"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/src/lib/utils"

type BorderType = "top" | "right" | "bottom" | "left" | "x" | "y"
type BorderAnim = "bottom" | "top" | "left" | "right"

interface BorderFlashProps {
  border: BorderType
  borderAnim: BorderAnim
  dashed?: boolean
  className?: string
}

const getBorderAnim = (side: BorderAnim) => {
  const base = { duration: 1, ease: "easeOut" as const }

  switch (side) {
    case "bottom":
      return {
        initial: { scaleY: 0 },
        animate: { scaleY: 1 },
        transition: { ...base },
        style: { transformOrigin: "bottom" as const },
      }
    case "top":
      return {
        initial: { scaleY: 0 },
        animate: { scaleY: 1 },
        transition: { ...base, delay: 0.1 },
        style: { transformOrigin: "top" as const },
      }
    case "left":
      return {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { ...base, delay: 0.2 },
        style: { transformOrigin: "left" as const },
      }
    case "right":
      return {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { ...base, delay: 0.3 },
        style: { transformOrigin: "right" as const },
      }
  }
}

const BorderFlash = ({
  border,
  borderAnim,
  dashed = false,
  className,
}: BorderFlashProps) => {
  const [flash, setFlash] = useState(false)
  const [removeFlash, setRemoveFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    setRemoveFlash(false)

    const timeout1 = setTimeout(() => setRemoveFlash(true), 250)
    const timeout2 = setTimeout(() => {
      setFlash(false)
      setRemoveFlash(false)
    }, 600)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [])

  const borderClassMap: Record<BorderType, string> = {
    top: "border-t",
    right: "border-r",
    bottom: "border-b",
    left: "border-l",
    x: "border-x",
    y: "border-y",
  }

  return (
    <motion.div
      data-slot="border-flash"
      aria-hidden="true"
      className={cn(
        "border-border",
        borderClassMap[border],
        className,
        dashed && "border-dashed",
        flash && (removeFlash ? "border-flash-remove" : "border-flash")
      )}
      {...getBorderAnim(borderAnim)}
    />
  )
}

export { BorderFlash }
