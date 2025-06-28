"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

type Orientation = "top" | "right" | "bottom" | "left" | "x" | "y";
type Animation = "bottom" | "top" | "left" | "right";

interface BorderFlashProps {
  border: Orientation;
  Animation: Animation;
  dashed?: boolean;
  className?: string;
}

const getBorderAnim = (side: Animation) => {
  const base = { duration: 1, ease: "easeOut" as const };

  switch (side) {
    case "bottom":
      return {
        initial: { scaleY: 0 },
        animate: { scaleY: 1 },
        transition: { ...base },
        style: { transformOrigin: "bottom" as const },
      };
    case "top":
      return {
        initial: { scaleY: 0 },
        animate: { scaleY: 1 },
        transition: { ...base, delay: 0.1 },
        style: { transformOrigin: "top" as const },
      };
    case "left":
      return {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { ...base, delay: 0.2 },
        style: { transformOrigin: "left" as const },
      };
    case "right":
      return {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { ...base, delay: 0.3 },
        style: { transformOrigin: "right" as const },
      };
  }
};

const BorderFlash = ({
  border,
  Animation,
  dashed = false,
  className,
}: BorderFlashProps) => {
  const [flash, setFlash] = useState(false);
  const [removeFlash, setRemoveFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    setRemoveFlash(false);

    const timeout1 = setTimeout(() => setRemoveFlash(true), 250);
    const timeout2 = setTimeout(() => {
      setFlash(false);
      setRemoveFlash(false);
    }, 600);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const borderClassMap: Record<Orientation, string> = {
    top: "border-t",
    right: "border-r",
    bottom: "border-b",
    left: "border-l",
    x: "border-x",
    y: "border-y",
  };

  return (
    <motion.div
      data-slot="border-flash"
      aria-hidden="true"
      className={cn(
        "transition-[border-color,opacity]",
        "duration-100 ease-in-out",
        borderClassMap[border],
        "border-border",
        className,
        dashed && "border-dashed",
        flash &&
          (removeFlash
            ? [
                "opacity-0",
                "transition-[border-color,opacity]",
                "duration-600 ease-in-out",
                "border-[color:var(--border)]",
              ]
            : [
                "opacity-100",
                "transition-[border-color,opacity]",
                "duration-100 ease-in-out",
                "border-[oklch(0_0_0)]",
                "dark:border-[oklch(1_0_0)]",
              ])
      )}
      {...getBorderAnim(Animation)}
    />
  );
};

export { BorderFlash };
