"use client";

import * as React from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Textarea } from "@rlz/ui/components/ui/textarea";

/**
 * One class editor, shared by the two ways the Creator restyles a design system: a
 * variant value or a part of a component (the classes one box was authored with), and
 * a shared utility class (the recipe several components borrow). All three are the same
 * exchange - what ships in, what the Creator wants out.
 *
 * `builtIn` is what is really carried there, `override` what was written over it, and a
 * field only reads as rewritten once the two differ - a preset may store a class at the
 * very classes it ships, and say so honestly. A field with nothing to fall back to, a
 * utility the preset declared itself, cannot be reset: `onRemove` replaces that button.
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
  onRemove,
  autoFocus,
}: {
  target: ClassesFieldTarget;
  onClasses: (classes: string) => void;
  onRemove?: () => void;
  autoFocus?: boolean;
}) {
  const { subject, part, builtIn, override } = target;
  // Classes in effect: the Creator's own, else what the design system ships. What is
  // stored only counts as a rewrite once it reads differently.
  const effective = override ?? builtIn;
  const overridden = override !== undefined && override !== builtIn;

  // What the field holds, in the panel's own words: a rewrite of a shared class, a
  // class of the preset's own, or the design system's untouched definition.
  const status = builtIn
    ? overridden
      ? "Custom classes"
      : "Built-in classes"
    : effective
      ? "Utility of the preset's own"
      : "Nothing applied yet";

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
        autoFocus={autoFocus}
        aria-label={
          part ? `Classes of ${subject} (${part})` : `Classes of ${subject}`
        }
        placeholder={builtIn || `Classes to @apply in ${part ?? subject}`}
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
        <span className="text-[11px] text-muted-foreground">{status}</span>

        {onRemove ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-[11px]"
            onClick={onRemove}
          >
            Remove
          </Button>
        ) : (
          overridden && (
            <Button
              variant="ghost"
              size="xs"
              className="text-[11px]"
              onClick={() => onClasses(builtIn)}
            >
              Reset
            </Button>
          )
        )}
      </div>
    </div>
  );
}
