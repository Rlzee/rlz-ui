"use client";

import * as React from "react";

import type { AppearanceField as AppearanceFieldModel } from "../../../lib/appearance";
import { Input } from "@rlz/ui/components/ui/input";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Select } from "@rlz/ui/components/ui/select";
import {
  appearanceProperty,
  numericAppearanceValue,
} from "../../../lib/appearance-options";

export function AppearanceField({
  field,
  onValue,
}: {
  field: AppearanceFieldModel;
  onValue: (value: string) => void;
}) {
  const property = appearanceProperty(field.prefix);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {field.label}
      </span>
      <div className="min-w-0 flex-1">
        {property?.options ? (
          <PresetField
            value={field.value}
            label={field.label}
            options={property.options.map((value) => ({ value, label: value }))}
            placeholder={property.placeholder}
            allowCustom={property.allowCustom}
            numeric={property.numeric}
            allowNegative={property.allowNegative}
            bareLabel={`Default (${field.prefix})`}
            onCommit={onValue}
          />
        ) : numericAppearanceValue(field.value, property?.allowNegative) !==
          null ? (
          <NumberScaleField
            value={field.value}
            label={field.label}
            allowNegative={property?.allowNegative}
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

function PresetField({
  value,
  label,
  onCommit,
  options,
  placeholder = "Custom Tailwind value",
  allowCustom = true,
  bareLabel,
  numeric = false,
  allowNegative = false,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  allowCustom?: boolean;
  bareLabel: string;
  numeric?: boolean;
  allowNegative?: boolean;
}) {
  // An unsuffixed `rounded` is displayed as its own state. Never write an
  // empty string back: the existing setter interprets that as removal.
  const isPreset = options.some((option) => option.value === value);
  const selection =
    value === ""
      ? "__bare"
      : isPreset
      ? value
      : numeric && numericAppearanceValue(value, allowNegative) !== null
      ? "__number"
      : "__custom";
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
          if (next === "__number") {
            setCustomMode(false);
            if (numericAppearanceValue(value, allowNegative) === null)
              onCommit("0");
          } else if (next === "__custom") {
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
          positionerProps={{
            alignItemWithTrigger: true,
            align: "start",
            className: "z-60",
          }}
        >
          <Select.List>
            {value === "" && (
              <Select.Item value="__bare">
                <Select.ItemIndicator />
                <Select.ItemText>{bareLabel}</Select.ItemText>
              </Select.Item>
            )}
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIndicator />
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
            {numeric && (
              <Select.Item value="__number">
                <Select.ItemIndicator />
                <Select.ItemText>Number…</Select.ItemText>
              </Select.Item>
            )}
            {allowCustom && (
              <Select.Item value="__custom">
                <Select.ItemIndicator />
                <Select.ItemText>Custom…</Select.ItemText>
              </Select.Item>
            )}
          </Select.List>
        </Select.Popup>
      </Select>
      {selected === "__number" && (
        <NumberScaleField
          value={value}
          label={label}
          allowNegative={allowNegative}
          onCommit={onCommit}
        />
      )}
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
          placeholder={placeholder}
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
  allowNegative = false,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
  allowNegative?: boolean;
}) {
  return (
    <NumberField
      key={value}
      min={allowNegative ? undefined : 0}
      step={0.5}
      defaultValue={numericAppearanceValue(value, allowNegative) ?? undefined}
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
