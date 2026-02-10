import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Orientation = "top" | "right" | "bottom" | "left" | "x" | "y";
type Animation = "bottom" | "top" | "left" | "right";

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

interface BorderFlashProps {
  border: Orientation;
  Animation: Animation;
  dashed?: boolean;
  className?: string;
}

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

interface BorderFlashBoxProps {
  children: React.ReactNode;
  className?: string;
}

const BorderFlashBox: React.FC<BorderFlashBoxProps> = ({
  children,
  className,
}) => {
  return (
    <div
      data-slot="border-flash-box"
      className={cn("relative w-full p-6", className)}
    >
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 mx-px">
        <BorderFlash border="top" Animation="left" />
      </div>

      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0 mx-px">
        <BorderFlash border="bottom" Animation="right" />
      </div>

      {/* Left border */}
      <div className="absolute inset-y-0 left-0 h-full">
        <BorderFlash border="left" Animation="top" className="h-full" />
      </div>

      {/* Right border */}
      <div className="absolute inset-y-0 right-0 h-full">
        <BorderFlash border="right" Animation="bottom" className="h-full" />
      </div>

      {/* Content */}
      <div className="relative bg-background text-left">{children}</div>
    </div>
  );
};

const BorderFlashBoxContent = ({
  children,
  className,
}: BorderFlashBoxProps) => {
  return (
    <div
      data-slot="border-flash-box-content"
      className={cn("flex items-center justify-center p-2", className)}
    >
      {children}
    </div>
  );
};

const BorderFlashExports = Object.assign(BorderFlash, {
  Box: BorderFlashBox,
  BoxContent: BorderFlashBoxContent,
});

export {
  BorderFlashExports as BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
};
