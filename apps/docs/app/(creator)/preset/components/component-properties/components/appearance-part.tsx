"use client";

import type { AppearanceField as AppearanceFieldModel } from "../../../lib/appearance";

import { cn } from "@rlz/ui/lib/cn";

import { AppearanceField } from "./appearance-field";

/**
 * One box's Appearance: a field for each padding/gap/rounded family its classes
 * carry - `rounded-t-lg` and `rounded-b-lg` are two families, so two fields. The
 * box is named like the Classes editor names it, and each field edits only its own
 * utility family, leaving the rest of the class string untouched.
 */
export function AppearancePart({
  slot,
  label,
  fields,
  edited,
  onValue,
}: {
  slot: string;
  label: string;
  fields: AppearanceFieldModel[];
  edited: boolean;
  onValue: (prefix: string, value: string) => void;
}) {
  return (
    <div>
      <div title={slot} className="px-1.5 pt-1">
        <span
          className={cn(
            "block truncate text-xs",
            edited ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-1.5 py-1.5">
        {fields.map((field) => (
          <AppearanceField
            key={field.prefix}
            field={field}
            onValue={(value) => onValue(field.prefix, value)}
          />
        ))}
      </div>
    </div>
  );
}
