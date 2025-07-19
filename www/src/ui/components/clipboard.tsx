"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Tooltip } from "./tooltip";

type ClipboardSize = "sm" | "md" | "lg";

const sizeClasses: Record<ClipboardSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

interface ClipboardProps {
  text: string;
  className?: string;
  size?: ClipboardSize;
  position?: "absolute" | "relative";
  showTooltip?: boolean;
  successDuration?: number;
  onCopy?: (text: string) => void;
  children?: React.ReactNode;
}

const Clipboard = ({
  text,
  className,
  size = "sm",
  position = "relative",
  showTooltip = true,
  successDuration = 1500,
  onCopy,
  children,
}: ClipboardProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);
      setTimeout(() => setCopied(false), successDuration);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const button = (
    <button
      onClick={handleCopy}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50",
        position === "absolute" && "absolute top-2 right-2 z-10",
        className
      )}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      disabled={copied}
    >
      {children || (
        <>
          <div
            className={cn(
              "transition-all",
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          >
            <CheckIcon
              className="stroke-emerald-500"
              size={size}
              aria-hidden="true"
            />
          </div>
          <div
            className={cn(
              "absolute transition-all",
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <CopyIcon className={sizeClasses[size]} aria-hidden="true" />
          </div>
        </>
      )}
    </button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip.Root openDelay={0} closeDelay={500}>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content className="px-2 py-1 text-xs">
        {copied ? "Copied!" : "Copy to clipboard"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export { Clipboard };
export type { ClipboardProps };
