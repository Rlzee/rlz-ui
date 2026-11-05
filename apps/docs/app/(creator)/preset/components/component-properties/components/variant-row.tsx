"use client";

import * as React from "react";

import type { VariantOption } from "../../../lib/component-edits";
import type { VariantClassSection } from "../../../lib/variant-classes";

import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { cn } from "@rlz/ui/lib/cn";

import { Code, X } from "lucide-react";

import { ClassesField } from "../../classes-field";

/**
 * Row = inline-editable name + one class editor per styled part + delete.
 * Clicking anywhere on the row line applies the value, so the highlighted row is
 * the one in the preview. Both fields commit on blur and cancel on Escape, so a
 * half-typed value never lands in the preset.
 */
export function VariantRow({
  option,
  active,
  removable,
  open,
  sections,
  onApply,
  onToggleOpen,
  onRename,
  onRemove,
  onClasses,
}: {
  option: VariantOption;
  active: boolean;
  removable: boolean;
  open: boolean;
  sections: VariantClassSection[];
  onApply: () => void;
  onToggleOpen: () => void;
  onRename: (from: string, to: string) => boolean;
  onRemove: () => void;
  onClasses: (
    value: string,
    classes: string,
    section: VariantClassSection
  ) => void;
}) {
  const { value } = option;
  // The icon is lit as soon as any part of the value was restyled.
  const overridden = sections.some((section) => section.override !== undefined);

  const [text, setText] = React.useState(value);

  // Keep the field in sync with the stored value when it changes elsewhere
  // (Reset, JSON import, another row).
  React.useEffect(() => setText(value), [value]);

  function commitName() {
    const next = text.trim();
    if (!onRename(value, next)) setText(value);
  }

  return (
    <div
      className={cn(
        "rounded transition-colors",
        active ? "bg-accent/70" : "hover:bg-accent/40"
      )}
    >
      <div
        title={active ? "Applied value" : "Click to apply"}
        onClick={onApply}
        className="flex cursor-pointer items-center gap-0.5 pr-1.5 pl-3 py-1"
      >
        <Input
          value={text}
          unstyled
          aria-label={`Rename ${value}`}
          onChange={(event) => setText(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // Nothing to rename on this press, so Enter confirms the row and
              // applies it; a pending rename is left to the blur commit.
              if (text.trim() === value) onApply();
              event.currentTarget.blur();
            }
            if (event.key === "Escape") {
              setText(value);
              event.currentTarget.blur();
            }
          }}
          className="truncate font-mono text-xs"
        />

        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Classes of ${value}`}
          aria-expanded={open}
          // Opening the editor is not a way to apply the value.
          onClick={(event) => {
            event.stopPropagation();
            onToggleOpen();
          }}
          className={cn(
            "shrink-0",
            overridden
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Code />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${value}`}
          disabled={!removable}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X />
        </Button>
      </div>

      {open && (
        <div className="flex flex-col gap-2.5 px-1.5 pb-2">
          {sections.map((section) => (
            <VariantClassField
              key={section.part ?? "self"}
              value={value}
              section={section}
              onClasses={onClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The classes one section of a value carries: a part of a compound component, or
 * the whole component when the axis has no parts. Editing it stores an override on
 * that value; writing the built-in classes back removes it.
 */
function VariantClassField({
  value,
  section,
  onClasses,
}: {
  value: string;
  section: VariantClassSection;
  onClasses: (
    value: string,
    classes: string,
    section: VariantClassSection
  ) => void;
}) {
  return (
    <ClassesField
      target={{
        subject: value,
        part: section.part,
        builtIn: section.builtIn,
        override: section.override,
      }}
      onClasses={(classes) => onClasses(value, classes, section)}
    />
  );
}
