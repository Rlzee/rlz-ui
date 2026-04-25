"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import { cn } from "@rlz/ui/lib/cn";

type CommandInputProps = {
  className?: string;
  placeholder?: string;
  shortcutKey?: string;
  fullWidth?: boolean;
};

export function CommandInput({
  className,
  placeholder = "Search docs...",
  shortcutKey = "⌘k",
  fullWidth = false,
}: CommandInputProps) {
  return (
    <Button
      data-slot="button-search"
      variant="secondary"
      size="sm"
      className={cn(
        "flex justify-between items-center gap-2 px-3 py-1.5 font-normal",
        fullWidth
          ? "w-full"
          : "w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] max-w-full truncate",
        className
      )}
      aria-label="Open search"
    >
      <span className="truncate text-muted-foreground">{placeholder}</span>
      <Kbd>{shortcutKey}</Kbd>
    </Button>
  );
}
