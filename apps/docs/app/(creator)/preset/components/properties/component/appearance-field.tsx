"use client";

import * as React from "react";

import {
  isRounded,
  type AppearanceField as AppearanceFieldModel,
} from "../../../lib/appearance";
import { Input } from "@rlz/ui/components/ui/input";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Select } from "@rlz/ui/components/ui/select";

const RADIUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "full", label: "Full" },
] as const;

function numericValue(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function AppearanceField({
  field,
  onValue,
}: {
  field: AppearanceFieldModel;
  onValue: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {field.label}
      </span>
      <div className="min-w-0 flex-1">
        {isRounded(field.prefix) ? (
          <RadiusField
            value={field.value}
            label={field.label}
            onCommit={onValue}
          />
        ) : numericValue(field.value) !== null ? (
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
    </div>
  );
}

function RadiusField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  // An unsuffixed `rounded` is displayed as its own state. Never write an
  // empty string back: the existing setter interprets that as removal.
  const isPreset = RADIUS_OPTIONS.some((option) => option.value === value);
  const selection = value === "" ? "__bare" : isPreset ? value : "__custom";
  const [custom, setCustom] = React.useState(value);
  const [customMode, setCustomMode] = React.useState(false);
  const cancelBlur = React.useRef(false);

  React.useEffect(() => {
    setCustom(value);
    setCustomMode(false);
  }, [value]);

  const selected = customMode ? "__custom" : selection;

  function commitCustom() {
    if (cancelBlur.current) {
      cancelBlur.current = false;
      return;
    }
    const next = custom.trim();
    if (next && next !== value) onCommit(next);
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Select
        value={selected}
        onValueChange={(next) => {
          if (typeof next !== "string") return;
          if (next === "__custom") {
            setCustomMode(true);
            setCustom(selection === "__custom" ? value : "");
          } else if (next === "__bare") {
            // Read-only representation of the bare `rounded` utility.
            setCustomMode(false);
          } else {
            setCustomMode(false);
            if (next !== value) onCommit(next);
          }
        }}
      >
        <Select.Trigger
          size="xs"
          className="h-7 min-w-0 w-full text-xs"
          aria-label={label}
        >
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup
          positionerProps={{ alignItemWithTrigger: true, align: "start" }}
        >
          <Select.List>
            {value === "" && (
              <Select.Item value="__bare">
                <Select.ItemIndicator />
                <Select.ItemText>Default (rounded)</Select.ItemText>
              </Select.Item>
            )}
            {RADIUS_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIndicator />
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
            <Select.Item value="__custom">
              <Select.ItemIndicator />
              <Select.ItemText>Custom…</Select.ItemText>
            </Select.Item>
          </Select.List>
        </Select.Popup>
      </Select>
      {selected === "__custom" && (
        <Input
          key={value}
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          onBlur={commitCustom}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") {
              cancelBlur.current = true;
              setCustom(value);
              setCustomMode(false);
              event.currentTarget.blur();
            }
          }}
          aria-label={`${label} custom value`}
          placeholder="[0.6rem] or (--radius)"
          className="h-7 w-full font-mono text-xs"
        />
      )}
    </div>
  );
}

function NumberScaleField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  return (
    <NumberField
      key={value}
      min={0}
      step={0.5}
      defaultValue={numericValue(value) ?? undefined}
      onValueCommitted={(next) => {
        const nextValue =
          next === null || Number.isNaN(next) ? "" : String(next);
        if (nextValue !== value) onCommit(nextValue);
      }}
    >
      <NumberField.Group className="h-7">
        <NumberField.Decrement className="h-7 [&_svg]:size-3.5" />
        <NumberField.Input aria-label={label} className="h-7 w-full text-xs" />
        <NumberField.Increment className="h-7 [&_svg]:size-3.5" />
      </NumberField.Group>
    </NumberField>
  );
}

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
  const cancelBlur = React.useRef(false);
  React.useEffect(() => setText(value), [value]);

  return (
    <Input
      value={text}
      aria-label={label}
      placeholder="Custom Tailwind value"
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        if (cancelBlur.current) {
          cancelBlur.current = false;
          return;
        }
        if (text !== value) onCommit(text);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          cancelBlur.current = true;
          setText(value);
          event.currentTarget.blur();
        }
      }}
      className="h-7 w-full min-w-0 font-mono text-xs"
    />
  );
}
