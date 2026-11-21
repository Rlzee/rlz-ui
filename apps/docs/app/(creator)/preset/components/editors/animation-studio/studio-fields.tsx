"use client";

import { useId } from "react";
import { Field } from "@rlz/ui/components/ui/field";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Select } from "@rlz/ui/components/ui/select";

export const EASING_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in out" },
];

export function NumericInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <Field className="min-w-0">
      <Field.Label className="text-xs">{label}</Field.Label>
      <NumberField
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => {
          if (next !== null && Number.isFinite(next)) onChange(next);
        }}
        className="w-full"
      >
        <NumberField.Group className="h-8 w-full overflow-hidden rounded-md">
          <NumberField.Decrement className="h-8 shrink-0 px-2 [&_svg]:size-3" />
          <NumberField.Input
            aria-label={label}
            className="h-8 min-w-0 w-full flex-1 text-center text-xs tabular-nums"
          />
          <NumberField.Increment className="h-8 shrink-0 px-2 [&_svg]:size-3" />
        </NumberField.Group>
      </NumberField>
    </Field>
  );
}

export function StudioSelect({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <Field className="min-w-0">
      <Field.Label id={id} className="text-xs">
        {label}
      </Field.Label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
      >
        <Select.Trigger
          size="xs"
          aria-labelledby={id}
          className="h-8 w-full min-w-0 text-xs"
        >
          <Select.Value>
            {options.find((option) => option.value === value)?.label ?? value}
          </Select.Value>
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup
          positionerProps={{
            alignItemWithTrigger: true,
            align: "start",
            className: "z-[60]",
          }}
        >
          <Select.List>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIndicator />
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select>
    </Field>
  );
}
