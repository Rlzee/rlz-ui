"use client";

import * as React from "react";

import { CommandDialogTrigger } from "@rlz/ui/components/ui/command";
import { commandHandle } from "./command-menu";

import { Button } from "@rlz/ui/components/ui/button";
import { cn } from "@rlz/ui/lib/cn";

type CommandInputProps = {
  className?: string;
  placeholder?: string;
  shortcutKey?: string;
  fullWidth?: boolean;
};

export function CommandInput({
  className,
  placeholder = "Search documentation...",
  fullWidth = false,
}: CommandInputProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        commandHandle.open(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <CommandDialogTrigger
      handle={commandHandle}
      render={
        <Button
          data-slot="button-search"
          size="sm"
          className={cn(
            "flex justify-between items-center gap-2 px-3 py-1.5 font-normal bg-accent/60 border hover:bg-accent",
            fullWidth
              ? "w-full"
              : "w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] max-w-full truncate",
            className
          )}
          aria-label="Open search"
        />
      }
    >
      <span className="truncate text-muted-foreground">{placeholder}</span>
    </CommandDialogTrigger>
  );
}
