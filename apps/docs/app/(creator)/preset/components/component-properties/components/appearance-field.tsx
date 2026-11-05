"use client";

import * as React from "react";

import { isRounded, type AppearanceField } from "../../../lib/appearance";

import { Input } from "@rlz/ui/components/ui/input";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { cn } from "@rlz/ui/lib/cn";

// The radius scale the Creator offers as a segmented toggle. Tailwind names a
// corner by these steps, so a click writes them onto the field's own utility
// (`rounded-lg`, `rounded-t-lg`) and the box's current step stays lit.
const ROUNDED_OPTIONS = ["xs", "sm", "md", "lg", "xl", "full"];

// A gap/padding scale reads back as a number (`6`, `0.5`), so it is edited with a
// NumberField. Anything that is not a plain number - an arbitrary `[0.6rem]`, the
// `px` keyword - falls back to a free text field, so a value is never lost.
function scaleNumber(value: string): number | null {
  if (value.trim() === "") return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function isNumericScale(value: string): boolean {
  return value.trim() === "" || scaleNumber(value) !== null;
}

// The toggle only speaks the curated steps, so an off-scale value (`none`, `2xl`,
// an arbitrary `(--radius)`) reads back in the free text field instead of sitting
// behind an unlit control.
function isRoundedScale(value: string): boolean {
  return value.trim() === "" || ROUNDED_OPTIONS.includes(value.trim());
}

/**
 * One Appearance field: the rounded families pick their step from a segmented
 * toggle, gap and padding use a NumberField when their value is a plain number,
 * and any other value (an arbitrary `[0.6rem]`, the `px` keyword, an off-scale
 * `2xl`) falls back to a free text field. The label sits in a fixed column so
 * controls line up.
 */
export function AppearanceField({
  field,
  onValue,
}: {
  field: AppearanceField;
  onValue: (value: string) => void;
}) {
  const rounded = isRounded(field.prefix) && isRoundedScale(field.value);

  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {field.label}
      </span>

      {rounded ? (
        <RoundedOptions
          value={field.value}
          label={field.label}
          onChange={onValue}
        />
      ) : isNumericScale(field.value) ? (
        <NumberScaleField
          value={field.value}
          label={field.label}
          onCommit={onValue}
        />
      ) : (
        <ScaleField
          value={field.value}
          label={field.label}
          onCommit={onValue}
        />
      )}
    </div>
  );
}

/**
 * The radius scale as a single-select Toggle group: its outline variant draws the
 * joined, rounded-end segmented bar, the current step stays pressed, and picking
 * one applies it at once. Every rounded family shares it, so the group is labelled
 * by the field that owns it (Rounded, Rounded Top, Rounded Bottom Left...). The
 * group reports a wide value (a single string here, since only one step is
 * selected), so it is narrowed before it is written.
 */
function RoundedOptions({
  value,
  label,
  onChange,
}: {
  value: string;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <Toggle.Group
      variant="outline"
      size="xs"
      value={value ? [value] : []}
      aria-label={label}
      className="flex-1"
      onValueChange={(next) => {
        // A single-select group keeps the whole pressed set, so only one step is
        // ever in it; read that one back as the rounded value.
        const picked = next[0];

        if (typeof picked === "string") onChange(picked);
      }}
    >
      {ROUNDED_OPTIONS.map((option, index) => (
        <React.Fragment key={option}>
          <Toggle value={option} className="flex-1 font-mono">
            {option}
          </Toggle>

          {index < ROUNDED_OPTIONS.length - 1 && <Toggle.GroupSeparator />}
        </React.Fragment>
      ))}
    </Toggle.Group>
  );
}

/**
 * A numeric gap/padding scale, edited with the package NumberField: the steppers
 * and typing both commit on blur, and an emptied field drops the utility. It is
 * keyed by the stored value so a Reset, a sibling edit or the Classes field
 * re-seeds this otherwise uncontrolled input.
 */
function NumberScaleField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const initial = scaleNumber(value);

  return (
    <NumberField
      key={value}
      min={0}
      step={0.5}
      defaultValue={initial ?? undefined}
      onValueCommitted={(next) =>
        onCommit(next === null || Number.isNaN(next) ? "" : String(next))
      }
    >
      <NumberField.Group className="h-7">
        <NumberField.Decrement className="h-7 [&_svg]:size-3.5" />
        <NumberField.Input aria-label={label} className="h-7 w-full text-xs" />
        <NumberField.Increment className="h-7 [&_svg]:size-3.5" />
      </NumberField.Group>
    </NumberField>
  );
}

/**
 * A free scale value. It commits on blur or Enter and cancels on Escape, so a
 * half-typed value never lands in the preset; an unchanged blur writes nothing,
 * which keeps a bare utility from being dropped by focusing it and tabbing away.
 */
function ScaleField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const [text, setText] = React.useState(value);

  // Keep the field in sync when the stored value changes elsewhere (Reset, a
  // sibling field of the same box, the Classes editor).
  React.useEffect(() => setText(value), [value]);

  return (
    <Input
      value={text}
      unstyled
      aria-label={label}
      placeholder="—"
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        if (text !== value) onCommit(text);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          setText(value);
          event.currentTarget.blur();
        }
      }}
      className="h-7 flex-1 truncate font-mono text-xs"
    />
  );
}
