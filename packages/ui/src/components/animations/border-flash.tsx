"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "cn";

type Orientation = "top" | "right" | "bottom" | "left" | "x" | "y" | "all";
type Animation = "bottom" | "top" | "left" | "right" | "none";

const getBorderAnim = (side: Animation) => {
  const base = { duration: 1, ease: "easeOut" as const };

  switch (side) {
    case "none":
      return {};
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

interface BorderFlashProps {
  border: Orientation;
  animation: Animation;
  dashed?: boolean;
  className?: string;
}

const BorderFlash = ({
  border,
  animation,
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
    all: "border",
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
                "border-border",
              ]
            : [
                "opacity-100",
                "transition-[border-color,opacity]",
                "duration-100 ease-in-out",
                "border-[oklch(0_0_0)]",
                "dark:border-[oklch(1_0_0)]",
              ])
      )}
      {...getBorderAnim(animation)}
    />
  );
};

interface BorderFlashBoxProps {
  children?: React.ReactNode;
  className?: string;
}

/** Reveal four fixed segments so rounded corners never stretch or slide. */
const FRAME_SEGMENTS = [
  {
    clip: "polygon(0% 0%, 100% 0%, 50% 50%)",
    initial: "inset(0% 100% 0% 0%)",
    delay: 0.2,
  },
  {
    clip: "polygon(100% 0%, 100% 100%, 50% 50%)",
    initial: "inset(100% 0% 0% 0%)",
    delay: 0,
  },
  {
    clip: "polygon(100% 100%, 0% 100%, 50% 50%)",
    initial: "inset(0% 0% 0% 100%)",
    delay: 0.3,
  },
  {
    clip: "polygon(0% 100%, 0% 0%, 50% 50%)",
    initial: "inset(0% 0% 100% 0%)",
    delay: 0.1,
  },
] as const;

const BorderFlashFrame = ({ className }: { className?: string }) => (
  <div
    data-slot="border-flash-frame"
    aria-hidden="true"
    className={cn("pointer-events-none absolute inset-0 rounded-md", className)}
  >
    {FRAME_SEGMENTS.map((segment) => (
      <div
        key={segment.clip}
        className="absolute inset-0 rounded-[inherit]"
        style={{ clipPath: segment.clip }}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          initial={{ clipPath: segment.initial }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, ease: "easeOut", delay: segment.delay }}
        >
          <BorderFlash
            border="all"
            animation="none"
            className="absolute inset-0 rounded-[inherit]"
          />
        </motion.div>
      </div>
    ))}
  </div>
);

const BorderFlashBox: React.FC<BorderFlashBoxProps> = ({
  children,
  className,
}) => {
  return (
    <div
      data-slot="border-flash-box"
      className={cn("relative w-full p-6 rounded-md", className)}
    >
      <BorderFlashFrame className="z-10 rounded-[inherit]" />

      {/* Content */}
      <div className="relative bg-background">{children}</div>
    </div>
  );
};

const BorderFlashExports = Object.assign(BorderFlash, {
  Frame: BorderFlashFrame,
  Box: BorderFlashBox,
});

export { BorderFlashExports as BorderFlash, BorderFlashFrame, BorderFlashBox };
