"use client";

import * as React from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Textarea } from "@rlz/ui/components/ui/textarea";

/**
 * One class editor, shared by the two ways the Creator restyles a component: a
 * variant value (the classes one value of an axis draws) and a part of the
 * component (the classes one of its boxes was authored with). Both are the same
 * exchange - what the design system ships in, what the Creator wants out.
 *
 * `builtIn` is what the component really carries, `override` what was written over
 * it. Writing the built-in classes back clears the override, so a preset only ever
 * stores a real difference.
 */
export type ClassesFieldTarget = {
  /** what the field edits, for its label: an axis value or a part name */
  subject: string;
  /** the box being styled, when a compound part is named */
  part?: string;
  builtIn: string;
  override?: string;
};

export function ClassesField({
  target,
  onClasses,
}: {
  target: ClassesFieldTarget;
  onClasses: (classes: string) => void;
}) {
  const { subject, part, builtIn, override } = target;
  // Classes in effect: the Creator's own, else what the design system ships.
  const effective = override ?? builtIn;
  const overridden = override !== undefined;

  const [css, setCss] = React.useState(effective);

  // Keep the field in sync with the stored classes when they change elsewhere
  // (Reset, JSON import, another part of the same value).
  React.useEffect(() => setCss(effective), [effective]);

  return (
    <div className="flex flex-col gap-1.5">
      {part && (
        <span className="text-xs font-medium text-muted-foreground">{part}</span>
      )}

      <Textarea
        value={css}
        rows={2}
        aria-label={
          part ? `Classes of ${subject} (${part})` : `Classes of ${subject}`
        }
        placeholder={builtIn || `No classes yet - define ${subject}`}
        onChange={(event) => setCss(event.target.value)}
        onBlur={() => onClasses(css)}
        onKeyDown={(event) => {
          // Enter writes a newline here, so apply with Ctrl/Cmd+Enter.
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            setCss(effective);
            event.currentTarget.blur();
          }
        }}
        className="font-mono text-xs"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {overridden
            ? "Custom classes"
            : builtIn
              ? "Built-in classes"
              : "No classes yet"}
        </span>
        {overridden && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[11px]"
            onClick={() => onClasses(builtIn)}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
