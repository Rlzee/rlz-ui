"use client";

import * as React from "react";
import { useSetAtom } from "jotai";
import { Button } from "@rlz/ui/components/ui/button";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Pencil } from "lucide-react";
import { classEditorRequestAtom } from "../../state/class-editor-state";
import { animationStudioOpenAtom } from "../../state/animation-panel-state";

export type ClassesFieldTarget = {
  subject: string;
  part?: string;
  builtIn: string;
  override?: string;
};

let nextRequestId = 0;

/** Compact read-only class preview; editing happens in the Playground. */
export function ClassesField({
  target,
  onClasses,
  onRemove,
  autoFocus,
}: {
  target: ClassesFieldTarget;
  onClasses: (classes: string) => void;
  onRemove?: () => void;
  autoFocus?: boolean;
}) {
  const { subject, part, builtIn, override } = target;
  const setRequest = useSetAtom(classEditorRequestAtom);
  const setStudioOpen = useSetAtom(animationStudioOpenAtom);
  const effective = override ?? builtIn;
  const overridden = override !== undefined && override !== builtIn;
  const status = builtIn
    ? overridden
      ? "Custom classes"
      : "Built-in classes"
    : effective
    ? "Utility of the preset's own"
    : "Nothing applied yet";
  const label = part ? `${subject} / ${part}` : subject;

  return (
    <div className="flex flex-col gap-1.5">
      {part && (
        <span className="text-xs font-medium text-muted-foreground">
          {part}
        </span>
      )}
      <InputGroup className="group relative !h-14 min-w-0 overflow-hidden border-border/60 bg-transparent p-0 shadow-none transition-colors hover:border-border hover:bg-accent/20">
        <pre
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap break-all px-2.5 py-1.5 font-mono text-xs leading-5 text-foreground/75 [mask-image:linear-gradient(to_bottom,black_10%,transparent_100%)] transition-opacity group-hover:opacity-35 group-focus-within:opacity-35"
        >
          {effective || `Classes to @apply in ${part ?? subject}`}
        </pre>
        <Button
          type="button"
          variant="ghost"
          autoFocus={autoFocus}
          aria-label={`Edit classes of ${label}`}
          title={`Edit classes of ${label}`}
          onClick={() => {
            setStudioOpen(false);
            setRequest({
              id: ++nextRequestId,
              label,
              builtIn,
              initial: effective,
              status,
              onApply: onClasses,
            });
          }}
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-[inherit] bg-transparent text-xs font-medium text-foreground/80 opacity-0 transition-opacity hover:bg-background/30 hover:opacity-100 focus-visible:bg-background/30 focus-visible:opacity-100 max-md:opacity-100"
        >
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/95 px-2.5 py-1 shadow-sm">
            <Pencil className="size-3.5" /> Edit classes
          </span>
        </Button>
      </InputGroup>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">{status}</span>
        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-[11px]"
            onClick={onRemove}
          >
            Remove
          </Button>
        ) : overridden ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-[11px]"
            onClick={() => onClasses(builtIn)}
          >
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
