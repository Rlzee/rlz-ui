"use client";

import { Input } from "@rlz/ui/components/ui/input";
import { cn } from "@rlz/ui/lib/cn";

import { TailwindColorsSelector } from "@/components/tailwind-colors-selector";

/**
 * One color the Creator can set: the swatch it currently reads as, a free text
 * value, and the Tailwind picker that offers named colors for it. The Colors panel
 * repeats this trio per scheme and the Shadows form uses it for the box's own
 * color, so it lives here once instead of being copied into both. The value is a
 * single color string, in and out.
 */
export function ColorField({
  value,
  onChange,
  label,
  labelClassName,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  /** the name shown in the fixed left column; omit it to drop the column */
  label?: React.ReactNode;
  /** overrides the label column's default width and size */
  labelClassName?: string;
  ariaLabel?: string;
  /** extra classes on the row, e.g. the padding a section adds */
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label !== undefined && (
        <span
          className={cn(
            "w-16 shrink-0 text-xs text-muted-foreground",
            labelClassName
          )}
        >
          {label}
        </span>
      )}

      <div
        className="size-5 shrink-0 rounded-sm border"
        style={{ background: value }}
      />

      <Input
        value={value}
        spellCheck={false}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 min-w-0 flex-1 truncate font-mono text-xs"
      />

      <TailwindColorsSelector value={value} onChange={onChange} />
    </div>
  );
}
