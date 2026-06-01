"use client";

import * as React from "react";

import { CommandDialogTrigger } from "@rlz/ui/components/ui/command";
import { commandHandle } from "./command-menu";

import { Button } from "@rlz/ui/components/ui/button";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import { Search } from "lucide-react";
import { cn } from "@rlz/ui/lib/cn";

export function CommandInput({ className }: { className: string }) {
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
          className={cn("bg-accent/60 border hover:bg-accent", className)}
          aria-label="Open search"
        />
      }
    >
      <Search className="text-muted" />
      <Kbd.Group>
        <Kbd className="dark:bg-muted/7 bg-secondary dark:border-0">Ctrl</Kbd>
        <Kbd className="dark:bg-muted/7 bg-secondary dark:border-0">K</Kbd>
      </Kbd.Group>
    </CommandDialogTrigger>
  );
}
