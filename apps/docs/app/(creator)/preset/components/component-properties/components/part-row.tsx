"use client";

import * as React from "react";

import { cn } from "@rlz/ui/lib/cn";

import { Code } from "lucide-react";

import { ClassesField } from "../../classes-field";

/**
 * One box of the component - itself, or a part it exports - with the classes it was
 * authored with. Collapsed by default: a component can ship a dozen parts, and the
 * panel stays readable when only what is being tuned is open.
 */
export function PartRow({
  part,
  label,
  override,
  onClasses,
}: {
  part: { slot: string; classes: string };
  label: string;
  override?: string;
  onClasses: (classes: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const edited = override !== undefined;

  return (
    <div
      className={cn(
        "rounded border border-border/60 transition-colors",
        open && "bg-accent/30"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        title={part.slot}
        className="flex w-full items-center gap-2 px-1.5 py-1 text-left"
      >
        <span
          className={cn(
            "flex-1 truncate text-xs",
            edited ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {edited ? "Custom" : part.classes ? "Built-in" : "Empty"}
        </span>
        <Code className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="px-1.5 pb-2">
          <ClassesField
            target={{ subject: label, builtIn: part.classes, override }}
            onClasses={onClasses}
          />
        </div>
      )}
    </div>
  );
}
